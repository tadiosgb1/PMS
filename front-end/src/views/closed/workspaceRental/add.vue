<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div
      class="bg-white w-full max-w-full sm:max-w-[90%] md:max-w-[900px] lg:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
    >
      <!-- Close Button -->
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
        <!-- Row 1: Guest Name + Guest Email -->
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

        <!-- Row 2: Guest Phone + Rental Cycle -->
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

        <!-- Row 3: Start Date (full width) -->
        <div>
          <label class="block text-sm font-medium mb-1">Start Date</label>
          <input
            v-model="form.start_date"
            type="date"
            required
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Row 4: Active checkbox (full width) -->
        <div>
          <label class="inline-flex items-center mt-2">
            <input
              type="checkbox"
              v-model="form.is_active"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2 text-gray-700">Active</span>
          </label>
        </div>

        <!-- Row 5: User + Space -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">User</label>
            <select
              v-model.number="form.user"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">Select User</option>
              <option
                v-for="user in users"
                :key="user.id"
                :value="user.id"
              >
                {{ user.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Space</label>
            <select
              v-model.number="form.space"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            >
              <option disabled value="">Select Space</option>
              <option
                v-for="space in spaces"
                :key="space.id"
                :value="space.id"
              >
                {{ space.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
          <button
            type="submit"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Save Rental
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
      form: {
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        cycle: "",
        start_date: "",
        is_active: true,
        user: 0,
        space: 0,
      },
      users: [],
      spaces: [],
    };
  },
  async mounted() {
    // Fetch users and spaces for dropdowns
    try {
      const usersRes = await this.$apiGet("/get_users");
      this.users = usersRes.data || [];

      const spacesRes = await this.$apiGet("/get_coworking_spaces");
      this.spaces = spacesRes.data.data || [];
    } catch (err) {
      console.error("Failed to fetch users or spaces:", err);
    }
  },
  methods: {
    async submitForm() {
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
        user: 0,
        space: 0,
      };
    },
  },
};
</script>
