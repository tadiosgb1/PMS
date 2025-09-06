<template>
  <div>
    <!-- ✅ Toast Component -->
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <!-- Header -->
        <div
          class="bg-primary hover:bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
        >
          Add Maintenance Request
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="submitForm"
          class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
        >
          <!-- Description -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="custom-input"
              placeholder="Enter maintenance request description"
            ></textarea>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="custom-input">
              <option value="" disabled>Select status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <!-- Requested At -->
          <div>
            <label class="block text-gray-700 mb-1">Requested At</label>
            <input v-model="form.requested_at" type="date" class="custom-input" />
          </div>

          <!-- Resolved At -->
          <div>
            <label class="block text-gray-700 mb-1">Resolved At</label>
            <input v-model="form.resolved_at" type="date" class="custom-input" />
          </div>

          <!-- Property ID -->
          <div>
            <label class="block text-gray-700 mb-1">Property ID</label>
            <input
              v-model="form.property_id"
              type="number"
              class="custom-input"
              placeholder="Enter property ID"
            />
          </div>

          <!-- User ID -->
          <div>
            <label class="block text-gray-700 mb-1">User ID</label>
            <input
              v-model="form.user_id"
              type="number"
              class="custom-input"
              placeholder="Enter user ID"
            />
          </div>

          <!-- Submit -->
          <div class="md:col-span-2 text-right pt-2">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded border-orange-100 focus:ring-orange-300 shadow"
            >
              Save Request
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "MaintenanceRequestAdd",
  components: { Toast },
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        status: "",
        description: "",
        requested_at: "",
        resolved_at: "",
        user_id: "",
        property_id: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await this.$apiPost("/post_maintenance_request", this.form);
        this.$root.$refs.toast.showToast("Maintenance request saved successfully", "success");

        // Reset form
        this.form = {
          status: "",
          description: "",
          requested_at: "",
          resolved_at: "",
          user_id: "",
          property_id: "",
        };

        // Auto-close modal after 2s
        setTimeout(() => {
          this.$emit("close");
        }, 2000);
      } catch (error) {
        console.error("Error saving request:", error);
        this.$root.$refs.toast.showToast("Failed to save request", "error");
      }
    },
  },
};
</script>
