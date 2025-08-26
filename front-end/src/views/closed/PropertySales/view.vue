<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Property Sales
          <button
            @click="showAddSale = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add
          </button>
        </div>

        <!-- Body -->
        <div class="p-6">
          <!-- Search & Page Size -->
          <div class="flex justify-between items-center mb-6">
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search Property Sale..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <!-- Page Size Dropdown -->
            <div class="ml-4">
              <label for="pageSize" class="mr-2 text-gray-700">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchSales(`/get_property_sales?page=1&page_size=${pageSize}`)"
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
              class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
            >
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('property_name')"
                  >
                    Property
                    <SortIcon
                      :field="'property_name'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th class="border border-gray-300 px-4 py-2">Buyer</th>
                  <th class="border border-gray-300 px-4 py-2">Price</th>
                  <th class="border border-gray-300 px-4 py-2">Date</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="sale in filteredAndSortedSales"
                  :key="sale.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">
                    {{ sale.property_name }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ sale.buyer_name }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ sale.price | currency }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ sale.date }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 text-center space-x-2"
                  >
                    <router-link
                      :to="`/property_sale_detail/${sale.id}`"
                      class="text-green-600 hover:text-green-800 focus:outline-none"
                      title="View"
                    >
                      <i class="fas fa-eye"></i>
                    </router-link>

                    <button
                      @click="askDeleteConfirmation(sale)"
                      class="text-red-600 hover:text-red-800 focus:outline-none"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedSales.length === 0">
                  <td colspan="5" class="text-center py-6 text-gray-500">
                    No property sales found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <button
              :disabled="!previous"
              @click="fetchSales(previous)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              :disabled="!next"
              @click="fetchSales(next)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Confirm Modal -->
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this property sale?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />

      <AddSale
        :visible="showAddSale"
        @close="showAddSale = false"
        @success="fetchSales()"
      />
    </div>
  </div>
</template>

<script>
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import AddSale from "./add.vue";

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
  name: "propertySalesView",
  components: { SortIcon, ConfirmModal, Toast, AddSale },
  data() {
    return {
      searchTerm: "",
      confirmVisible: false,
      saleToDelete: null,
      sortKey: "property_name",
      sortAsc: true,
      sales: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      // page size feature
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      showAddSale: false,
    };
  },
  computed: {
    filteredAndSortedSales() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.sales.filter(
        (sale) =>
          sale.property_name.toLowerCase().includes(term) ||
          sale.buyer_name.toLowerCase().includes(term) ||
          String(sale.price).toLowerCase().includes(term) ||
          sale.date.toLowerCase().includes(term)
      );

      filtered.sort((a, b) => {
        let aVal = a[this.sortKey]?.toString().toLowerCase();
        let bVal = b[this.sortKey]?.toString().toLowerCase();
        if (aVal < bVal) return this.sortAsc ? -1 : 1;
        if (aVal > bVal) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchSales(`/get_property_sales?page=1&page_size=${this.pageSize}`);
  },
  methods: {
    async fetchSales(url = `/get_property_sales?page=1&page_size=${this.pageSize}`) {
      try {
        const res = await this.$apiGet(url);
        this.sales = res.data || [];
        this.currentPage = res.current_page;
        this.totalPages = res.total_pages;
        this.next = res.next;
        this.previous = res.previous;
      } catch (err) {
        console.error(err);
        this.sales = [];
      }
    },
    sortBy(key) {
      this.sortKey = key;
      this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
    },
    askDeleteConfirmation(sale) {
      this.saleToDelete = sale;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        await this.$apiDelete(`/delete_property_sale/${this.saleToDelete.id}`);
        this.$refs.toast.showToast("Property sale deleted", "success");
        this.fetchSales(`/get_property_sales?page=1&page_size=${this.pageSize}`);
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to delete property sale", "error");
      }
    },
  },
  filters: {
    currency(value) {
      if (!value) return "";
      return new Intl.NumberFormat().format(value) + " USD";
    },
  },
};
</script>
