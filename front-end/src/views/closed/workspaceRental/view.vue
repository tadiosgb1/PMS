<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 m-3">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white px-4 md:px-6 py-3 md:py-4 text-lg md:text-xl font-bold flex justify-between items-center">
          Workspace Rentals
          <button
            @click="showAddRental = true"
            class="bg-white text-blue-700 font-semibold px-2 md:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add
          </button>
        </div>

        <!-- Search & Page Size -->
        <div class="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Rentals..."
            class="w-full md:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex items-center gap-2">
            <label for="pageSize" class="text-gray-700">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchRentals()"
              class="border px-2 py-1 rounded"
            >
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
            </select>
            <span class="text-gray-700">per page</span>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto p-4">
          <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('guest_name')">
                  Guest Name <SortIcon :field="'guest_name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                </th>
                <th class="border border-gray-300 px-4 py-2">Email</th>
                <th class="border border-gray-300 px-4 py-2">Phone</th>
                <th class="border border-gray-300 px-4 py-2">Created By</th>
                <th class="border border-gray-300 px-4 py-2">Cycle</th>
                <th class="border border-gray-300 px-4 py-2">Start Date</th>
                <th class="border border-gray-300 px-4 py-2">Active</th>
                <th class="border border-gray-300 px-4 py-2">Space</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="rental in filteredAndSortedRentals" :key="rental.id" class="hover:bg-gray-100">
                <td class="border border-gray-300 px-4 py-2">{{ rental.guest_name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.guest_email }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.guest_phone }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.user.first_name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.cycle }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.start_date }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.is_active ? "Yes" : "No" }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ rental.space.name || rental.space }}
                  <button
                    @click="goToSpaceDetail(rental.space.id)"
                    class="text-blue-600 hover:text-blue-800 focus:outline-none ml-1"
                    title="View Payment"
                  >View</button>
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button v-if="!rental.is_active" @click="openPaymentModal(rental.id)" class="px-3 py-1 text-green-600 border border-green-600 rounded-lg hover:text-white hover:bg-green-600 transition duration-300 ease-in-out">
                    <i class="fas fa-credit-card mr-1"></i> Pay
                  </button>
                  <button @click="editRental(rental)" class="text-green-600 hover:text-green-800">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button @click="askDeleteConfirmation(rental)" class="text-red-600 hover:text-red-800">
                    <i class="fas fa-trash"></i>
                  </button>
                  <button @click="goToPayments(rental.id)" class="text-blue-600 hover:text-blue-800">
                    Payments
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAndSortedRentals.length === 0">
                <td colspan="9" class="text-center py-6 text-gray-500">No workspace rentals found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden grid gap-4 p-4">
          <div v-for="rental in filteredAndSortedRentals" :key="rental.id" class="border rounded-lg bg-white shadow-sm p-4 space-y-2">
            <div class="flex justify-between items-center">
              <p class="font-semibold text-gray-800">{{ rental.guest_name }}</p>
              <span class="text-sm text-gray-600">{{ rental.is_active ? "Active" : "Inactive" }}</span>
            </div>
            <p class="text-sm text-gray-600"><strong>Email:</strong> {{ rental.guest_email }}</p>
            <p class="text-sm text-gray-600"><strong>Phone:</strong> {{ rental.guest_phone }}</p>
            <p class="text-sm text-gray-600"><strong>Created By:</strong> {{ rental.user.first_name }}</p>
            <p class="text-sm text-gray-600"><strong>Cycle:</strong> {{ rental.cycle }}</p>
            <p class="text-sm text-gray-600"><strong>Start Date:</strong> {{ rental.start_date }}</p>
            <p class="text-sm text-gray-600">
              <strong>Space:</strong> {{ rental.space.name || rental.space }}
              <button @click="goToSpaceDetail(rental.space.id)" class="text-blue-600 hover:text-blue-800 text-sm ml-1">View</button>
            </p>
            <div class="flex flex-wrap justify-end gap-2 pt-2">
              <button v-if="!rental.is_active" @click="openPaymentModal(rental.id)" class="text-green-600 hover:text-green-800 text-sm">Pay</button>
              <button @click="editRental(rental)" class="text-green-600 hover:text-green-800 text-sm">Edit</button>
              <button @click="askDeleteConfirmation(rental)" class="text-red-600 hover:text-red-800 text-sm">Delete</button>
              <button @click="goToPayments(rental.id)" class="text-blue-600 hover:text-blue-800 text-sm">Payments</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-4 md:p-6">
          <button :disabled="!previous" @click="fetchRentals(previous)" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
            Previous
          </button>
          <span class="text-gray-600 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
          <button :disabled="!next" @click="fetchRentals(next)" class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">
            Next
          </button>
        </div>
      </div>

      <!-- Modals -->
      <AddRental :visible="showAddRental" @close="showAddRental = false" @success="fetchRentals" />
      <WorkspaceRentalUpdate :visible="updateVisible" :rental="rentalToEdit" @close="updateVisible = false" @refresh="fetchRentals" />
      <ConfirmModal :visible="confirmVisible" title="Confirm Deletion" message="Are you sure you want to delete this rental?" @confirm="confirmDelete" @cancel="confirmVisible = false" />
      <WorkspaceRentalPay v-if="paymentVisible" :visible="paymentVisible" :rentalId="selectedRentalId" @close="paymentVisible = false" @success="fetchRentals" />
    </div>
  </div>
</template>


<script>
import Toast from "@/components/Toast.vue";
import AddRental from "./add.vue";
import WorkspaceRentalUpdate from "./update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import WorkspaceRentalPay from "./workspacerentalpay.vue";

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
  name: "WorkspaceRentalView",
  components: { Toast, AddRental, WorkspaceRentalUpdate, ConfirmModal, WorkspaceRentalPay, SortIcon },
  data() {
    return {
      searchTerm: "",
      rentals: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      showAddRental: false,
      updateVisible: false,
      rentalToEdit: null,
      confirmVisible: false,
      rentalToDelete: null,
      paymentVisible: false,
      selectedRentalId: null,
      sortKey: "guest_name",
      sortAsc: true,
    };
  },
  computed: {
    filteredAndSortedRentals() {
      const term = this.searchTerm.toLowerCase();
      return this.rentals
        .filter(
          (r) =>
            r.guest_name.toLowerCase().includes(term) ||
            r.guest_email.toLowerCase().includes(term) ||
            r.guest_phone.toLowerCase().includes(term) ||
            r.cycle.toLowerCase().includes(term) ||
            r.start_date.toLowerCase().includes(term) ||
            String(r.is_active).toLowerCase().includes(term) ||
            String(r.space?.name || r.space).toLowerCase().includes(term)
        )
        .sort((a, b) => {
          let aVal = a[this.sortKey];
          let bVal = b[this.sortKey];
          if (typeof aVal === "string") aVal = aVal.toLowerCase();
          if (typeof bVal === "string") bVal = bVal.toLowerCase();
          if (aVal < bVal) return this.sortAsc ? -1 : 1;
          if (aVal > bVal) return this.sortAsc ? 1 : -1;
          return 0;
        });
    },
  },
  mounted() {
    this.fetchRentals();
  },
  methods: {
    goToSpaceDetail(id) {
      this.$router.push(`/co-work-detail/${id}`);
    },
    async fetchRentals(url = null) {
      try {
        const response = await this.$getWorkspaceRentals(url, this.pageSize);
        this.rentals = response.rentals || [];
        this.currentPage = response.currentPage || 1;
        this.totalPages = response.totalPages || 1;
        this.next = response.next;
        this.previous = response.previous;
      } catch (err) {
        console.error("Failed to fetch rentals:", err);
        this.rentals = [];
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else this.sortKey = key;
    },
    editRental(rental) {
      this.rentalToEdit = rental;
      this.updateVisible = true;
    },
    askDeleteConfirmation(rental) {
      this.rentalToDelete = rental;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        await this.$apiDelete(`/delete_workspace_rental/${this.rentalToDelete.id}`);
        this.$root.$refs.toast.showToast("Rental deleted successfully", "success");
        this.fetchRentals();
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to delete rental", "error");
      } finally {
        this.rentalToDelete = null;
      }
    },
    goToPayments(rental_id) {
      this.$router.push({
        name: "coworking-payments-detail",
        params: { id: rental_id },
      });
    },
    openPaymentModal(rentalId) {
      this.selectedRentalId = rentalId;
      this.paymentVisible = true;
    },
  },
};
</script>
