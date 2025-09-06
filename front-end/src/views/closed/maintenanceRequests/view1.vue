<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <Toast ref="toast" />

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Header -->
      <div
        class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
      >
        Maintenance Requests
        <button
          @click="visible = true"
          class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
        >
          <span class="text-primary">+</span> Add
        </button>
      </div>

      <div class="p-6">
        <!-- Filters -->
        <div class="mb-6 flex flex-col md:flex-row gap-4 md:items-end">
          <div>
            <label class="block text-sm font-medium text-gray-700">Start Date</label>
            <input v-model="startDate" type="date" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">End Date</label>
            <input v-model="endDate" type="date" class="border rounded p-2 w-full" />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Filter By</label>
            <select v-model="filter_by" class="custom-input">
              <option value="" disabled>Select</option>
              <option value="requested_at">Requested At</option>
              <option value="resolved_at">Resolved At</option>
            </select>
          </div>
          <button
            @click="applyDateFilter()"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600"
            :disabled="!filter_by"
          >
            Apply
          </button>

         
        </div>

        <!-- Table -->
        <div class="overflow-x-auto border rounded">
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
                 <th class="border border-gray-300 px-3 py-2">Actions
                 </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="maint in paginatedData"
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
                  {{ formatDate(maint.requested_at) }}
                </td>
                <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                  {{ maint.resolved_at ? formatDate(maint.resolved_at) : "N/A" }}
                </td>
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
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                   <button @click="confirm=true; selectedId=maint.id ">Resolve</button>
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
        <div
          v-if="filteredData.length > 0"
          class="mt-4 flex justify-between items-center"
        >
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
  data() {
    return {
      maintenance: [],
      filter_by:"",
      searchTerm: "",
      startDate: "",
      endDate: "",
      currentPage: 1,
      pageSize: 5,
      sortKey: "requested_at",
      sortAsc: true,
      visible: false,
      confirm:false,
      selectedId:''
    };
  },
  computed: {
    filteredData() {
      return this.maintenance
        // .filter((m) => {
        //   const reqDate = new Date(m.requested_at);
        //   const start = this.startDate ? new Date(this.startDate) : null;
        //   const end = this.endDate ? new Date(this.endDate) : null;
        //   return (!start || reqDate >= start) && (!end || reqDate <= end);
        // })
        .sort((a, b) => {
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
    async fetchMaintenance() {
      try {
        const response = await this.$apiGet("get_maintenance_requests");
        this.maintenance = response.data || [];
      } catch (err) {
        console.error("Failed to fetch maintenance", err);
        this.maintenance = [];
        this.$root.$refs.toast.showToast("Failed to load requests", "error");
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
    async applyDateFilter() {
      try {
       let params=[];
      if(this.filter_by=='requested_at'){
        params={
        requested_at__gt:this.startDate,
        requested_at__lt:this.endDate
        }
      }else{
        params={
          resolved_at__gt:this.startDate,
          resolved_at__lt:this.endDate
        }
      }
     const res=await this.$apiGet('get_maintenance_requests',params)
     this.maintenance=res.data;
    } catch (error) {
       console.error("Failed to fetch maintenance", error);
       this.maintenance = [];
        this.$root.$refs.toast.showToast("Failed to load requests", "error");
    }
    },
    async resolve(){
      const payload={
        id:this.selectedId
      }
      console.log("selcted",payload)
     const res=await this.$apiPost('/resolve_maintenance_request',payload )
     console.log("resresolve",res)

     this.confirm=false

    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    fullName(user) {
      return [user.first_name, user.middle_name, user.last_name]
        .filter(Boolean)
        .join(" ");
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString();
    },
  },
};
</script>