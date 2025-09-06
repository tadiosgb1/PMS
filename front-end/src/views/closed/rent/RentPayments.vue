<template>
  <div class="bg-white shadow rounded-lg m-5">
    <!-- Header -->
    <div class="bg-primary text-white px-6 py-3 text-lg font-bold">
      Rent Payments
    </div>

    <!-- Table -->
    <div class="p-4 overflow-x-auto">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left">#</th>
            <th class="px-3 py-2 text-left">Amount</th>
            <th class="px-3 py-2 text-left">Due Date</th>
            <th class="px-3 py-2 text-left">Payment Method</th>
            <th class="px-3 py-2 text-left">Transaction ID</th>
            <th class="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in payments" :key="payment.id" class="border-t">
            <td class="px-3 py-2">{{ index + 1 }}</td>
            <td class="px-3 py-2">{{ payment.amount }} ETB</td>
            <td class="px-3 py-2">{{ formatDate(payment.due_date) }}</td>
            <td class="px-3 py-2">{{ payment.payment_method }}</td>
            <td class="px-3 py-2">{{ payment.transaction_id }}</td>
            <td class="px-3 py-2">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="{
                  'bg-green-100 text-green-800': payment.status === 'paid',
                  'bg-red-100 text-red-800': payment.status === 'pending'
                }"
              >
                {{ payment.status }}
              </span>
            </td>
          </tr>
          <tr v-if="payments.length === 0">
            <td colspan="6" class="px-3 py-4 text-center text-gray-500">
              No payments found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "RentPayments",
  data() {
    return {
      payments: []
    };
  },
  methods: {
    async fetchPayments() {
      try {
        const response = await this.$apiGet(`/get_payments`);
        console.log("Payments response:", response);

        this.payments = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        console.error("Failed to fetch payments:", error);
        this.payments = [];
      }
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString();
    }
  },
  mounted() {
    this.fetchPayments();
  }
};
</script>
