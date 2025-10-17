<template>
  <div class="min-h-screen bg-gray-100 p-4 md:p-6">
    <Toast ref="toast" />

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Header -->
      <div
        class="bg-orange-500 text-white px-4 md:px-6 py-3 md:py-4 text-lg md:text-xl font-bold flex justify-between items-center"
      >
        Maintenance Requests
        <div v-if="!propertyId" class="flex items-center">
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-3 md:px-4 py-2 rounded shadow hover:bg-gray-100 border border-gray-300 transition-all"
          >
            <span class="text-primary">+</span> Add
          </button>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="p-4 md:p-6">
        <div class="flex flex-col md:flex-row justify-between gap-4 mb-4">
          <!-- Filters -->
          <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Start Date</label>
              <input v-model="startDate" type="date" class="border rounded p-2 w-full" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">End Date</label>
              <input v-model="endDate" type="date" class="border rounded p-2 w-full" />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700">Filter By</label>
              <select v-model="filter_by" class="border rounded p-2 w-full">
                <option value="" disabled>Select</option>
                <option value="requested_at">Requested At</option>
                <option value="resolved_at">Resolved At</option>
              </select>
            </div>
            <button
              @click="applyDateFilter()"
              class="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 mt-2 sm:mt-auto"
              :disabled="!filter_by"
            >
              Apply
            </button>
          </div>

          <!-- Rows per page -->
          <div class="flex items-center gap-2 self-start md:self-end">
            <label class="text-sm text-gray-700">Rows:</label>
            <select v-model.number="pageSize" class="border rounded p-2 text-sm">
              <option v-for="size in [5, 10, 50, 100]" :key="size" :value="size">{{ size }}</option>
            </select>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto border rounded-lg">
          <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr class="bg-gray-200 text-gray-700 text-left">
                <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="sortBy('description')">
                  Description
                </th>
                <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="sortBy('status')">
                  Status
                </th>
                <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="sortBy('requested_at')">
                  Requested At
                </th>
                <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="sortBy('resolved_at')">
                  Resolved At
                </th>
                <th class="border border-gray-300 px-3 py-2">Property</th>
                <th class="border border-gray-300 px-3 py-2">User</th>
                <th class="border border-gray-300 px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="maint in paginatedData"
                :key="maint.id"
                class="hover:bg-gray-100 transition-colors"
              >
                <td class="border border-gray-300 px-3 py-2">{{ maint.description }}</td>
                <td
                  class="border border-gray-300 px-3 py-2 font-semibold"
                  :class="{
                    'text-orange-500': maint.status === 'pending',
                    'text-green-600': maint.status === 'resolved'
                  }"
                >
                  {{ maint.status }}
                </td>
                <td class="border border-gray-300 px-3 py-2">
                  {{ formatDate(maint.requested_at) }}
                </td>
                <td class="border border-gray-300 px-3 py-2">
                  {{ maint.resolved_at ? formatDate(maint.resolved_at) : 'N/A' }}
                </td>
                <td class="border border-gray-300 px-3 py-2">
                  <router-link
                    v-if="maint.property_id"
                    :to="`/dashboard/properties/${maint.property_id.id}`"
                    class="text-blue-600 hover:underline"
                  >
                    {{ maint.property_id.name }}
                  </router-link>
                  <span v-else>N/A</span>
                </td>
                <td class="border border-gray-300 px-3 py-2">
                  <router-link
                    v-if="maint.user_id"
                    :to="`/user_detail/${maint.user_id.id}`"
                    class="text-blue-600 hover:underline"
                  >
                    {{ fullName(maint.user_id) }}
                  </router-link>
                  <span v-else>N/A</span>
                </td>
                <td class="border border-gray-300 px-3 py-2 text-center">
                  <button
                    v-if="maint.status === 'pending'"
                    @click="confirm = true; selectedId = maint.id"
                    class="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                  >
                    Resolve
                  </button>
                  <button
                    v-else
                    disabled
                    class="px-3 py-1 bg-gray-300 text-gray-600 rounded cursor-not-allowed"
                  >
                    Resolved
                  </button>
                </td>
              </tr>
              <tr v-if="filteredData.length === 0">
                <td colspan="7" class="text-center py-6 text-gray-500">No maintenance requests found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile List View -->
        <div class="md:hidden grid gap-4">
          <div
            v-for="maint in paginatedData"
            :key="maint.id"
            class="border rounded-lg bg-white shadow-sm p-4 space-y-2"
          >
            <div class="flex justify-between items-center">
              <p class="font-semibold text-gray-800">{{ maint.description }}</p>
              <span
                class="text-xs font-semibold px-2 py-1 rounded"
                :class="{
                  'bg-orange-100 text-orange-600': maint.status === 'pending',
                  'bg-green-100 text-green-700': maint.status === 'resolved'
                }"
              >
                {{ maint.status }}
              </span>
            </div>
            <p class="text-sm text-gray-600">
              <strong>Requested:</strong> {{ formatDate(maint.requested_at) }}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Resolved:</strong>
              {{ maint.resolved_at ? formatDate(maint.resolved_at) : 'N/A' }}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Property:</strong>
              <router-link
                v-if="maint.property_id"
                :to="`/dashboard/properties/${maint.property_id.id}`"
                class="text-blue-600 hover:underline"
              >
                {{ maint.property_id.name }}
              </router-link>
              <span v-else>N/A</span>
            </p>
            <p class="text-sm text-gray-600">
              <strong>User:</strong>
              <router-link
                v-if="maint.user_id"
                :to="`/user_detail/${maint.user_id.id}`"
                class="text-blue-600 hover:underline"
              >
                {{ fullName(maint.user_id) }}
              </router-link>
              <span v-else>N/A</span>
            </p>
            <div class="pt-2 flex justify-end">
              <button
                v-if="maint.status === 'pending'"
                @click="confirm = true; selectedId = maint.id"
                class="px-3 py-1 bg-orange-500 text-white text-sm rounded hover:bg-orange-600"
              >
                Resolve
              </button>
              <button
                v-else
                disabled
                class="px-3 py-1 bg-gray-300 text-gray-600 text-sm rounded cursor-not-allowed"
              >
                Resolved
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredData.length > 0" class="mt-6 flex justify-center md:justify-between items-center">
          <div class="hidden md:block"></div>
          <div class="flex items-center gap-4">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-700 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Resolve Modal -->
    <div v-if="confirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
      <div class="bg-white rounded-lg shadow-md max-w-sm w-full p-6 text-center">
        <p class="text-orange-400 mb-6">Do you want to mark this as resolved?</p>
        <div class="flex justify-center space-x-4">
          <button
            @click="confirm = false"
            class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            @click="resolve()"
            class="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
          >
            OK
          </button>
        </div>
      </div>
    </div>

    <!-- Add Maintenance Request Modal -->
    <MaintenanceRequestAdd
      v-if="visible"
      :visible="visible"
      @close="visible = false; fetchMaintenance()"
    />
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import MaintenanceRequestAdd from "@/views/closed/maintenanceRequests/add.vue";

export default {
  name: "MaintenanceRequestView",
  components: { Toast, MaintenanceRequestAdd },
   props: {
    propertyId: Number,
  },
  data() {
    return {
      maintenance: [],
      filter_by: "",
      searchTerm: "",
      startDate: "",
      endDate: "",
      currentPage: 1,
      pageSize: 5,
      sortKey: "requested_at",
      sortAsc: true,
      visible: false,
      confirm: false,
      selectedId: "",
    };
  },
  computed: {
    filteredData() {
      return this.maintenance.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize) || 1;
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredData.slice(start, start + this.pageSize);
    },
  },
  mounted() {
    this.fetchMaintenance();
  },
  methods: {
    // helper to build params based on role
    buildRoleParams(params = {}) {
      const isSuperUser =
        localStorage.getItem("is_superuser") === "1" ||
        localStorage.getItem("is_superuser") === "true";

      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const email = localStorage.getItem("email");

      if (!isSuperUser) {
        if (groups.includes("manager")) {
          params = { ...params, "property_id__property_zone_id__manager_id__email": email };
        } else if (groups.includes("owner")) {
          params = { ...params, "property_id__property_zone_id__owner_id__email": email };
        } else if (groups.includes("staff")) {
          params = { ...params, "staff_id__email": email };
        } else if (groups.includes("super_staff")) {
          params = { ...params };
        }
      }
       // ✅ Always filter by propertyId if available
  if (this.propertyId) {
    params = { ...params, "property_id__id": this.propertyId };
  }
      return params;
    },

    async fetchMaintenance() {
      try {
        let params = this.buildRoleParams();
        const response = await this.$apiGet("get_maintenance_requests", params);
        this.maintenance = response.data || [];
      } catch (err) {
        console.error("Failed to fetch maintenance", err);
        this.maintenance = [];
        this.$refs.toast.showToast("Failed to load requests", "error");
      }
    },

    async applyDateFilter() {
      try {
        let params = this.buildRoleParams();

        if (this.filter_by === "requested_at") {
          params = {
            ...params,
            requested_at__gte: this.startDate,
            requested_at__lte: this.endDate,
          };
        } else if (this.filter_by === "resolved_at") {
          params = {
            ...params,
            resolved_at__gte: this.startDate,
            resolved_at__lte: this.endDate,
          };
        }

        const res = await this.$apiGet("get_maintenance_requests", params);
        this.maintenance = res.data;
      } catch (error) {
        console.error("Failed to fetch maintenance", error);
        this.maintenance = [];
        this.$refs.toast.showToast("Failed to load requests", "error");
      }
    },

    async resolve() {
      try {
        const payload = { id: this.selectedId };
        await this.$apiPost("/resolve_maintenance_request", payload);
        this.confirm = false;
        this.fetchMaintenance(); // refetch after resolve
      } catch (error) {
        console.error("Failed to resolve request", error);
        this.$refs.toast.showToast("Failed to resolve request", "error");
      }
    },

    sortBy(field) {
      if (this.sortKey === field) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = field;
        this.sortAsc = true;
      }
    },

    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    fullName(user) {
      return [user.first_name, user.middle_name, user.last_name].filter(Boolean).join(" ");
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString();
    },
  },
};
</script>
