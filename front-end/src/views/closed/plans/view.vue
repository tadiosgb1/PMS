<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Plans
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add
          </button>
        </div>

        <div class="p-6">
          <!-- Search -->
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Plan..."
            class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <!-- Desktop Table -->
          <div class="overflow-x-auto hidden md:block">
            <table class="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('name')">
                    Name <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('max_locations')">
                    Max Locations <SortIcon :field="'max_locations'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('max_staff')">
                    Max Staff <SortIcon :field="'max_staff'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('max_users')">
                    Max Users <SortIcon :field="'max_users'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('price')">
                    Price <SortIcon :field="'price'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('billing_cycle')">
                    Billing Cycle <SortIcon :field="'billing_cycle'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="plan in filteredAndSortedPlans" :key="plan.id" class="hover:bg-gray-100">
                  <td class="border border-gray-300 px-4 py-2">{{ plan.name }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ plan.max_locations }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ plan.max_staff }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ plan.max_users }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ plan.price }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ plan.billing_cycle }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                    <button @click="editPlan(plan)" class="text-blue-600 hover:text-blue-800">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="askDeleteConfirmation(plan)" class="text-red-600 hover:text-red-800">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedPlans.length === 0">
                  <td colspan="7" class="text-center py-6 text-gray-500">No plans found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile / Tablet Card View -->
          <div class="md:hidden space-y-4">
            <div
              v-for="plan in filteredAndSortedPlans"
              :key="plan.id"
              class="border rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-lg">{{ plan.name }}</span>
                <div class="space-x-2">
                  <button @click="editPlan(plan)" class="text-blue-600 hover:text-blue-800">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="askDeleteConfirmation(plan)" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              <p><span class="font-semibold">Max Locations:</span> {{ plan.max_locations }}</p>
              <p><span class="font-semibold">Max Staff:</span> {{ plan.max_staff }}</p>
              <p><span class="font-semibold">Max Users:</span> {{ plan.max_users }}</p>
              <p><span class="font-semibold">Price:</span> {{ plan.price }}</p>
              <p><span class="font-semibold">Billing Cycle:</span> {{ plan.billing_cycle }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddPlan v-if="visible" :visible="visible" @close="visible = false" />
    <ConfirmModal
      v-if="confirmVisible"
      :visible="confirmVisible"
      title="Confirm Deletion"
      message="Are you sure you want to delete this plan?"
      @confirm="confirmDelete"
      @cancel="confirmVisible = false"
    />
    <UpdatePlan
      v-if="updateVisible"
      :visible="updateVisible"
      :plan="planToEdit"
      @close="updateVisible = false"
      @refresh="fetchPlans"
    />
  </div>
</template>


<script>
import AddPlan from '@/views/closed/plans/add.vue';
import ConfirmModal from '@/components/ConfirmModal.vue'; // adjust path as needed
import UpdatePlan from '@/views/closed/plans/update.vue';
import Toast from "../../../components/Toast.vue";


const SortIcon = {
  props: ['field', 'sortKey', 'sortAsc'],
  template: `
    <span class="inline-block ml-1 text-gray-500">
      <svg v-if="sortKey !== field" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
      <svg v-else-if="sortAsc" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13l4 4 4-4m0-6l-4-4-4 4"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
    </span>
  `
};

export default {
  name: 'plansView',
  components: { SortIcon, AddPlan, ConfirmModal, UpdatePlan ,Toast },
  data() {
    return {
      searchTerm: '',
      visible: false,

      confirmVisible: false,
      planToDelete: null,

      updateVisible: false,
      planToEdit: null,

      sortKey: 'name',
      sortAsc: true,
      plans: [],
    };
  },
  computed: {
    filteredAndSortedPlans() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.plans.filter(s =>
        s.name.toLowerCase().includes(term) ||
        String(s.max_locations).toLowerCase().includes(term) ||
        String(s.max_staff).toLowerCase().includes(term) ||
        String(s.max_kds).toLowerCase().includes(term) ||
        s.kds_enabled.toLowerCase().includes(term) ||
        String(s.price).toLowerCase().includes(term) ||
        s.billing_cycle.toLowerCase().includes(term)
      );

      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });

      return filtered;
    }
  },
  mounted() {
   const is_super_user=localStorage.getItem('is_superuser');
    //console.log("haspermission=",this.$hasPermission("pms.view_plan"));
    if(is_super_user=='true'){
       this.fetchPlans();
    }else{
      this.$router.push({
        name:'accessDenied'
      });
    }
  },
  methods: {
    async fetchPlans() {
      try {
        const response = await this.$apiGet("/get_plans");
        if (Array.isArray(response.data)) {
          this.plans = response.data;
        } else {
          console.warn("Unexpected response format:", response);
          this.plans = [];
        }
      } catch (error) {
        console.error("Failed to fetch plans:", error);
        this.plans = [];
        alert("Failed to load plans. Please try again later.");
      }
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    editPlan(plan) {
  this.planToEdit = plan;
  this.updateVisible = true;
}
,
    askDeleteConfirmation(plan) {
  this.planToDelete = plan;
  this.confirmVisible = true;
},

async confirmDelete() {
  this.confirmVisible = false;
  try {
    const response = await this.$apiDelete(`/delete_plan/${this.planToDelete.id}`);
    this.$root.$refs.toast.showToast(response.message, 'success');
    this.fetchPlans();
  } catch (error) {
    alert("Failed to delete plan.");
    console.error(error);
  }
  this.planToDelete = null;
},

  }
};
</script>
