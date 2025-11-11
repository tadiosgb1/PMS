<template>
  <div class="mt-6">
          <Loading :visible="loading" message="Loading Brokers..." />
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
             <th class="border border-gray-300 px-3 py-2">Action
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
            <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                   <button @click="confirm=true; selectedId=maint.id ">Resolve</button>
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
    <div v-if="confirm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
    <div class="bg-white rounded-lg shadow-md max-w-sm w-full p-6 text-center">
      <p class="text-orange-400  mb-6">Do you want to make it resolved</p>
      <div class="flex justify-center space-x-4">
        <button @click="confirm=false" class="px-4 py-2 rounded bg-orange-400 text-white hover:bg-orange-500">Cancel</button>
        <button @click="resolve()" class="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600">OK</button>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Loading from "@/components/Loading.vue"; // <-- Added Loading

export default {
  name: "Maintenance",
  props: {
    propertyId: Number,
  },
  components:{
    Loading
  },
  data() {
    return {
      maintenance: [], // initialize as empty array
      confirm:false,
      loading:false,
    };
  },
  mounted() {
    console.log("here is maintenance");
    this.fetchMaintenance();
  },
  methods: {
    async fetchMaintenance() {
      this.loading=false;
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
      }finally{
        this.loading=false;
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
     async resolve(){
      const payload={
        id:this.selectedId
      }
      console.log("selcted",payload)
     await this.$apiPost('/resolve_maintenance_request',payload )

     this.confirm=false

    },
  },
};
</script>

<style scoped>
/* Optional styling */
</style>
