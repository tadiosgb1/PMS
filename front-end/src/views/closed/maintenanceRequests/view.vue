<template>
  <div class="mt-6">
    <div class="overflow-x-auto border rounded">
      <table
        class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
      >
        <thead>
          <tr class="bg-gray-200 text-gray-700 text-left">
            <th
              class="border border-gray-300 px-3 py-2 cursor-pointer"
              @click="sortBy('description')"
            >
              Description
            </th>
            <th
              class="border border-gray-300 px-3 py-2 cursor-pointer"
              @click="sortBy('status')"
            >
              Status
            </th>
            <th
              class="border border-gray-300 px-3 py-2 cursor-pointer"
              @click="sortBy('requested_at')"
            >
              Requested At
            </th>
            <th
              class="border border-gray-300 px-3 py-2 cursor-pointer"
              @click="sortBy('resolved_at')"
            >
              Resolved At
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="maint in maintenance"
            :key="maint.id"
            class="hover:bg-gray-100"
          >
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
              {{ maint.description }}
            </td>
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
              {{ maint.status }}
            </td>
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
              {{ maint.requested_at }}
            </td>
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
              {{ maint.resolved_at || "N/A" }}
            </td>
          </tr>

          <tr v-if="maintenance.length === 0">
            <td colspan="4" class="text-center py-6 text-gray-500">
              No maintenance requests found.
            </td>
          </tr>
        </tbody>
      </table>
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
      maintenance: [], // initialize as empty array
    };
  },
  mounted() {
    console.log("here is maintenance");
    this.fetchMaintenance();
  },
  methods: {
    async fetchMaintenance() {
      const params = {
        property_id__id: this.propertyId,
      };

      console.log("params", params);
      try {
        const response = await this.$apiGet("get_maintenance_requests", params);
        this.maintenance = response.data || [];
        console.log("maintenances are", this.maintenance);
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
  },
};
</script>

<style scoped>
/* Optional styling */
</style>
