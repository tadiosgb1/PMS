<template>
  <div>
    <Toast ref="toast" />
    <div
      v-if="visible"
      class="fixed inset-0 w-full z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <div
          class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
        >
          Edit Workspace Rental
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form
          @submit.prevent="submitForm"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label class="block text-gray-700">Guest Name</label>
            <input v-model="form.guest_name" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Guest Email</label>
            <input v-model="form.guest_email" type="email" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Guest Phone</label>
            <input v-model="form.guest_phone" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Cycle</label>
            <select v-model="form.cycle" class="custom-input">
              <option value="" disabled>Select cycle</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700">Start Date</label>
            <input v-model="form.start_date" type="date" class="custom-input" />
          </div>

          <div class="flex items-center space-x-3 mt-2">
            <input
              id="isActive"
              v-model="form.is_active"
              type="checkbox"
              class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label for="isActive" class="block text-gray-700">Active</label>
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Workspace</label>
            <select v-model="form.space" class="custom-input">
              <option value="" disabled>Select Workspace</option>
              <option v-for="space in spaces" :key="space.id" :value="space.id">
                {{ space.name }}
              </option>
            </select>
          </div>

          <div class="md:col-span-2 text-right mt-4">
            <button
              type="submit"
              class="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded shadow"
            >
              Update Rental
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "WorkspaceRentalUpdate",
  components: { Toast },
  props: {
    visible: Boolean,
    rental: Object,
  },
  data() {
    return {
      form: {
        id: null,
        guest_name: "",
        guest_email: "",
        guest_phone: "",
        cycle: "daily",
        start_date: "",
        is_active: true,
        user: 0,
        space: 0,
      },
      spaces: [], // fetch from API
    };
  },
  watch: {
    rental: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            id: val.id,
            guest_name: val.guest_name || "",
            guest_email: val.guest_email || "",
            guest_phone: val.guest_phone || "",
            cycle: val.cycle || "daily",
            start_date: val.start_date || "",
            is_active: val.is_active ?? true,
            user: val.user?.id || 0,   // use ID only
            space: val.space?.id || 0, // use ID only
          };
        }
      },
    },
  },
  mounted() {
    this.fetchSpaces();
  },
  methods: {
    async fetchSpaces() {
      try {
        const res = await this.$apiGet("/get_coworking_spaces");
        this.spaces = res.data || [];
      } catch (err) {
        console.error("Failed to fetch spaces:", err);
      }
    },
    async submitForm() {
      try {
        console.log("Updating rental:", this.form);

        // send PUT with correct body
        await this.$apiPut(`/update_workspace_rental`, this.form.id,this.form);

        this.$root.$refs.toast.showToast(
          "Workspace rental updated successfully",
          "success"
        );
        this.$emit("refresh");
        setTimeout(() => this.$emit("close"), 2000);
      } catch (err) {
        console.error("Update failed:", err);
        this.$root.$refs.toast.showToast("Failed to update rental", "error");
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary;
}
</style>
