<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
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
              type="search"
              placeholder="Search rents..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

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
                    Property ID
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
                    User ID
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
                    @click="sortBy('start_date')"
                  >
                    Start Date
                    <SortIcon
                      :field="'start_date'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('end_date')"
                  >
                    End Date
                    <SortIcon
                      :field="'end_date'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('payment_cycle')"
                  >
                    Payment Cycle
                    <SortIcon
                      :field="'payment_cycle'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('rent_amount')"
                  >
                    Rent Amount
                    <SortIcon
                      :field="'rent_amount'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('deposit_amount')"
                  >
                    Deposit
                    <SortIcon
                      :field="'deposit_amount'"
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
                  <th class="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="rent in filteredAndSortedRents"
                  :key="rent.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.property_id.id }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.user_id.id }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.rent_type }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ formatDate(rent.start_date) }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ formatDate(rent.end_date) }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.payment_cycle }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.rent_amount }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.deposit_amount }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ rent.status }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 text-center space-x-2"
                  >
                    <button
                      @click="editRent(rent)"
                      class="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="askDeleteConfirmation(rent)"
                      class="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedRents.length === 0">
                  <td colspan="10" class="text-center py-6 text-gray-500">
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
            <span class="text-gray-600"
              >Page {{ currentPage }} of {{ totalPages }}</span
            >
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
      <AddRent v-if="visible" :visible="visible" @close="visible = false" />
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this rent?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
      <!-- <UpdateRent v-if="updateVisible" :visible="updateVisible" :rent="rentToEdit" @close="updateVisible = false" @refresh="fetchRents" /> -->
    </div>
  </div>
</template>

<script>
import AddRent from "@/views/closed/tenant/add.vue";
//import UpdateRent from "@/views/closed/rents/update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "../../../components/Toast.vue";

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
  name: "rentView",
  components: { SortIcon, AddRent, ConfirmModal, Toast },
  data() {
    return {
      searchTerm: "",
      visible: false,
      confirmVisible: false,
      rentToDelete: null,
      updateVisible: false,
      rentToEdit: null,
      sortKey: "property_id",
      sortAsc: true,
      rents: [],
      // Pagination
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
    };
  },
  computed: {
    filteredAndSortedRents() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.rents.filter(
        (r) =>
          String(r.property_id.id).includes(term) ||
          String(r.user_id.id).includes(term) ||
          r.rent_type.toLowerCase().includes(term) ||
          r.payment_cycle.toLowerCase().includes(term) ||
          String(r.rent_amount).includes(term) ||
          String(r.deposit_amount).includes(term) ||
          r.status.toLowerCase().includes(term)
      );
      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });
      return filtered;
    },
  },
  mounted() {
    this.fetchRents();
  },
  methods: {
    async fetchRents(url = null) {
      try {
        const pageUrl = url || `/get_rents?page=1&page_size=${this.pageSize}`;
        const response = await this.$apiGet(pageUrl);

        // handle API response
        this.rents = response.rents || response.data || [];
        this.currentPage = response.currentPage || 1;
        this.totalPages = response.totalPages || 1;
        this.next = response.next || null;
        this.previous = response.previous || null;
      } catch (error) {
        console.error("Failed to fetch rents:", error);
        this.rents = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
        alert("Failed to load rents. Please try again later.");
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else ((this.sortKey = key), (this.sortAsc = true));
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString();
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
        alert("Failed to delete rent.");
        console.error(error);
      }
      this.rentToDelete = null;
    },
  },
};
</script>
