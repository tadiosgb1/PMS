<template>
  <div class="bg-white rounded-lg shadow p-4">
        <Loading :visible="loading" message="Loading broker transactions..." />

    <h2 class="text-xl font-semibold mb-4">Broker Transactions</h2>

    <!-- Desktop Table -->
    <div class="hidden md:block overflow-x-auto">
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

    <!-- Mobile Card View -->
    <div class="md:hidden space-y-4">
      <div
        v-for="txn in transactions"
        :key="txn.id"
        class="border rounded-lg p-4 shadow-sm bg-gray-50"
      >
        <p><span class="font-semibold">Amount:</span> {{ txn.amount }}</p>
        <p><span class="font-semibold">Type:</span> {{ txn.transaction_type }}</p>
        <p><span class="font-semibold">Created At:</span> {{ formatDate(txn.created_at) }}</p>
        <p><span class="font-semibold">Updated At:</span> {{ formatDate(txn.updated_at) }}</p>
        <p><span class="font-semibold">ID:</span> {{ txn.id }}</p>
      </div>
      <p v-if="transactions.length === 0" class="text-center text-gray-400">No transactions found</p>
    </div>
  </div>
</template>


<script>
import Loading from "@/components/Loading.vue";
export default {
  components:{
    Loading
  },
  data() {
    return {
      transactions: [],
      loading:false,
    };
  },
  mounted() {
    this.fetchBrokerTransactions();
  },
  methods: {
    async fetchBrokerTransactions() {
      this.loading=true;
      try {
        const res = await this.$apiGet("/get_broker_transactions");
        this.transactions = res?.data || [];
      } catch (err) {
        console.error("Failed to load Broker transactions:", err);
      }finally{
        this.loading=false;
      }
    },
    formatDate(dateStr) {
      return new Date(dateStr).toLocaleString();
    },
  },
};
</script>
