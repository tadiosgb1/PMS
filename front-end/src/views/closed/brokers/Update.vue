<template>
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg relative">
         <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
        >
          Update Broker
          <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">
            ✕
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="updateBroker" class="p-6 space-y-4">
          <!-- License Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >License Number</label
            >
            <input
              v-model="form.license_number"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter license number"
            />
          </div>

          <!-- Commission Rate -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Commission Rate (%)</label
            >
            <input
              v-model="form.commission_rate"
              type="number"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter commission rate"
            />
          </div>

          <!-- Wallet -->

          {{ this.brokerId }}
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Wallet</label
            >
            <input
              v-model="form.wallet"
              type="text"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter wallet balance"
            />
          </div>

          <!-- User ID -->
          <!-- <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >User ID</label
            >
            <input
              v-model="form.user"
              type="number"
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter user ID"
            />
          </div> -->

          <!-- Actions -->
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 rounded-lg border text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="loading"
              class="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
            >
              <span v-if="loading">Updating...</span>
              <span v-else>Update</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: "UpdateBroker",
  props: {
    visible: { type: Boolean, default: false },
    broker: { type: Object, default: null },
  },
  data() {
    return {
      form: {
        license_number: "",
        commission_rate: "",
        wallet: "",
        user: "",
      },
      loading: false,
    };
  },
  watch: {
    // Watch for modal visibility
    visible(val) {
      if (val && this.broker) {
        this.fillForm(this.broker);
      }
    },
    // Also watch if broker prop changes
    broker: {
      handler(newVal) {
        if (newVal && this.visible) {
          this.fillForm(newVal);
        }
      },
      deep: true,
    },
  },
  methods: {
    fillForm(broker) {
      this.form = {
        license_number: broker.license_number || "",
        commission_rate: broker.commission_rate || "",
        wallet: broker.wallet || "",
        user: broker.user || "",
      };
    },
    async updateBroker() {
      this.loading = true;
      try {
        const payload = { ...this.form };
        const res = await this.$apiPatch(`/update_broker_profile`, this.broker.id, payload);
        if (res) {
          this.$root.$refs.toast.showToast("Broker updated successfully", "success");
          this.$emit("success");
          this.$emit("close");
        }
      } catch (err) {
        console.error("Failed to update broker:", err);
        this.$root.$refs.toast.showToast("Failed to update broker", "error");
         this.$emit("success");
        this.$emit("close")
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
