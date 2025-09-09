<template>
  <div
  v-if="visible"
   class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto">
      <!-- Close button (X) -->
       <div
          class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
        >
          Pay Rent
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>
     

      <form @submit.prevent="submitPayment" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
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
    visible:{
      type:Boolean,
      required:true
    }
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
