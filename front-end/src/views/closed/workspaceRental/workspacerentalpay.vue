<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto"
  >
    <div
      class="bg-white w-full sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-visible relative mx-auto"
    >
      <!-- Header -->
      <div
        class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
      >
        Pay Workspace Rental
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Tabs -->
      <div class="flex border-b bg-gray-50">
        <button
          class="flex-1 py-3 text-center font-medium"
          :class="tab === 'manual' ? 'border-b-4 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'"
          @click="tab = 'manual'"
        >
          Manual Payment
        </button>
        <button
          class="flex-1 py-3 text-center font-medium"
          :class="tab === 'telebirr' ? 'border-b-4 border-orange-500 text-orange-600' : 'text-gray-500 hover:text-gray-700'"
          @click="tab = 'telebirr'"
        >
          Telebirr Checkout
        </button>
      </div>

      <!-- Manual Payment Form -->
      <form
        v-if="tab === 'manual'"
        @submit.prevent="submitPayment"
        class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto"
      >
        <input type="hidden" v-model="form.rental" />

        <!-- Amount -->
        <div>
          <label class="block text-gray-700 mb-1">Amount</label>
          <input
            v-model="form.amount"
            type="number"
            class="w-full border rounded p-2"
            placeholder="Enter amount"
            required
          />
        </div>

        <!-- Payment Method -->
        <div>
          <label class="block text-gray-700 mb-1">Payment Method</label>
          <select
            v-model="form.payment_method"
            class="w-full border rounded p-2"
            required
          >
            <option value="">Select method</option>
            <option value="cash">Cash</option>
            <option value="bank">Bank Transfer</option>
            <option value="tellebirr">Tellebirr</option>
          </select>
        </div>

        <!-- Transaction ID -->
        <div class="md:col-span-2">
          <label class="block text-gray-700 mb-1">Transaction ID</label>
          <input
            v-model="form.transaction_id"
            type="text"
            class="w-full border rounded p-2"
            placeholder="Enter transaction ID"
            required
          />
        </div>

        <!-- Cycle End -->
        <div class="md:col-span-2">
          <label class="block text-gray-700 mb-1">Cycle End</label>
          <input
            v-model="form.cycle_end"
            type="date"
            class="w-full border rounded p-2"
            required
          />
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
            class="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Submit
          </button>
        </div>
      </form>

      <!-- Telebirr Checkout -->
      <div
        v-if="tab === 'telebirr'"
        class="p-6 flex flex-col justify-center items-center space-y-6 max-h-[80vh] overflow-y-auto"
      >
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            Pay via Telebirr
          </h2>
          <p class="text-gray-600 text-sm">
            Securely complete your workspace rental payment using your Telebirr
            account.
          </p>
        </div>

        <!-- Amount Input -->
        <div class="w-full sm:w-2/3">
          <label class="block text-gray-700 mb-1">Amount</label>
          <input
            v-model="form.amount"
            type="number"
            placeholder="Enter amount"
            class="w-full border rounded p-2"
            required
          />
        </div>

        <!-- Telebirr Pay Button -->
        <button
          @click="startTelebirrCheckout"
          class="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg shadow-md text-lg font-medium flex items-center justify-center space-x-2"
        >
          <img
            src="https://teller.telebirr.com.et/teller/img/telebirr_logo.svg"
            alt="Telebirr"
            class="w-6 h-6"
          />
          <span>Pay with Telebirr</span>
        </button>

        <div class="flex justify-end space-x-3 mt-8">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "WorkspaceRentalPay",
  components: { Toast },
  props: {
    rentalId: {
      type: Number,
      required: true,
    },
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      tab: "manual", // manual or telebirr
      form: {
        amount: "",
        status: "pending",
        payment_method: "",
        transaction_id: "",
        
        cycle_end: "",
        rental: this.rentalId,
      },
    };
  },
  watch: {
    rentalId: {
      immediate: true,
      handler(newVal) {
        if (newVal) this.form.rental = newVal;
      },
    },
  },
  methods: {
    async submitPayment() {
      try {
        const response = await this.$apiPost("/post_rental_payment", this.form);
        this.$root.$refs.toast.showToast(
          "Payment submitted successfully",
          "success"
        );
       // this.$emit("success", response);
       this.$reloadPage();
        this.$emit("close");
      } catch (error) {
        console.error("Failed to submit payment:", error);
        this.$root.$refs.toast.showToast("Failed to submit payment", "error");
      }
    },

    async startTelebirrCheckout() {
      if (!this.form.amount) {
        this.$root.$refs.toast.showToast("Please enter an amount", "warning");
        return;
      }

      try {
        // Example backend call that initializes Telebirr checkout
        const response = await this.$apiPost("/telebirr_checkout", {
          amount: this.form.amount,
          rental: this.form.rental,
        });

        if (response.checkout_url) {
          window.open(response.checkout_url, "_blank");
          this.$root.$refs.toast.showToast(
            "Telebirr checkout opened successfully",
            "success"
          );
        } else {
          throw new Error("No checkout URL returned");
        }
      } catch (error) {
        console.error("Telebirr checkout failed:", error);
        this.$root.$refs.toast.showToast("Telebirr checkout failed", "error");
      }
    },
  },
};
</script>
