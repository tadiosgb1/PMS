<template>
  <div class="p-6 min-h-screen bg-gray-100">
    <!-- Card -->
    <div class="bg-primary shadow-lg rounded-xl overflow-hidden ">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center px-6 py-4 border-b">
        <h1 class="text-2xl font-bold text-white mb-2 sm:mb-0">Commissions</h1>
        <button
          @click="showModal = true"
          class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
        <i class="fas fa-plus text-white mr-3"></i>  Add Commission
        </button>
      </div>

      <!-- Table -->
      <div class="overflow-x-auto">
        <table class="w-full text-left min-w-[600px]">
          <thead class="bg-gray-200">
            <tr>
              <th class="px-4 py-2">SaaS Commission</th>
              <th class="px-4 py-2">Broker Commission</th>
              <th class="px-4 py-2">Total Commission</th>
              <th class="px-4 py-2">Property Sale</th>
              <th class="px-4 py-2">Created At</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="commission in commissions"
              :key="commission.id"
              class="border-b hover:bg-gray-50 transition"
            >
              <td class="px-4 py-2">{{ commission.saas_commission }}</td>
              <td class="px-4 py-2">{{ commission.broker_commission }}</td>
              <td class="px-4 py-2">{{ commission.total_commission }}</td>
              <td class="px-4 py-2">{{ commission.property_sale_name || commission.property_sale }}</td>
              <td class="px-4 py-2">{{ commission.created_at | formatDate }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add Commission Modal -->
    <AddCommission
      :visible="showModal"
      @close="showModal = false"
      @success="fetchCommissions"
    />
  </div>
</template>

<script>
import AddCommission from "./Add.vue";

export default {
  name: "CommissionView",
  components: { AddCommission },
  data() {
    return {
      showModal: false,
      commissions: [],
    };
  },
  filters: {
    formatDate(value) {
      if (!value) return "";
      return new Date(value).toLocaleDateString();
    },
  },
  mounted() {
    this.fetchCommissions();
  },
  methods: {
    async fetchCommissions() {
      try {
        const res = await this.$apiGet("/get_commissions");
        this.commissions = res.data || [];
      } catch (err) {
        console.error("Failed to fetch commissions:", err);
      }
    },
  },
};
</script>
