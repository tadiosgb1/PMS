<template>
  <div class="m-6 bg-white p-3">

     <div
          class="bg-primary hover:bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
        >
            Maintenance Requests
        
        </div>
    <!-- Filters -->
    <div class="mb-3 flex justify-between items-center mt-10">
      <div class="flex gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            v-model="startDate"
            type="date"
            class="border rounded p-2"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">End Date</label>
          <input
            v-model="endDate"
            type="date"
            class="border rounded p-2"
          />
        </div>
        <button
          @click="applyDateFilter"
          class="self-end px-4 py-2 bg-primary text-white rounded hover:bg-primary"
        >
          Apply
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto border rounded">
      <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
        <thead>
          <tr class="bg-gray-200 text-gray-700 text-left">
            <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="sortBy('description')">Description</th>
            <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="sortBy('status')">Status</th>
            <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="sortBy('requested_at')">Requested At</th>
            <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="sortBy('resolved_at')">Resolved At</th>
            <th class="border border-gray-300 px-3 py-2">Property</th>
            <th class="border border-gray-300 px-3 py-2">User</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="maint in paginatedData" :key="maint.id" class="hover:bg-gray-100">
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">{{ maint.description }}</td>
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">{{ maint.status }}</td>
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">{{ maint.requested_at }}</td>
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">{{ maint.resolved_at || 'N/A' }}</td>

            <!-- Property Link -->
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
              <router-link
                v-if="maint.property_id"
                :to="`/dashboard/properties/${maint.property_id.id}`"
                class="text-blue-600 hover:underline"
              >
                {{ maint.property_id.name }}
              </router-link>
              <span v-else>N/A</span>
            </td>

            <!-- User Link -->
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
              <router-link
                v-if="maint.user_id"
                :to="`/user_detail/${maint.user_id.id}`"
                class="text-blue-600 hover:underline"
              >
                {{ fullName(maint.user_id) }}
              </router-link>
              <span v-else>N/A</span>
            </td>
          </tr>

          <tr v-if="filteredData.length === 0">
            <td colspan="6" class="text-center py-6 text-gray-500">
              No maintenance requests found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="filteredData.length > 0" class="mt-4 flex justify-between items-center">
      <div class="flex items-center gap-2">
        <label class="text-sm">Rows per page:</label>
        <select v-model.number="pageSize" class="border rounded p-1">
          <option v-for="size in [5, 10, 50, 100]" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
      </div>

      <div class="flex items-center gap-4">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        <span class="text-gray-700">Page {{ currentPage }} of {{ totalPages }}</span>

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
</template>

<script>
export default {
  name: "Maintenance",
  props: {
    propertyId: Number,
  },
  data() {
    return {
      maintenance: [],
      startDate: "",
      endDate: "",
      currentPage: 1,
      pageSize: 5,
    };
  },
  computed: {
    filteredData() {
      return this.maintenance.filter((m) => {
        const reqDate = new Date(m.requested_at);
        const start = this.startDate ? new Date(this.startDate) : null;
        const end = this.endDate ? new Date(this.endDate) : null;
        return (!start || reqDate >= start) && (!end || reqDate <= end);
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
    async fetchMaintenance() {
      try {
        const response = await this.$apiGet("get_maintenance_requests", {
          property_id: this.propertyId,
        });
        this.maintenance = response.data || [];
      } catch (err) {
        console.error("Failed to fetch maintenance", err);
        this.maintenance = [];
      }
    },
    sortBy(field) {
      if (!this.maintenance) return;
      this.maintenance.sort((a, b) => {
        if (a[field] < b[field]) return -1;
        if (a[field] > b[field]) return 1;
        return 0;
      });
    },
    applyDateFilter() {
      this.currentPage = 1;
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
  },
};
</script>
