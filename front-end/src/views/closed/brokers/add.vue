<template>
  <div>
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
          class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
        >
          Add New Broker
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
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
        >
          <!-- License Number -->
          <div>
            <label class="block text-gray-700 mb-1">License Number</label>
            <input
              v-model="form.license_number"
              type="text"
              class="custom-input"
              placeholder="Enter license number"
              required
            />
          </div>

          <!-- Commission Rate -->
          <div>
            <label class="block text-gray-700 mb-1">Commission Rate</label>
            <input
              v-model="form.commission_rate"
              type="text"
              class="custom-input"
              placeholder="Enter commission rate"
              required
            />
          </div>

          <!-- Wallet -->
          <div>
            <label class="block text-gray-700 mb-1">Wallet</label>
            <input
              v-model="form.wallet"
              type="text"
              class="custom-input"
              placeholder="Enter wallet ID or address"
              required
            />
          </div>

          <!-- User ID (readonly) -->
          <div>
            <label class="block text-gray-700 mb-1">User ID</label>
            <input
              v-model="form.user"
              type="number"
              class="custom-input bg-gray-100 cursor-not-allowed"
              readonly
            />
          </div>

          <!-- Actions -->
          <div class="md:col-span-2 text-right pt-4">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200"
            >
              Save Broker
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
  name: "AddBroker",
  components: { Toast },
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        license_number: "",
        commission_rate: "",
        wallet: "",
        user: Number(localStorage.getItem("userId")) || 0,
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await this.$apiPost("/post_broker", this.form);
        this.$root.$refs.toast.showToast(
          response.message || "Broker added successfully",
          "success"
        );
        setTimeout(() => {
          this.$emit("close");
          this.$emit("success"); // refresh parent list
        }, 1500);
      } catch (error) {
        console.error(error);
        this.$refs.toast.showToast("Failed to add broker", "error");
      }
    },
  },
};
</script>
