<template>
  <div
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
  >
    <div class="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
      <!-- Close button (X) -->
      <button
        @click="$emit('close')"
        class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <h2 class="text-lg font-bold mb-4">Make Payment</h2>

      <form @submit.prevent="submitPayment" class="space-y-4">
        <!-- Rent ID (hidden) -->
        <input type="hidden" v-model="form.rent_id" />

        <!-- Cycle IDs -->
        <div>
          <label class="block text-gray-700 mb-1">Cycle IDs</label>
          <select
            v-model="form.cycle_ids"
            multiple
            class="w-full border rounded p-2"
            required
          >
            <option v-for="cycle in cycles" :key="cycle.id" :value="cycle.id">
              {{ cycle.name }}
            </option>
          </select>
          <p class="text-xs text-gray-500">Hold Ctrl/Cmd to select multiple.</p>
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
            <option value="mobile">Mobile Payment</option>
          </select>
        </div>

        <!-- Transaction ID -->
        <div>
          <label class="block text-gray-700 mb-1">Transaction ID</label>
          <input
            v-model="form.transaction_id"
            type="text"
            class="w-full border rounded p-2"
            placeholder="Enter transaction ID"
            required
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "MakePaymentModal",
  props: {
    rentId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      form: {
        rent_id: this.rentId,
        cycle_ids: [],
        payment_method: "",
        transaction_id: "",
      },
      cycles: [
        // Example cycles, replace with API later
        { id: 1, name: "Cycle 1" },
        { id: 2, name: "Cycle 2" },
        { id: 3, name: "Cycle 3" },
      ],
    };
  },
  mounted(){
    console.log("rent payment add");
  },
  methods: {
    async submitPayment() {
        console.log("this form",this.form)
      try {
        const response = await this.$apiPost("make_payment", this.form);
        console.log("Payment response:", response);

        this.$emit("success", response);
        this.$emit("close"); // Close modal after success
      } catch (error) {
        console.error("Failed to make payment:", error);
        alert("Failed to submit payment.");
      }
    },
  },
};
</script>
