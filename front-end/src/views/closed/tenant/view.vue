<template>
  <div>
    <Toast ref="toast" />
    <Loading :visible="loading" message="Loading users..." />

    <div class="min-h-screen bg-gray-100">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Tenants
          <button
            @click="addTenantVisible = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add
          </button>
        </div>

        <!-- Search & Page Size -->
        <div class="p-6 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search tenants..."
            class="w-full md:w-1/2 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex items-center">
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

        <!-- Desktop Table -->
        <div class="hidden lg:block overflow-x-auto p-6">
          <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th
                  class="border border-gray-300 px-4 py-2 cursor-pointer"
                  @click="sortBy('id')"
                >
                  ID
                  <SortIcon :field="'id'" :sort-key="sortKey" :sort-asc="sortAsc" />
                </th>
                <th class="border border-gray-300 px-4 py-2">Full Name</th>
                <th class="border border-gray-300 px-4 py-2">Property</th>
                <th class="border border-gray-300 px-4 py-2">Email</th>
                <th class="border border-gray-300 px-4 py-2">Phone</th>
                <th class="border border-gray-300 px-4 py-2">Groups</th>
                <th class="border border-gray-300 px-4 py-2">Status</th>
                <th class="border border-gray-300 px-4 py-2">Date Joined</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tenant in tenants"
                :key="tenant.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">{{ tenant.id }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ formatFullName(tenant) }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ tenant.property_id?.name || 'N/A' }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ tenant.email }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ tenant.phone_number }}</td>
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
                    :class="tenant.is_active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'"
                  >
                    {{ tenant.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="border border-gray-300 px-4 py-2">{{ formatDate(tenant.date_joined) }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    class="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                    @click="goToDetail(tenant.id)"
                  >
                    Details
                  </button>
                  <button
                    v-if="!tenant.is_active"
                    @click="askConfirmation('activate',tenant.id)"
                    class="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition"
                  >
                    Activate
                  </button>
                  <button
                    v-else
                     @click="askConfirmation('deactivate',tenant.id)"
                    class="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 hover:bg-orange-100 transition"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
              <tr v-if="tenants.length === 0">
                <td colspan="9" class="text-center py-6 text-gray-500">
                  No tenants found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile / Tablet Card View -->
        <div class="block lg:hidden p-4 space-y-4">
          <div
            v-for="tenant in tenants"
            :key="tenant.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm p-4 space-y-2"
          >
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-lg text-gray-800">
                {{ formatFullName(tenant) }}
              </h3>
              <span
                :class="tenant.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 text-xs rounded-full font-semibold"
              >
                {{ tenant.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <p class="text-sm text-gray-600"><strong>ID:</strong> {{ tenant.id }}</p>
            <p class="text-sm text-gray-600"><strong>Property:</strong> {{ tenant.property_id?.name || 'N/A' }}</p>
            <p class="text-sm text-gray-600"><strong>Email:</strong> {{ tenant.email }}</p>
            <p class="text-sm text-gray-600"><strong>Phone:</strong> {{ tenant.phone_number }}</p>

            <div class="flex flex-wrap gap-1">
              <span
                v-for="g in tenant.groups"
                :key="g"
                class="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded"
              >
                {{ g }}
              </span>
            </div>

            <p class="text-xs text-gray-500">
              Joined: {{ formatDate(tenant.date_joined) }}
            </p>

            <!-- Actions -->
            <div class="flex justify-between mt-3 space-x-2">
              <button
                @click="goToDetail(tenant.id)"
                class="flex-1 py-1.5 bg-blue-50 text-blue-700 rounded-lg border border-blue-200 hover:bg-blue-100 transition text-sm"
              >
                Details
              </button>
              <button
                v-if="!tenant.is_active"
                @click="askConfirmation('activate',tenant.id)"
                class="flex-1 py-1.5 bg-green-50 text-green-700 rounded-lg border border-green-200 hover:bg-green-100 transition text-sm"
              >
                Activate
              </button>
              <button
                v-else
                @click="askConfirmation('deactivate',tenant.id)"
                class="flex-1 py-1.5 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 hover:bg-orange-100 transition text-sm"
              >
                Deactivate
              </button>
            </div>
          </div>

          <div v-if="tenants.length === 0" class="text-center py-6 text-gray-500">
            No tenants found.
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-6">
          <button
            :disabled="!previous"
            @click="fetchTenants(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            :disabled="!next"
            @click="fetchTenants(next)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Modals -->
      <ConfirmModal
  :visible="showConfirm"
  :title="confirmTitle"
  :message="confirmMessage"
  @cancel="showConfirm = false"
  @confirm="confirmAction"
/>

      <addTenant
        v-if="addTenantVisible"
        :visible="addTenantVisible"
        @close="addTenantVisible = false"
      />
    </div>
  </div>
</template>


<script>
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import addTenant from './add.vue'
import Loading from "@/components/Loading.vue";
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
  components: { SortIcon, ConfirmModal, Toast,addTenant ,Loading},
  data() {
    return {
      addTenantVisible:false,
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

       showConfirm: false,
    selectedUser: null,
    selectedAction: null, // 'activate' or 'deactivate'
    loading:false,
    };
  },
 computed: {
  filteredAndSortedTenants() {
    const term = this.searchTerm.toLowerCase();
    let filtered = this.tenants.filter((t) => {
      const u = t.user_id || {}; // make it safe
      return (
        String(u.id).includes(term) ||
        this.formatFullName(u).toLowerCase().includes(term) ||
        (u.email || "").toLowerCase().includes(term) ||
        (u.phone_number || "").toLowerCase().includes(term) ||
        (u.groups || []).some((g) => g.toLowerCase().includes(term))
      );
    });

    filtered.sort((a, b) => {
      const uA = a.user_id || {};
      const uB = b.user_id || {};
      let res = 0;
      if (uA[this.sortKey] < uB[this.sortKey]) res = -1;
      if (uA[this.sortKey] > uB[this.sortKey]) res = 1;
      return this.sortAsc ? res : -res;
    });

    return filtered;
  },
   confirmTitle() {
    return this.selectedAction === "activate"
      ? "Activate User"
      : "Deactivate User";
  },
  confirmMessage() {
    return this.selectedAction === "activate"
      ? "Are you sure you want to activate this user?"
      : "Are you sure you want to deactivate this user?";
  },
},
watch: {
  searchTerm() {
    this.fetchTenants();
  }
},

  mounted() {
    this.fetchTenants();
  },
  methods: {
   askConfirmation(action, id) {
    this.selectedUser = id;
    this.selectedAction = action;
    this.showConfirm = true;
  },
  confirmAction() {
    if (!this.selectedUser || !this.selectedAction) return;

    if (this.selectedAction === "activate") {
      this.$apiPost(`/activate_user/${this.selectedUser}`, { id: this.selectedUser })
        .then(() => {
          this.$root.$refs.toast.showToast("User activated successfully", "success");
          this.fetchUsers(this.pagination.current_page);
        });
    } else {
      this.$apiDelete(`/deactivate_user`, this.selectedUser)
        .then(() => {
          this.$root.$refs.toast.showToast("User deactivated successfully", "success");
          this.fetchUsers(this.pagination.current_page);
        });
    }

    this.showConfirm = false;
  },
       activateUser(id) {
      this.$apiPost(`/activate_user/${id}`, { id }).then(() => {
        this.$root.$refs.toast.showToast("User activated successfully", "success");
        this.fetchUsers(this.pagination.current_page);
      });
    },

    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, id).then(() => {
        this.$root.$refs.toast.showToast("User deactivated successfully", "success");
        this.fetchUsers(this.pagination.current_page);
      });
    },

   

    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },

    async fetchTenants(url) {
      this.loading=true;
      try {
       // const pageUrl = url || `/get_tenants?page=1&page_size=${this.pageSize}`;

        const response = await this.$getTenants(  url,
      this.pageSize,
      this.searchTerm);
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
      }finally{
        this.loading=false;
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
