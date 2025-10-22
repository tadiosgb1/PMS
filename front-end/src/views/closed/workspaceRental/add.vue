<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
  >
    <div
      class="bg-white w-full max-w-full sm:max-w-[90%] md:max-w-[900px] lg:max-w-[1050px] rounded-lg shadow-lg overflow-visible relative mx-auto"
    >
      <!-- Header -->
      <div
        class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
      >
        Add Workspace Rental
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4 px-6 py-6">
        <!-- Row 1 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Guest Name</label>
            <input
              v-model="form.guest_name"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Guest Email</label>
            <input
              v-model="form.guest_email"
              type="email"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Row 2 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Guest Phone</label>
            <input
              v-model="form.guest_phone"
              type="tel"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Rental Cycle</label>
            <select
              v-model="form.cycle"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">Select Cycle</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        <!-- Row 3 -->
        <div>
          <label class="block text-sm font-medium mb-1">Start Date</label>
          <input
            v-model="form.start_date"
            type="date"
            required
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Row 4: Workspace Search -->
        <div class="relative">
          <label class="block text-sm font-medium mb-1">Workspace</label>
          <input
            v-model="spaceSearch"
            type="text"
            placeholder="Search workspace..."
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            @input="searchSpaces"
            @focus="spaceDropdown = true"
            @blur="hideDropdown"
            required
          />
          <ul
            v-if="spaces.length > 0 && spaceDropdown"
            class="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow mt-1"
          >
            <li
              v-for="space in spaces"
              :key="space.id"
              class="p-2 hover:bg-gray-100 cursor-pointer"
              @mousedown.prevent="selectSpace(space)"
            >
              {{ space.name }}
            </li>
          </ul>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
          <button
            type="submit"
            :disabled="isSaving"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-70 flex items-center"
          >
            <span v-if="!isSaving">💾 Save Rental</span>
            <span v-else>⏳ Saving...</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddRental",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      isSaving: false,
      form: {
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        cycle: "",
        start_date: "",
        is_active: true,
        user: localStorage.getItem("userId") || 0,
        space: "",
      },
      spaces: [],
      spaceSearch: "",
      spaceDropdown: false,
    };
  },
  async mounted() {
    this.fetchSpaces();
  },
  methods: {
    async fetchSpaces() {
      try {
        const response = await this.$getCoworkingSpaces();
        this.spaces = response.spaces || [];
        console.log("spaces", this.spaces);
      } catch (err) {
        console.error("Failed to fetch spaces:", err);
      }
    },

    async searchSpaces() {
      try {
        const response = await this.$getCoworkingSpaces();
        if (this.spaceSearch) {
          this.spaces = response.spaces.filter((s) =>
            s.name.toLowerCase().includes(this.spaceSearch.toLowerCase())
          );
        } else {
          this.spaces = response.spaces;
        }
      } catch (error) {
        console.error("Failed to search spaces:", error);
      }
    },

    selectSpace(space) {
      this.form.space = space.id;
      this.spaceSearch = space.name;
      this.spaceDropdown = false;
    },

    hideDropdown() {
      setTimeout(() => {
        this.spaceDropdown = false;
      }, 200);
    },

    async submitForm() {
      this.isSaving = true;
      try {
        const payload = { ...this.form };
        const res = await this.$apiPost("/post_workspace_rental", payload);
        console.log("Rental added:", res);
        this.$emit("success");
        this.resetForm();
        this.$emit("close");
      } catch (err) {
        console.error("Failed to add rental:", err);
        alert("Failed to add workspace rental.");
      } finally {
        this.isSaving = false;
      }
    },

    resetForm() {
      this.form = {
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        cycle: "",
        start_date: "",
        is_active: true,
        user: localStorage.getItem("userId") || 0,
        space: "",
      };
      this.spaceSearch = "";
    },
  },
};
</script>
