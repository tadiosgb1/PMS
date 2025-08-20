<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-7xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Properties
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add Property
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Search & Page Size -->
          <div class="flex justify-between items-center mb-6">
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search properties..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

             <div v-if="!zone_id_query_set">
            <label class="block text-gray-700">Property Zone</label>
            <select v-model="zone_id" class="custom-input" @change="fetchProperties(`/get_properties?page=1&page_size=${pageSize}`)">
              <option value="">Select Zone</option>
              <option 
                v-for="zone in zones" 
                :key="zone.id" 
                :value="zone.id"
              >
                {{ zone.name }}
              </option>
            </select>
          </div>


            <!-- Page Size Dropdown -->
            <div class="ml-4">
              <label for="pageSize" class="mr-2 text-gray-700">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchProperties(`/get_properties?page=1&page_size=${pageSize}`)"
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
                <tr class="bg-gray-200 text-gray-700 text-left">
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('name')"
                  >
                    Name
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('zone')"
                  >
                    Zone
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('property_type')"
                  >
                    Type
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('city')"
                  >
                    City
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('status')"
                  >
                    Status
                  </th>
                  <th class="border border-gray-300 px-3 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="property in filteredAndSorted"
                  :key="property.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ property.name }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ property.property_zone_id }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ property.property_type }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ property.city }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ property.status }}
                  </td>
                  <td
                    class="border border-gray-300 px-3 py-2 text-center space-x-2"
                  >
                    <button
                      @click="goToDetail(property.id)"
                      class="text-green-600 hover:text-green-800"
                      title="Detail"
                      :disabled="!property.id"
                    >
                      <i class="fas fa-info-circle"></i>
                    </button>
                    <button
                      @click="editProperty(property)"
                      class="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="askDeleteConfirmation(property)"
                      class="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <button
                      @click="managerVissible = true"
                      class="text-green-600"
                      title="Property Manager"
                    >
                      Property Manager
                    </button>
                    <button
                      @click="rentPay(property.id)"
                      class="text-green-600 hover:text-green-800"
                      title="Rent Payment"
                      :disabled="!property.id"
                    >
                      <i class="fas fa-money-bill-wave"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSorted.length === 0">
                  <td colspan="6" class="text-center py-6 text-gray-500">
                    No properties found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="flex justify-between items-center mt-4">
            <button
              :disabled="!previous"
              @click="fetchProperties(previous)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              :disabled="!next"
              @click="fetchProperties(next)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <AddProperty
        v-if="visible"
        :visible="visible"
        @close="visible = false"
        @refresh="fetchProperties"
      />
      <UpdateProperty
        v-if="updateVisible"
        :visible="updateVisible"
        :property="propertyToEdit"
        @close="updateVisible = false"
        @refresh="fetchProperties"
      />
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this property?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
      <Manager
        v-if="managerVissible"
        :visible="managerVissible"
        @close="managerVissible = false"
      />
    </div>
  </div>
</template>

<script>
import AddProperty from "@/views/closed/proporty/add.vue";
import UpdateProperty from "@/views/closed/proporty/update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "../../../components/Toast.vue";
import Manager from "../managers/add.vue";

export default {
  name: "PropertyView",
  components: { AddProperty, UpdateProperty, ConfirmModal, Toast, Manager },
  data() {
    return {
      zones:[],
      zone_id:'',
      zone_id_query_set:false,
      by_zone:false,
      properties: [],
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      propertyToEdit: null,
      propertyToDelete: null,
      searchTerm: "",
      sortKey: "name",
      sortAsc: true,
      managerVissible: false,

      // pagination
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
    };
  },
  computed: {
    filteredAndSorted() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.properties.filter((p) =>
        ["name", "property_type", "city", "status", "zone"].some((key) =>
          String(p[key] || "").toLowerCase().includes(term)
        )
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
  async mounted() {
    this.fetchProperties(`/get_properties?page=1&page_size=${this.pageSize}`);
    if(this.$route.query.zone_id){
      this.zone_id_query_set=true;
    }
     try {
        const isSuperUser =
          localStorage.getItem("is_superuser") == "1" ||
          localStorage.getItem("is_superuser") === "true";

        const params = isSuperUser
          ? {}
          : { owner_id__email: localStorage.getItem("email") };

        const response = await this.$apiGet(`/get_property_zones`, params);

        this.zones = response.data || [];
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.next = response.next;
        this.previous = response.previous;
      } catch (err) {
        console.error("Error fetching zones:", err);
        this.zones = [];
      }

  },
  methods: {

    async fetchProperties(url = `/get_properties?page=1&page_size=${this.pageSize}`) {
    try {
    const isSuperUser =
    localStorage.getItem("is_superuser") == "1" ||
    localStorage.getItem("is_superuser") === "true";
     let params = {};
   if (this.$route.query.zone_id ||this.zone_id) {
    // If zone_id is in query → always filter by zone
    params = { property_zone_id: this.$route.query.zone_id || this.zone_id };
  } else if (!isSuperUser) {
    // If not superuser and no zone_id → filter by email
    params = { property_zone_id__owner_id__email: localStorage.getItem("email") };
  }
  console.log("params", params);
  const response = await this.$apiGet(url, params);
  this.properties = response.data || [];
  this.currentPage = response.current_page;
  this.totalPages = response.total_pages;
  this.next = response.next;
  this.previous = response.previous;
} catch (err) {
  console.error("Failed to fetch properties", err);
  alert("Could not load properties.");
}

    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    editProperty(property) {
      this.propertyToEdit = property;
      this.updateVisible = true;
    },
    askDeleteConfirmation(property) {
      this.propertyToDelete = property;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const res = await this.$apiDelete(
          `/delete_property/${this.propertyToDelete.id}`
        );
        this.$refs.toast.showToast(res.message, "success");
        this.fetchProperties(`/get_properties?page=1&page_size=${this.pageSize}`);
      } catch (err) {
        console.error(err);
        alert("Failed to delete property.");
      }
      this.propertyToDelete = null;
    },
    goToDetail(propertyId) {
      if (!propertyId) {
        console.warn("Property ID missing, cannot navigate to detail");
        return;
      }
      this.$router.push({ name: "PropertyDetail", params: { id: propertyId } });
    },
    rentPay(propertyId) {
      if (!propertyId) {
        console.warn("Property ID missing, cannot navigate to rent payment");
        return;
      }
      this.$router.push({ name: "rentPay", params: { id: propertyId } });
    },
  },
};
</script>
