<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 m-3">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Workspace Rentals
          <button
            @click="showAddRental = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add
          </button>
        </div>

        <!-- Search & Page Size -->
        <div class="p-6 flex justify-between items-center mb-6">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Rentals..."
            class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="ml-4 flex items-center">
            <label for="pageSize" class="mr-2 text-gray-700">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchRentals()"
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
        <div class="overflow-x-auto p-6">
          <table
            class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
          >
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th
                  class="border border-gray-300 px-4 py-2 cursor-pointer"
                  @click="sortBy('guest_name')"
                >
                  Guest Name
                  <SortIcon
                    :field="'guest_name'"
                    :sort-key="sortKey"
                    :sort-asc="sortAsc"
                  />
                </th>
                <th class="border border-gray-300 px-4 py-2">Email</th>
                <th class="border border-gray-300 px-4 py-2">Phone</th>
                <th class="border border-gray-300 px-4 py-2">Cycle</th>
                <th class="border border-gray-300 px-4 py-2">Start Date</th>
                <th class="border border-gray-300 px-4 py-2">Active</th>
                <th class="border border-gray-300 px-4 py-2">Space</th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="rental in filteredAndSortedRentals"
                :key="rental.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">{{ rental.guest_name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.guest_email }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.guest_phone }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.cycle }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.start_date }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.is_active ? 'Yes' : 'No' }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ rental.space_name || rental.space }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    @click="editRental(rental.id)"
                    class="text-green-600 hover:text-green-800"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="deleteRental(rental.id)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAndSortedRentals.length === 0">
                <td colspan="8" class="text-center py-6 text-gray-500">
                  No workspace rentals found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-6">
          <button
            :disabled="!previous"
            @click="fetchRentals(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            :disabled="!next"
            @click="fetchRentals(next)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add Rental Modal -->
      <AddRental
        :visible="showAddRental"
        @close="showAddRental = false"
        @success="fetchRentals()"
      />
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import AddRental from "./Add.vue";

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
  name: "WorkspaceRentalsView",
  components: { SortIcon, Toast, AddRental },
  data() {
    return {
      searchTerm: "",
      sortKey: "guest_name",
      sortAsc: true,
      rentals: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      showAddRental: false,
    };
  },
  computed: {
    filteredAndSortedRentals() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.rentals.filter(
        (r) =>
          r.guest_name.toLowerCase().includes(term) ||
          r.guest_email.toLowerCase().includes(term) ||
          r.guest_phone.toLowerCase().includes(term) ||
          r.cycle.toLowerCase().includes(term) ||
          r.start_date.toLowerCase().includes(term) ||
          String(r.is_active).toLowerCase().includes(term) ||
          String(r.space_name || r.space).toLowerCase().includes(term)
      );

      filtered.sort((a, b) => {
        let aVal = a[this.sortKey];
        let bVal = b[this.sortKey];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return this.sortAsc ? -1 : 1;
        if (aVal > bVal) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchRentals();
  },
  methods: {
    async fetchRentals(customUrl = null) {
      try {
        const url = customUrl || "get_workspace_rentals";
        const res = await this.$apiGet(url, { page_size: this.pageSize });
        const data = res.data || {};
        this.rentals = data.data || [];
        this.currentPage = data.current_page || 1;
        this.totalPages = data.total_pages || 1;
        this.next = data.next;
        this.previous = data.previous;
      } catch (err) {
        console.error("Failed to fetch rentals:", err);
        this.rentals = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    editRental(id) {
      console.log("Edit rental", id);
    },
    deleteRental(id) {
      console.log("Delete rental", id);
    },
  },
};
</script>
