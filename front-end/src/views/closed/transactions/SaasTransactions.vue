<template>
  <div class="bg-white rounded-lg shadow p-4">
    <h2 class="text-xl font-semibold mb-4">SaaS Transactions</h2>

    <table class="min-w-full border border-gray-200 divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Transaction Type</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Created At</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">Updated At</th>
          <th class="px-4 py-2 text-left text-sm font-medium text-gray-700">ID</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-200">
        <tr v-for="txn in transactions" :key="txn.id">
          <td class="px-4 py-2">{{ txn.amount }}</td>
          <td class="px-4 py-2 capitalize">{{ txn.transaction_type }}</td>
          <td class="px-4 py-2">{{ formatDate(txn.created_at) }}</td>
          <td class="px-4 py-2">{{ formatDate(txn.updated_at) }}</td>
          <td class="px-4 py-2 text-gray-500">{{ txn.id }}</td>
        </tr>
        <tr v-if="transactions.length === 0">
          <td colspan="5" class="text-center py-4 text-gray-400">No transactions found</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      transactions: [],
    };
  },
  mounted() {
    this.fetchSaasTransactions();
  },
  methods: {
    async fetchSaasTransactions() {
      try {
        const res = await this.$apiGet("/get_saas_transactions");
        this.transactions = res?.data || [];
      } catch (err) {
        console.error("Failed to load SaaS transactions:", err);
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },
  },
};
</script>
