<template>
  <div>
    <Toast ref="toast" />
   <button
        @click="$router.back()"
        class="mb-4 ml-5 mt-5 px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
      >
        &larr; Back
      </button>
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Rents
          <button @click="visible = true" class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300">
            <span class="text-primary">+</span> Add
          </button>
        </div>
        <div class="p-6">
          <!-- Search -->
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Rent..."
            class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('property_id')">
                    Property ID
                    <SortIcon :field="'property_id'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('user_id')">
                    Tenant
                    <SortIcon :field="'user_id'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('rent_type')">
                    Rent Type
                    <SortIcon :field="'rent_type'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                 <!--  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('start_date')">
                    Start Date
                    <SortIcon :field="'start_date'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('end_date')">
                    End Date
                    <SortIcon :field="'end_date'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('payment_cycle')">
                    Payment Cycle
                    <SortIcon :field="'payment_cycle'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('rent_amount')">
                    Rent Amount
                    <SortIcon :field="'rent_amount'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('deposit_amount')">
                    Deposit Amount
                    <SortIcon :field="'deposit_amount'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th> -->
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('status')">
                    Status
                    <SortIcon :field="'status'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rent in filteredAndSortedRents" :key="rent.id" class="hover:bg-gray-100">
                  <td class="border border-gray-300 px-4 py-2">{{ rent.property_id.name }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ rent.user_id.first_name }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ rent.rent_type }}</td>
                  <!-- <td class="border border-gray-300 px-4 py-2">{{ rent.start_date }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ rent.end_date }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ rent.payment_cycle }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ rent.rent_amount }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ rent.deposit_amount }}</td> -->
                  <td class="border border-gray-300 px-4 py-2">{{ rent.status }}</td>
                  <td class="border border-gray-300 px-4 py-2 text-center space-x-2">

                    <!-- <button @click="editRent(rent)" class="text-blue-600 hover:text-blue-800 focus:outline-none" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button> -->
                    <button @click="selectedRentId=rent.id;showModal = true" class="relative px-4 py-2 text-green-600 border border-green-600 rounded-lg
         hover:text-white hover:bg-green-600
         transition duration-300 ease-in-out
         animate-glow" title="Pay Rent">
                      <i class="fas fa-credit-card mr-2"></i> Pay
                    </button>
                      <button @click="rentDetail(rent.id)" class="text-blue-600 hover:text-blue-800 focus:outline-none" title="Edit">
                      <i class=""></i>Detail
                    </button>
          
                     <button @click="addPictureVisible=true;selectedRentId=rent.id" class="text-green-600 hover:text-red-800 focus:outline-none" title="Delete">
                      <i class=""></i> Add picture
                    </button>

                     <button @click="payments(rent)" class="text-blue-600 hover:text-blue-800 focus:outline-none" title="Delete">
                      <i class=""></i> Payments
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedRents.length === 0">
                  <td colspan="10" class="text-center py-6 text-gray-500">No rents found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

        <AddPictureModal
        v-if="addPictureVisible "
        :visible="addPictureVisible"
        :rentId="selectedRentId"
        @close="addPictureVisible = false"
        @refresh="fetchRents"
      />
      <MakePaymentModal
      v-if="showModal"
      :visible="showModal"
      :rentId="selectedRentId"
      @close="showModal = false"
      @success="handlePaymentSuccess"
    />
      <!-- Modals -->
      <AddRent :propertyId="this.$route.params.id"  v-if="visible" :visible="visible" @close="visible = false" @refresh="fetchRents" />
      <UpdateRent v-if="updateVisible" :visible="updateVisible" :rent="rentToEdit" @close="updateVisible = false" @refresh="fetchRents" />
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this rent?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
    </div>
  </div>
</template>

<script>
import AddRent from '@/views/closed/rent/add.vue';
import UpdateRent from '@/views/closed/rent/update.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import Toast from "@/components/Toast.vue";
import AddPictureModal from "@/views/closed/rent/addRentPicture.vue";
import MakePaymentModal from "@/views/closed/rent/addRentPayment.vue";

const SortIcon = {
  props: ['field', 'sortKey', 'sortAsc'],
  template: `<span class="inline-block ml-1 text-gray-500">
    <svg v-if="sortKey !== field" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
    </svg>
    <svg v-else-if="sortAsc" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13l4 4 4-4m0-6l-4-4-4 4"/>
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
    </svg>
  </span>`
};

export default {
  name: 'RentsView',
  components: { SortIcon, AddRent, UpdateRent, ConfirmModal, Toast,AddPictureModal ,MakePaymentModal},
  data() {
    return {
      selectedRentId:"",
      addPictureVisible:false,
      searchTerm: '',
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      rentToEdit: null,
      rentToDelete: null,
      sortKey: 'property_id',
      sortAsc: true,
      rents: [],
      showModal:false
    };
  },
  computed: {
    filteredAndSortedRents() {
      const term = this.searchTerm.toLowerCase();
      // // 1️⃣ Filter by current route property ID
      // let filtered = this.rents.filter(rent => 
      //   String(rent.property_id.id) === String(this.$route.params.id)
      // );

      // // 2️⃣ Apply search filter
      // filtered = filtered.filter(r => 
      //   String(r.property_id.id).toLowerCase().includes(term) ||
      //   String(r.user_id.id).toLowerCase().includes(term) ||
      //   r.rent_type.toLowerCase().includes(term) ||
      //   r.payment_cycle.toLowerCase().includes(term) ||
      //   String(r.rent_amount).toLowerCase().includes(term) ||
      //   String(r.deposit_amount).toLowerCase().includes(term) ||
      //   r.status.toLowerCase().includes(term)
      // );

      // // 3️⃣ Sort results
      // filtered.sort((a, b) => {
      //   let res = 0;
      //   if (a[this.sortKey] < b[this.sortKey]) res = -1;
      //   if (a[this.sortKey] > b[this.sortKey]) res = 1;
      //   return this.sortAsc ? res : -res;
      // });

      //return filtered;
    return this.rents;
    }
  },
  mounted() {
    this.fetchRents();
  },
  methods: {
    payRent(rent_id){
   
    },
    rentDetail(rent_id){
     this.$router.push({ name: 'rent-detail', params: { id: rent_id} });

    },
    goToPayments(rent_id){

    },
    async fetchRents() {
      const params={

      }
      console.log("params",params);
      try {
        const response = await this.$apiGet("/get_rents",params);
        console.log("response get rents",response);
        if (Array.isArray(response.data)) {
          this.rents = response.data;
          console.log("rents",this.rents);
        } else {
          console.warn("Unexpected response format:", response);
          this.rents = [];
        }
      } catch (error) {
        console.error("Failed to fetch rents:", error);
        this.rents = [];
        alert("Failed to load rents. Please try again later.");
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else { this.sortKey = key; this.sortAsc = true; }
    },
    editRent(rent) {
      this.rentToEdit = rent;
      this.updateVisible = true;
    },
    askDeleteConfirmation(rent) {
      this.rentToDelete = rent;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const response = await this.$apiDelete(`/delete_rent/${this.rentToDelete.id}`);
        this.$refs.toast.showToast(response.message, 'success');
        this.fetchRents();
      } catch (error) {
        console.error(error);
        alert("Failed to delete rent.");
      }
      this.rentToDelete = null;
    }
  }
};
</script>
