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
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Rents
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add
          </button>
        </div>
        <div class="p-6">
          <!-- Search & Page Size -->
          <div class="flex justify-between items-center mb-6">
            <input
              v-model="searchTerm"
              @input="onSearch"
              type="search"
              placeholder="Search Rent..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- Page Size Dropdown -->
            <div class="ml-4">
              <label for="pageSize" class="mr-2 text-gray-700">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchRents()"
                class="border px-2 py-1 rounded"
              >
                <option v-for="size in pageSizes" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
              <span class="ml-1 text-gray-700">per page</span>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table
              class="min-w-full table-auto border-collapse border border-gray-300"
            >
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('property_id')"
                  >
                    Property
                    <SortIcon
                      :field="'property_id'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('user_id')"
                  >
                    Tenant
                    <SortIcon
                      :field="'user_id'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('rent_type')"
                  >
                    Rent Type
                    <SortIcon
                      :field="'rent_type'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('status')"
                  >
                    Status
                    <SortIcon
                      :field="'status'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th class="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="rent in filteredAndSortedRents"
                  :key="rent.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.property_id?.name }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.user_id?.first_name }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.rent_type }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.status }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 text-center space-x-2"
                  >
                    <button
                      @click="selectedRentId = rent.id; showModal = true"
                      class="relative px-4 py-2 text-green-600 border border-green-600 rounded-lg
                        hover:text-white hover:bg-green-600
                        transition duration-300 ease-in-out"
                      title="Pay Rent"
                    >
                      <i class="fas fa-credit-card mr-2"></i> Pay
                    </button>
                    <button
                      @click="rentDetail(rent.id)"
                      class="text-green-600 hover:text-green-800 focus:outline-none"
                      title="Detail"
                    >
                      <i class="fas fa-info-circle"></i>
                    </button>
                    <button
                      @click="goToPayments(rent.id)"
                      class="text-green-600 hover:text-green-800 focus:outline-none"
                      title="Payments"
                    >
                      Payments
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedRents.length === 0">
                  <td
                    colspan="10"
                    class="text-center py-6 text-gray-500"
                  >
                    No rents found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <button
              :disabled="!previous"
              @click="fetchRents(previous)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              :disabled="!next"
              @click="fetchRents(next)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <AddPictureModal
        v-if="addPictureVisible"
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
      <AddRent
        v-if="visible"
        :propertyId="$route.params.id"
        :visible="visible"
        @close="visible = false"
        @refresh="fetchRents"
      />
      <UpdateRent
        v-if="updateVisible"
        :visible="updateVisible"
        :rent="rentToEdit"
        @close="updateVisible = false"
        @refresh="fetchRents"
      />
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
import AddRent from "@/views/closed/rent/add.vue";
import UpdateRent from "@/views/closed/rent/update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import AddPictureModal from "@/views/closed/rent/addRentPicture.vue";
import MakePaymentModal from "@/views/closed/rent/addRentPayment.vue";

const SortIcon = {
  props: ["field", "sortKey", "sortAsc"],
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
  </span>`,
};

export default {
  name: "RentsView",
  components: {
    SortIcon,
    AddRent,
    UpdateRent,
    ConfirmModal,
    Toast,
    AddPictureModal,
    MakePaymentModal,
  },
  data() {
    return {
      selectedRentId: "",
      addPictureVisible: false,
      searchTerm: "",
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      rentToEdit: null,
      rentToDelete: null,
      sortKey: "property_id",
      sortAsc: true,
      rents: [],
      showModal: false,
      // Pagination
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
    };
  },
  computed: {
    filteredAndSortedRents() {
      let sorted = [...this.rents];

      // Sorting by property or tenant names
      sorted.sort((a, b) => {
        let valA = a[this.sortKey];
        let valB = b[this.sortKey];

        if (this.sortKey === "property_id") {
          valA = a.property_id?.name || "";
          valB = b.property_id?.name || "";
        }
        if (this.sortKey === "user_id") {
          valA = a.user_id?.first_name || "";
          valB = b.user_id?.first_name || "";
        }

        if (valA < valB) return this.sortAsc ? -1 : 1;
        if (valA > valB) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return sorted;
    },
  },
  mounted() {
    this.fetchRents();
  },
  methods: {
    goToPayments(rental_id) {
      this.$router.push({
        path: "/rents_payments",
      });
    },
    rentDetail(rent_id) {
      this.$router.push({ name: "rent-detail", params: { id: rent_id } });
    },
    async fetchRents() {
      const params={
        page_size:1000,
        ordering:"-id"
      }
      try {
        const response = await this.$apiGet("/get_rents",params);
        if (Array.isArray(response.data)) {
          this.rents = response.data;
          console.log("rents are ",this.rents);
        } else {
          this.rents = [];
        }
      } catch (error) {
        console.error("Failed to fetch rents:", error);
        this.rents = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
      }
    },
    onSearch() {
      this.currentPage = 1;
      this.fetchRents();
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
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
        const response = await this.$apiDelete(
          `/delete_rent/${this.rentToDelete.id}`
        );
        this.$refs.toast.showToast(response.message, "success");
        this.fetchRents();
      } catch (error) {
        console.error(error);
        alert("Failed to delete rent.");
      }
      this.rentToDelete = null;
    },
  },
};
</script>
