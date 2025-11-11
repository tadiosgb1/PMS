<template>
  <div>
    <Toast ref="toast" />
     <Loading :visible="loading" message="Loading users..." />

    <div class="min-h-screen bg-gray-100 m-3">
       <!-- Reusable Loading Component -->
      <Loading :visible="loading" message="Loading Brokers..." />
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex flex-col sm:flex-row justify-between items-center gap-2"
        >
          Brokers
          <button
            @click="showAddBroker = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add
          </button>
        </div>

        <!-- Search & Page Size -->
        <div class="p-6 flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Brokers..."
            @input="onSearchInput"
            class="w-full sm:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex items-center gap-2">
            <label for="pageSize" class="text-gray-700">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchBrokers"
              class="border px-2 py-1 rounded"
            >
              <option v-for="size in pageSizes" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
            <span class="text-gray-700">per page</span>
          </div>
        </div>

        <!-- ✅ Desktop Table -->
        <div class="hidden md:block overflow-x-auto p-6">
          <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('name')">
                  Broker Name
                  <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                </th>
                <th class="border border-gray-300 px-4 py-2">License Number</th>
                <th class="border border-gray-300 px-4 py-2">Commission Rate</th>
                <th class="border border-gray-300 px-4 py-2">Wallet</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="broker in brokers" :key="broker.id" class="hover:bg-gray-100">
                <td class="border border-gray-300 px-4 py-2">
                  {{ broker.first_name }} {{ broker.middle_name }} {{ broker.last_name }}
                  <button @click="goToUserDetail(broker.user)" class="text-green-600 hover:text-green-800 ml-2" title="Detail">
                    <i class="fas fa-info-circle"></i>
                  </button>
                </td>
                <td class="border border-gray-300 px-4 py-2">{{ broker.license_number }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ broker.commission_rate }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ broker.wallet }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
             
<button @click="openUpdateModal(broker)" class="text-green-600 hover:text-green-800">
  <i class="fas fa-edit"></i>
</button>
                  <button @click="askDeleteConfirmation(broker)" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="brokers.length === 0">
                <td colspan="5" class="text-center py-6 text-gray-500">No brokers found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ✅ Mobile & Tablet Cards -->
        <div class="block md:hidden p-4 space-y-4">
          <div v-for="broker in brokers" :key="broker.id" class="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold text-gray-900 text-base">
                {{ broker.first_name }} {{ broker.middle_name }} {{ broker.last_name }}
              </h3>
            </div>
            <p class="text-sm text-gray-700"><strong>License:</strong> {{ broker.license_number }}</p>
            <p class="text-sm text-gray-700"><strong>Commission Rate:</strong> {{ broker.commission_rate }}</p>
            <p class="text-sm text-gray-700"><strong>Wallet:</strong> {{ broker.wallet }}</p>
            <div class="mt-3 flex flex-wrap gap-2">
              <button @click="goToUserDetail(broker.user)" class="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition">Details</button>
              <button @click="openUpdateModal(broker)" class="text-green-600 hover:text-green-800">
  <i class="fas fa-edit"></i>
</button>


              <button v-if="broker" @click="askDeleteConfirmation(broker)" class="px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition">Delete</button>
            </div>
          </div>
          <div v-if="brokers.length === 0" class="text-center text-gray-500 py-6">No brokers found.</div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-6">
          <button :disabled="!previous" @click="fetchBrokers(previous)" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Previous</button>
          <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button :disabled="!next" @click="fetchBrokers(next)" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Next</button>
        </div>
      </div>

      <!-- Add & Update Modals -->
      <AddBroker :visible="showAddBroker" @close="showAddBroker = false" @success="fetchBrokers" />
      <UpdateBroker
  :visible="showUpdateModal"
  :broker="selectedBroker"
  @close="showUpdateModal = false"
  @success="fetchBrokers"
/>


      <!-- Delete Confirmation Modal -->
      <ConfirmModal :visible="confirmVisible" title="Confirm Deletion" message="Are you sure you want to delete this broker?" @confirm="confirmDelete" @cancel="confirmVisible = false" />
    </div>
  </div>
</template>


<script>
import Toast from "@/components/Toast.vue";
import AddBroker from "./Add.vue";
import UpdateBroker from "./Update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
<<<<<<< HEAD
import Loading from "@/components/Loading.vue"; // <-- Added Loading
=======
import Loading from "@/components/Loading.vue";
>>>>>>> 42219413ad9416df7a8c2f30919fe268f63746f2

const SortIcon = {
  props: ["field", "sortKey", "sortAsc"],
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
  `,
};

export default {
  name: "BrokersView",
<<<<<<< HEAD
  components: { Toast, AddBroker, UpdateBroker, ConfirmModal, SortIcon,Loading },
=======
  components: { Toast, AddBroker, UpdateBroker, ConfirmModal, SortIcon ,Loading},
>>>>>>> 42219413ad9416df7a8c2f30919fe268f63746f2
  data() {
    return {
      selectedBrokerId: null,
      searchTerm: "",
      brokers: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50, 100],
      showAddBroker: false,
      showUpdateModal: false,
      confirmVisible: false,
      brokerToDelete: null,
      sortKey: "name",
      sortAsc: true,
      searchTimeout: null,
      selectedBroker: null,
      loading:false,
    };
  },
  mounted() {
    this.fetchBrokers();
  },
  methods: {
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
   openUpdateModal(broker) {
  this.selectedBroker = { ...broker }; // Clone full object
  this.showUpdateModal = true;
}
,
    // Debounced search input
    onSearchInput() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchBrokers();
      }, 300);
    },

    async fetchBrokers(customUrl = null) {
<<<<<<< HEAD
      this.loading = true;
=======
      this.loading=true
>>>>>>> 42219413ad9416df7a8c2f30919fe268f63746f2
      try {
        let url = customUrl || "get_broker_profiles";
        const params = {
          user__first_name:this.searchTerm,
          page_size: this.pageSize,
          
        };
        const res = await this.$apiGet(url, params);
        const data = res.data || [];
        this.brokers = data.results || data;
        // fetch user details for each broker
        await Promise.all(
          this.brokers.map(async (broker) => {
            try {
              const userRes = await this.$apiGetById(`/get_user`,broker.user);
              console.log("userRes",userRes);
              broker.user = userRes.id;
              broker.first_name=userRes.first_name;
              broker.middle_name=userRes.middle_name;
              broker.last_name=userRes.last_name;
            } catch (err) {
              console.error("Failed to fetch user", err);
              broker.userObj = { first_name: "", middle_name: "", last_name: "" };
            }
            
          })
        );

        console.log("brokers",this.brokers);

        this.currentPage = data.current_page || 1;
        this.totalPages = data.total_pages || 1;
        this.next = data.next;
        this.previous = data.previous;
      } catch (err) {
        console.error("Failed to fetch brokers:", err);
        this.brokers = [];
      }finally{
        this.loading=false;
      }
      finally {
        this.loading = false;
      }
    },

    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },

    askDeleteConfirmation(broker) {
      this.brokerToDelete = broker;
      this.confirmVisible = true;
    },

    async confirmDelete() {
      this.confirmVisible = false;
      try {
        await this.$apiDelete(`/delete_broker/${this.brokerToDelete.id}`);
        this.$root.$refs.toast.showToast("Broker deleted successfully", "success");
        this.fetchBrokers();
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to delete broker", "error");
      } finally {
        this.brokerToDelete = null;
      }
    },
  },
};
</script>
