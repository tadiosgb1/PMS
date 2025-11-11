<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <Loading :visible="loading" message="Loading Property..." />
      <div class="max-w-7xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Properties
          <button
            v-if="$hasPermission('pms.add_property')"
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add Property
          </button>
        </div>

        <!-- Filters -->
        <div class="p-6">
          <div class="flex flex-wrap justify-between items-center gap-4 mb-6 filters-container">
            <div class="w-full md:w-1/3 lg:w-1/4">
              <input
                v-model="searchTerm"
                @input="fetchProperties()"
                type="search"
                placeholder="Search properties..."
                class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div v-if="!zone_id_query_set" class="w-full md:w-1/3 lg:w-1/4">
              <label class="block text-gray-700 text-sm mb-1">Property Zone</label>
              <select
                v-model="zone_id"
                @change="fetchProperties()"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Zone</option>
                <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                  {{ zone.name }}
                </option>
              </select>
            </div>

            <div class="w-full md:w-1/3 lg:w-1/4">
              <label class="block text-gray-700 text-sm mb-1">Status</label>
              <select
                v-model="status"
                @change="fetchProperties()"
                class="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="rent">Rent</option>
                <option value="sale">Sale</option>
                <option value="available">Available</option>
                <option value="under_maintenance">Under Maintenance</option>
              </select>
            </div>

            <div class="w-full md:w-1/3 lg:w-1/6">
              <label for="pageSize" class="block text-gray-700 text-sm mb-1">Show</label>
              <div class="flex items-center">
                <select
                  id="pageSize"
                  v-model="pageSize"
                  @change="fetchProperties()"
                  class="border px-3 py-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option v-for="size in pageSizes" :key="size" :value="size">
                    {{ size }}
                  </option>
                </select>
                <span class="ml-1 text-gray-700 text-sm">per page</span>
              </div>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table
              class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
            >
              <thead>
                <tr class="bg-gray-200 text-gray-700 text-left">
                  <th class="border border-gray-300 px-3 py-2 cursor-pointer" @click="changeOrdering('name')">
                    Name
                  </th>
                  <th class="border border-gray-300 px-3 py-2">Owner</th>
                  <th class="border border-gray-300 px-3 py-2">Manager</th>
                  <th class="border border-gray-300 px-3 py-2">Zone</th>
                  <th class="border border-gray-300 px-3 py-2">Type</th>
                  <th class="border border-gray-300 px-3 py-2">City</th>
                  <th class="border border-gray-300 px-3 py-2 text-center">Status</th>
                  <th class="border border-gray-300 px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="property in properties"
                  :key="property.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">{{ property.name }}</td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ property.ownerName }}
                    <button
                      @click="goToUserDetail(property.owner_id)"
                      class="text-green-600 hover:text-green-800 ml-1"
                      title="Detail"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ property.managerName }}
                    <button
                      @click="goToUserDetail(property.manager_id)"
                      class="text-green-600 hover:text-green-800 ml-1"
                      title="Detail"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ property.zoneName }}
                    <button
                      @click="goToZoneDetail(property.property_zone_id)"
                      class="text-green-600 hover:text-green-800 ml-1"
                      title="Detail"
                    >
                      <i class="fas fa-eye"></i>
                    </button>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">{{ property.property_type }}</td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">{{ property.city }}</td>
                  <td class="border border-gray-300 px-3 py-2 text-center">
                    <span
                      class="px-3 py-1 rounded-full text-white text-xs font-semibold"
                      :class="{
                        'bg-green-600': property.status === 'available',
                        'bg-blue-600': property.status === 'rent',
                        'bg-yellow-600': property.status === 'sale',
                        'bg-pink-400': property.status === 'under_maintenance'
                      }"
                    >
                      {{ property.status }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-center space-x-2">
                    <button @click="goToDetail(property.id)" class="text-green-600 hover:text-green-800" title="Detail">
                      <i class="fas fa-eye"></i>
                    </button>
                    <button
                      v-if="$hasPermission('pms.change_property')"
                      @click="editProperty(property)"
                      class="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      v-if="$hasPermission('pms.delete_property')"
                      @click="askDeleteConfirmation(property)"
                      class="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                    <button
                      @click="rentPay(property.id)"
                      class="text-green-600 hover:text-green-800"
                      title="Rent Payment"
                    >
                      <i class="fas fa-money-bill-wave"></i>
                    </button>


                                   <!-- ✅ New Sale Button -->
  <button
    
    @click="openSaleModal(property.id)"
    class="text-yellow-600 hover:text-yellow-800"
    title="List for Sale"
  >
    <i class="fas fa-tag"></i>
  </button>
                  </td>
                </tr>
                <tr v-if="properties.length === 0">
                  <td colspan="8" class="text-center py-6 text-gray-500">No properties found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Mobile & Tablet View -->
          <div class="block md:hidden space-y-4">
            <div
              v-for="property in properties"
              :key="property.id"
              class="border border-gray-300 rounded-lg shadow-sm p-4 bg-white"
            >
              <div class="flex justify-between items-center mb-2">
                <h3 class="font-semibold text-lg text-gray-800">{{ property.name }}</h3>
                <span
                  class="px-3 py-1 rounded-full text-white text-xs font-semibold"
                  :class="{
                    'bg-green-600': property.status === 'available',
                    'bg-blue-600': property.status === 'rent',
                    'bg-yellow-600': property.status === 'sale',
                    'bg-pink-400': property.status === 'under_maintenance'
                  }"
                >
                  {{ property.status }}
                </span>
              </div>

              <div class="text-sm text-gray-700 space-y-1">
                <p><strong>Owner:</strong> {{ property.ownerName }}</p>
                <p><strong>Manager:</strong> {{ property.managerName }}</p>
                <p><strong>Zone:</strong> {{ property.zoneName }}</p>
                <p><strong>Type:</strong> {{ property.property_type }}</p>
                <p><strong>City:</strong> {{ property.city }}</p>
              </div>

              <div class="flex justify-end mt-3 space-x-3">
                <button @click="goToDetail(property.id)" class="text-green-600 hover:text-green-800" title="Detail">
                  <i class="fas fa-eye"></i>
                </button>
                <button
                  v-if="$hasPermission('pms.change_property')"
                  @click="editProperty(property)"
                  class="text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button
                  v-if="$hasPermission('pms.delete_property')"
                  @click="askDeleteConfirmation(property)"
                  class="text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button
                  @click="rentPay(property.id)"
                  class="text-green-600 hover:text-green-800"
                  title="Rent Payment"
                >
                  <i class="fas fa-money-bill-wave"></i>
                </button>

                 <!-- ✅ New Sale Button -->
  <button
  
    @click="openSaleModal(property.id)"
    class="text-yellow-600 hover:text-yellow-800"
    title="List for Sale"
  >
    <i class="fas fa-tag"></i>
  </button>
              </div>
            </div>
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

      <SaleModal
  v-if="saleVisible"
  :visible="saleVisible"
  :propertyId="salePropertyId"
  sourceType="property"
  @close="saleVisible = false"
  @refresh="fetchProperties"
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
import SaleModal from "../propertiesListForSale/add.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

export default {
  name: "PropertyView",
  components: { AddProperty, UpdateProperty, ConfirmModal, Toast, Manager,SaleModal,Loading },
  data() {
    return {
      zones: [],
      zone_id: "",
      zone_id_query_set: false,
      properties: [],
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      propertyToEdit: null,
      propertyToDelete: null,
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      ordering: "-id", // default ordering
      status:"",
      is_super_user:false,
      saleVisible: false,
      salePropertyId: null,
      loading: false,
    };
  },
 async  created(){
    this.is_super_user=localStorage.getItem('is_superuser');
    if (this.$route.query.zone_id) {
      this.zone_id_query_set = true;
    }
    const resultZones = await this.$getZones();
    this.zones = resultZones.zones;
    console.log("this.zones", resultZones);
    await this.fetchProperties();

  },
  async mounted() {
  
  },
  methods: {

    openSaleModal(propertyId) {
  this.salePropertyId = propertyId;
  this.saleVisible = true;
},
    //if per(view_property)
    async fetchProperties(url = null) {
       this.loading = true;
      try {
        let params={};
        const pageUrl =
          url ||
          `/get_properties?page=${this.currentPage}&page_size=${this.pageSize}&search=${this.searchTerm}&ordering=${this.ordering}`;

        let result = [];
        if (this.$route.query.zone_id || this.zone_id) {
           params = {
            property_zone_id: this.$route.query.zone_id || this.zone_id,
            status:this.status
          };
          console.log("params properties",params)
          result = await this.$getProperties(pageUrl, params);
        }else if(this.searchTerm){
           params={
             status:this.status,
             search:this.searchTerm
          }
          result = await this.$getProperties(pageUrl,params);
        }
        
        
        else {
           params={
             status:this.status
          }
          result = await this.$getProperties(pageUrl,params);
        }

        this.properties = result.properties;
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.next = result.next;
        this.previous = result.previous;
      } catch (err) {
        console.error("Failed to fetch properties", err);
        this.properties = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
      }
      finally {
        this.loading = false;
      }
    },
    changeOrdering(field) {
      if (this.ordering === field) {
        this.ordering = `-${field}`;
      } else {
        this.ordering = field;
      }
      this.fetchProperties();
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
        if (res && res.error){
      this.$root.$refs.toast.showToast(res.error || "Failed to delete property", "error");

        } else{
        this.$root.$refs.toast.showToast(res.message, "success");
        await this.fetchProperties();
        }
      } catch (err) {
        console.error(err);
       this.$root.$refs.toast.showToast("Failed to delete property", "error");
      }
      this.propertyToDelete = null;
    },
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    goToZoneDetail(id) {
      this.$router.push(`/zones/${id}`);
    },
    goToDetail(propertyId) {
      if (propertyId)
        this.$router.push({
          name: "PropertyDetail",
          params: { id: propertyId },
        });
    },
    rentPay(propertyId) {
      if (propertyId)
        this.$router.push({ name: "rentPay", params: { id: propertyId } });
    },
    managers(property_id) {
      this.$router.push({ path: "/managers", query: { property_id } });
    },
  },
};
</script>

<style scoped>
/* Medium screens 768px–1150px → two filters per row */
@media (max-width: 1150px) and (min-width: 768px) {
  .filters-container > div {
    width: 48%;
    margin-bottom: 1rem;
  }
}

/* Small screens <768px → stacked vertically */
@media (max-width: 767px) {
  .filters-container > div {
    width: 100%;
    margin-bottom: 1rem;
  }
}
</style>
