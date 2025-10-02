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
                @change="
                  fetchSales(
                    `/get_property_zone_sales?page=1&page_size=${pageSize}`
                  )
                "
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
                    @click="sortBy('property_id.name')"
                  >
                    Property
                    <SortIcon
                      :field="'property_id.name'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th class="border border-gray-300 px-4 py-2">Zone</th>
                  <th class="border border-gray-300 px-4 py-2">Broker</th>
                  <th class="border border-gray-300 px-4 py-2">
                    Listing Price
                  </th>
                  <th class="border border-gray-300 px-4 py-2">
                    Selling Price
                  </th>
                  <th class="border border-gray-300 px-4 py-2">Status</th>
                  <th class="border border-gray-300 px-4 py-2">Created</th>
                  <th class="border border-gray-300 px-4 py-2">Updated</th>
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
                    <button
                      @click="goToDetail(sale.property_id?.id)"
                      class="text-green-600 hover:text-green-800"
                      title="Detail"
                      :disabled="!sale.property_id?.id"
                    >
                       {{ sale.property_id?.name || "-" }}
                    </button>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <button
                      @click="goToZoneDetail(sale.property_zone_id?.id)"
                      class="text-green-600 hover:text-green-800"
                      title="Detail"
                      :disabled="!sale.property_zone_id?.id"
                    >
                       {{ sale.property_zone_id?.name || "-" }}
                    </button>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <button
                      @click="goToBrokerDetail(sale.broker)"
                      class="text-green-600 hover:text-green-800"
                      title="Detail"
                      :disabled="!sale.broker"
                    >
                       {{ sale.broker || "-" }}
                    </button>
                  </td>
                  <!-- <td class="border border-gray-300 px-4 py-2">
                    {{ sale.broker || "-" }}
                  </td> -->
                  <td class="border border-gray-300 px-4 py-2">
                    {{ sale.listing_price | currency }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ sale.selling_price | currency }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <span
                      :class="{
                        'text-green-600': sale.status === 'active',
                        'text-yellow-600': sale.status === 'pending',
                        'text-red-600': sale.status === 'inactive',
                      }"
                    >
                      {{ sale.status }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ formatDate(sale.created_at) }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ formatDate(sale.updated_at) }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 text-center space-x-2"
                  >
                    <!-- <button
                    v-if="showApprove=true"
                      @click="approve(sale.id)"
                      class="text-green-600 hover:text-green-800 focus:outline-none"
                      title="Approve"
                    >
                      Approve
                    </button> -->
                    <button
                      @click="goToPayment(sale.id)"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                      title="View Payment"
                    >
                      View Payment
                    </button>
                    <button
                      @click="openUpdateModal(sale)"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>

                    <!-- <button
                      @click=""
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                      title="Edit"
                    >
                      Add broker
                    </button> -->

                    <button
                      @click="confirmDeleteSale(sale.id)"
                      class="text-red-600 hover:text-red-800 focus:outline-none"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedSales.length === 0">
                  <td colspan="9" class="text-center py-6 text-gray-500">
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

      <!-- Confirm Delete Modal -->
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this property sale?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />

      <!-- Add & Update Modals -->
      <AddSale
        :visible="showAddSale"
        @close="showAddSale = false"
        @success="fetchSales()"
      />

      <UpdateSale
        :visible="showUpdateSale"
        :sale="selectedSale"
        @close="showUpdateSale = false"
        @success="fetchSales()"
      />
    </div>
  </div>
</template>

<script>
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import AddSale from "./add.vue";
import UpdateSale from "./update.vue";

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
  components: { SortIcon, ConfirmModal, Toast, AddSale, UpdateSale },
  data() {
    return {
      searchTerm: "",
      confirmVisible: false,
      saleToDelete: null,
      sortKey: "property_id.name",
      sortAsc: true,
      sales: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      showAddSale: false,
      showUpdateSale: false,
      selectedSale: null,
    };
  },
  computed: {
    filteredAndSortedSales() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.sales.filter(
        (sale) =>
          sale.property_id?.name?.toLowerCase().includes(term) ||
          sale.property_zone_id?.name?.toLowerCase().includes(term) ||
          sale.status?.toLowerCase().includes(term)
      );

      filtered.sort((a, b) => {
        let aVal = a.property_id?.name?.toString().toLowerCase() || "";
        let bVal = b.property_id?.name?.toString().toLowerCase() || "";
        if (aVal < bVal) return this.sortAsc ? -1 : 1;
        if (aVal > bVal) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchSales(
      `/get_property_zone_sales?page=1&page_size=${this.pageSize}`
    );
  },
  methods: {
    goToPayment(saleId) {
      this.$router.push({
        path: "/sales_payments",
        query: { id: saleId },
      });
    },

     buildRoleParams(params = {}) {
      const isSuperUser =
        localStorage.getItem("is_superuser") === "1" ||
        localStorage.getItem("is_superuser") === "true";

      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const email = localStorage.getItem("email");
      const id=localStorage.getItem("userId");

      if (!isSuperUser) {
        if (groups.includes("manager")) {
          params = {
            ...params,
            "property_id__manager_id__id": id,
          };
        } else if (groups.includes("owner")) {
          params = {
            ...params,  
            "property_id__owner_id__id": id,
          };
        } else if (groups.includes("staff")) {
          params = { ...params, "property_id__manager_id__id": id };
        } else if (groups.includes("super_staff")) {
          params = { ...params }; // sees all payments
        }
      }
      return params;
    },

    async fetchSales(
      url = `/get_property_zone_sales?page=1&page_size=${this.pageSize}`
    ) {
      try {
        
        let params = this.buildRoleParams();
    

          console.log("params for p sales",params);
      
        const res = await this.$apiGet(url,params);
      
        console.log("saless", res);
        
        console.log("property sale", res.data.property_id);
        this.sales = res.data || [];
        this.currentPage = res.current_page || 1;
        this.totalPages = res.total_pages || 1;
        this.next = res.next || null;
        this.previous = res.previous || null;
      } catch (err) {
        console.error("Error fetching sales:", err);
        this.sales = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
      }
    },

    sortBy(key) {
      this.sortKey = key;
      this.sortAsc = this.sortKey === key ? !this.sortAsc : true;
    },

    approve(id) {
      this.$refs.toast.showToast(`Approved sale ${id}`, "success");
    },

    confirmDeleteSale(id) {
      this.saleToDelete = id;
      this.confirmVisible = true;
    },

    async confirmDelete() {
      try {
        const response = await this.$apiDelete(
          `/delete_property_zone_sale/${this.saleToDelete}`
        );
        console.log("delete property sale", response);

        this.$root.$refs.toast.showToast(
          "Sale deleted successfully",
          "success"
        );
        this.confirmVisible = false;
        this.fetchSales();
      } catch (err) {
        console.error("Delete failed:", err);
        this.$root.$refs.toast.showToast("Failed to delete sale", "error");
      }
    },

    openUpdateModal(sale) {
      this.selectedSale = { ...sale };
      this.showUpdateSale = true;
    },

    formatDate(date) {
      if (!date) return "-";
      return new Date(date).toLocaleDateString();
    },
     goToDetail(propertyId) {
      if (propertyId)
        this.$router.push({
          name: "PropertyDetail",
          params: { id: propertyId },
        });
    },

     goToZoneDetail(propertyZoneId) {
      if (propertyZoneId)
        this.$router.push({
          name: "zoneDetail",
          params: { id: propertyZoneId },
        });
    },
     goToBrokerDetail(brokerId) {
      if (brokerId)
        this.$router.push({
          name: "brokerDetail",
          params: { id: brokerId },
        });
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
