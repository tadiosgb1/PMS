<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Tenants
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
              placeholder="Search tenants..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div class="ml-4">
              <label for="pageSize" class="mr-2 text-gray-700">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchTenants()"
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
                    @click="sortBy('id')"
                  >
                    ID
                    <SortIcon
                      :field="'id'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th class="border border-gray-300 px-4 py-2">Full Name</th>
                  <th class="border border-gray-300 px-4 py-2">Email</th>
                  <th class="border border-gray-300 px-4 py-2">Phone</th>
                  <th class="border border-gray-300 px-4 py-2">Groups</th>
                  <th class="border border-gray-300 px-4 py-2">Status</th>
                  <th class="border border-gray-300 px-4 py-2">Date Joined</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="tenant in filteredAndSortedTenants"
                  :key="tenant.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">
                    {{ tenant.id }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ formatFullName(tenant) }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ tenant.email }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ tenant.phone_number }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <span
                      v-for="g in tenant.groups"
                      :key="g"
                      class="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs mr-1"
                    >
                      {{ g }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <span
                      :class="
                        tenant.is_active
                          ? 'text-green-600 font-semibold'
                          : 'text-red-600 font-semibold'
                      "
                    >
                      {{ tenant.is_active ? "Active" : "Inactive" }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ formatDate(tenant.date_joined) }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 text-center space-x-2"
                  >
                    <button
                      @click="editTenant(tenant)"
                      class="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="askDeleteConfirmation(tenant)"
                      class="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedTenants.length === 0">
                  <td colspan="8" class="text-center py-6 text-gray-500">
                    No tenants found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <button
              :disabled="!previous"
              @click="fetchTenants(previous)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-600"
              >Page {{ currentPage }} of {{ totalPages }}</span
            >
            <button
              :disabled="!next"
              @click="fetchTenants(next)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <!-- Add Tenant Modal (placeholder, create later) -->
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this tenant?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
    </div>
  </div>
</template>

<script>
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";

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
  name: "TenantView",
  components: { SortIcon, ConfirmModal, Toast },
  data() {
    return {
      searchTerm: "",
      tenants: [],
      sortKey: "id",
      sortAsc: true,
      // Pagination
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],

      confirmVisible: false,
      tenantToDelete: null,
    };
  },
  computed: {
    filteredAndSortedTenants() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.tenants.filter(
        (t) =>
          String(t.id).includes(term) ||
          this.formatFullName(t).toLowerCase().includes(term) ||
          t.email.toLowerCase().includes(term) ||
          (t.phone_number || "").toLowerCase().includes(term) ||
          t.groups.some((g) => g.toLowerCase().includes(term))
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
    this.fetchTenants();
  },
  methods: {
    async fetchTenants(url = null) {
      try {
        const pageUrl = url || `/get_tenants?page=1&page_size=${this.pageSize}`;
        const response = await this.$apiGet(pageUrl);
        console.log("response", response);
        this.tenants = response.tenants || response.data || [];
        this.currentPage = response.currentPage || 1;
        this.totalPages = response.totalPages || 1;
        this.next = response.next || null;
        this.previous = response.previous || null;
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
        this.tenants = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
        alert("Failed to load tenants. Please try again later.");
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
    formatFullName(tenant) {
      return [tenant.first_name, tenant.middle_name, tenant.last_name]
        .filter(Boolean)
        .join(" ");
    },
    editTenant(tenant) {
      alert(`Edit tenant ${tenant.id} (you can add modal here)`);
    },
    askDeleteConfirmation(tenant) {
      this.tenantToDelete = tenant;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const response = await this.$apiDelete(
          `/delete_tenant/${this.tenantToDelete.id}`
        );
        this.$refs.toast.showToast(response.message, "success");
        this.fetchTenants();
      } catch (error) {
        alert("Failed to delete tenant.");
        console.error(error);
      }
      this.tenantToDelete = null;
    },
  },
};
</script>
