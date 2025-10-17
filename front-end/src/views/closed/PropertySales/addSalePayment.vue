<template>
  <div>
    <!-- Toast -->
    <Toast ref="toast" />
  </div>

  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div
      class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
    >
      <!-- Header -->
      <div
        class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
      >
        Make Sales Payment
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <form
        @submit.prevent="submitPayment"
        class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto"
      >
        <!-- Buyer Information -->
        <div class="relative md:col-span-2 border-t pt-4 mt-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">Buyer Information</h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              v-model="buyer.first_name"
              placeholder="First Name"
              class="custom-input"
              required
            />
            <input
              v-model="buyer.middle_name"
              placeholder="Middle Name"
              class="custom-input"
            />
            <input
              v-model="buyer.last_name"
              placeholder="Last Name"
              class="custom-input"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <input
              v-model="buyer.email"
              type="email"
              placeholder="Email"
              class="custom-input"
              required
            />
            <input
              v-model="buyer.phone_number"
              type="text"
              placeholder="Phone Number"
              class="custom-input"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <input
              v-model="buyer.password"
              type="password"
              placeholder="Password"
              class="custom-input"
              required
            />
            <input
              v-model="buyer.address"
              type="text"
              placeholder="Address"
              class="custom-input"
            />
          </div>
        </div>

        <!-- Amount -->
        <div>
          <label class="block text-gray-700 mb-1">Amount</label>
          <input
            v-model.number="form.amount"
            type="number"
            class="custom-input"
            placeholder="Enter amount"
            required
          />
        </div>

        <!-- Due Date -->
        <div>
          <label class="block text-gray-700 mb-1">Due Date</label>
          <input
            v-model="form.due_date"
            type="date"
            class="custom-input"
            required
          />
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block text-gray-700 mb-1">Payment Method</label>
          <select
            v-model="form.payment_method"
            class="custom-select"
            required
          >
            <option value="">Select method</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank Transfer</option>
            <option value="cbe">CBE</option>
            <option value="telebirr">Tele Birr</option>
          </select>
        </div>

        <!-- Transaction ID -->
        <div>
          <label class="block text-gray-700 mb-1">Transaction ID</label>
          <input
            v-model="form.transaction_id"
            type="text"
            class="custom-input"
            placeholder="Enter transaction ID"
            required
          />
        </div>

        <!-- Status -->
        <div>
          <label class="block text-gray-700 mb-1">Status</label>
          <select
            v-model="form.status"
            class="custom-select"
            required
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-6 md:col-span-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
          >
            Cancel
          </button>

          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 rounded text-white transition-all duration-200"
            :class="loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'"
          >
            <span v-if="!loading">Submit</span>
            <span v-else class="flex items-center space-x-2">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Saving...</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "MakeSalesPaymentModal",
  components: { Toast },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    saleId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      form: {
        amount: 0,
        due_date: "",
        status: "pending",
        payment_method: "",
        transaction_id: "",
        property_zone_sale_id: this.saleId,
        buyer_id: "",
      },
      buyer: {
        password: "",
        last_login: new Date().toISOString(),
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        date_joined: new Date().toISOString(),
        is_active: true,
        is_staff: false,
        is_superuser: false,
      },
    };
  },
  methods: {
    async submitPayment() {
      this.loading = true;
      try {
        // Step 1: Create buyer
        const buyerRes = await this.$apiPost("/post_user", this.buyer);
        if (!buyerRes.id) throw new Error("Failed to create buyer");

        // Step 2: Assign to 'buyer' group
        await this.$apiPost("/set_user_groups", {
          user_id: buyerRes.id,
          groups: ["buyer"],
        });

        // Step 3: Post sale payment
        const paymentPayload = { ...this.form, buyer_id: buyerRes.id };
        const res = await this.$apiPost("post_sales_payment", paymentPayload);

        if (res) {
          this.$root.$refs.toast.showToast("Sale payment submitted successfully", "success");

          // Step 4: Activate the sale
          const subPayload = { status: "active" };
          const resSub = await this.$apiPatch(
            `/update_property_zone_sale`,
            res.property_zone_sale_id,
            subPayload
          );

          if (resSub) {
            this.$root.$refs.toast.showToast("Sale activated successfully!", "success");
            this.$reloadPage();
          }
        }

        this.$emit("success");
        this.$emit("close");
      } catch (error) {
        console.error("Failed to post payment:", error);
        this.$root.$refs.toast.showToast(
          error.message || "Failed to submit payment",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary;
}
.custom-select {
  @apply border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
