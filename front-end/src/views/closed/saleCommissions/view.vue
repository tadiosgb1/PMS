<template>
  <div class="p-6 min-h-screen bg-gray-100">
    <!-- Card Container -->
        <Loading :visible="loading" message="Loading Sale commussion..." />
    <div class="bg-white shadow-lg overflow-hidden rounded-lg">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row justify-between items-center px-6 py-4 bg-primary">
        <h1 class="text-2xl font-bold text-white mb-2 sm:mb-0">Sale Commissions</h1>
        <button
          @click="showModal = true"
          class="px-4 py-2 text-white rounded-lg hover:bg-orange-600 transition flex items-center"
        >
          <i class="fas fa-plus mr-2"></i> Add Commission
        </button>
      </div>

      <!-- Desktop Table -->
      <div class="overflow-x-auto hidden md:block">
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
            <tr v-if="commissions.length === 0">
              <td colspan="5" class="text-center py-6 text-gray-500">No commissions found.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Mobile / Tablet Card View -->
      <div class="md:hidden space-y-4">
        <div
          v-for="commission in commissions"
          :key="commission.id"
          class="border rounded-lg p-4 bg-gray-50 shadow-sm"
        >
          <div class="flex justify-between items-center mb-2">
            <span class="font-semibold text-lg">Total: {{ commission.total_commission }}</span>
            <span class="text-gray-500 text-sm">{{ commission.created_at | formatDate }}</span>
          </div>
          <p><span class="font-semibold">SaaS:</span> {{ commission.saas_commission }}</p>
          <p><span class="font-semibold">Broker:</span> {{ commission.broker_commission }}</p>
          <p><span class="font-semibold">Property Sale:</span> {{ commission.property_sale_name || commission.property_sale }}</p>
        </div>
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
import Loading from "@/components/Loading.vue";
export default {
  name: "CommissionView",
  components: { AddCommission,Loading },
  data() {
    return {
      showModal: false,
      commissions: [],
      loading:false,
    };
  },
  filters: {
    formatDate(value) {
      if (!value) return "";
      return new Date(value).toLocaleDateString();
    },
  },
  mounted() {
   const is_super_user=localStorage.getItem('is_superuser');
    //console.log("haspermission=",this.$hasPermission("pms.view_plan"));
    if(is_super_user=='true'){
       this.fetchCommissions();
    }else{
      this.$router.push({
        name:'accessDenied'
      });
    }
  },
  methods: {
    async fetchCommissions() {
      this.loading=true;
      try {
        const res = await this.$apiGet("/get_commissions");
        this.commissions = res.data || [];
      } catch (err) {
        console.error("Failed to fetch commissions:", err);
      }finally{
        this.loading=false;
      }
    },
  },
};
</script>
