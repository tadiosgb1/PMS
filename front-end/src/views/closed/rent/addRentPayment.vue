<template>
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
        Pay Rent
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
        <input type="hidden" v-model="form.rent_id" />

        <!-- Cycle IDs -->
     <!-- Cycle IDs -->
<div>
  <label class="block text-gray-700 mb-2 font-medium">Select Cycles</label>
  
  <div class="space-y-2 max-h-48 overflow-y-auto border rounded p-3">
    <div
      v-for="cycle in cycles"
      :key="cycle.id"
      class="flex items-center space-x-3 bg-gray-50 p-2 rounded hover:bg-gray-100 cursor-pointer"
    >
      <input
        type="checkbox"
        :value="cycle.id"
        v-model="form.cycle_ids"
        class="h-5 w-5 text-orange-500 border-gray-300 rounded focus:ring-orange-400"
      />
      <span class="text-gray-700">
        {{ cycle.cycle_start }} → {{ cycle.cycle_end }}
      </span>
    </div>
  </div>

  <p class="text-xs text-gray-500 mt-1">
    You can select multiple cycles.
  </p>
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
    visible: {
      type: Boolean,
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
      cycles: [],
    };
  },
  watch: {
    rentId: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchCycles(newVal);
        }
      },
    },
  },
  mounted(){
   this.fetchCycles(12)
  },
  methods: {
    async fetchCycles(rentId) {
      try {
        const response = await this.$apiGetById(`get_rent_cycles`,rentId);
        console.log("rent cycless",response)
        this.cycles = response.data || [];
        
      } catch (error) {
        console.error("Failed to fetch cycles:", error);
        this.cycles = [];
      }
    },
    async submitPayment() {
      try {
        console.log("cycles",this.form)
        const response = await this.$apiPost("make_payment", this.form);

        this.$emit("success", response);
        this.$emit("close");
      } catch (error) {
        console.error("Failed to make payment:", error);
        alert("Failed to submit payment.");
      }
    },
  },
};
</script>
