<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 p-4 lg:p-6 relative">
      <!-- Loading Overlay -->
      <div
        v-if="loading"
        class="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-50"
      >
        <div class="flex flex-col items-center space-y-2">
          <div
            class="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"
          ></div>
          <p class="text-gray-600 text-sm font-medium">Loading zones...</p>
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-4 lg:px-6 py-4 text-lg lg:text-xl font-bold flex justify-between items-center"
        >
          Property Zones
          <button
            v-if="$hasPermission('pms.add_propertyzone')"
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-3 py-2 rounded shadow hover:bg-gray-100 transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add Zone
          </button>
        </div>

        <!-- Search & Page Size -->
        <div
          class="p-4 flex flex-col lg:flex-row justify-between items-center gap-4"
        >
          <input
            v-model="searchTerm"
            @input="onSearch"
            type="search"
            placeholder="Search Zone..."
            class="w-full lg:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex items-center">
            <label for="pageSize" class="mr-2 text-gray-700 text-sm">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchZones()"
              class="border px-2 py-1 rounded text-sm"
            >
              <option v-for="size in pageSizes" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
            <span class="ml-1 text-gray-700 text-sm">per page</span>
          </div>
        </div>

        <!-- Table (Desktop) -->
        <div class="hidden lg:block overflow-x-auto p-4">
          <table
            class="min-w-full table-auto border-collapse text-[13px] font-medium text-gray-700"
          >
            <thead>
              <tr
                class="bg-gray-100 text-gray-800 uppercase tracking-wide text-[12px]"
              >
                <th
                  class="border-b border-gray-300 px-3 py-2 text-left cursor-pointer select-none hover:bg-gray-200 transition"
                  @click="sortBy('name')"
                >
                  Name
                  <SortIcon
                    :field="'name'"
                    :sort-key="sortKey"
                    :sort-asc="sortAsc"
                  />
                </th>
                <th
                  class="border-b border-gray-300 px-3 py-2 text-left cursor-pointer hover:bg-gray-200 transition"
                  @click="sortBy('address')"
                >
                  Address
                  <SortIcon
                    :field="'address'"
                    :sort-key="sortKey"
                    :sort-asc="sortAsc"
                  />
                </th>
                <th
                  class="border-b border-gray-300 px-3 py-2 text-left cursor-pointer hover:bg-gray-200 transition"
                  @click="sortBy('city')"
                >
                  City
                  <SortIcon
                    :field="'city'"
                    :sort-key="sortKey"
                    :sort-asc="sortAsc"
                  />
                </th>
                <th
                  class="border-b border-gray-300 px-3 py-2 text-left cursor-pointer hover:bg-gray-200 transition"
                  @click="sortBy('state')"
                >
                  State
                  <SortIcon
                    :field="'state'"
                    :sort-key="sortKey"
                    :sort-asc="sortAsc"
                  />
                </th>
                <th class="border-b border-gray-300 px-3 py-2 text-left">Owner</th>
                <th class="border-b border-gray-300 px-3 py-2 text-left">Manager</th>
                <th class="border-b border-gray-300 px-3 py-2 text-left">Location</th>
                <th class="border-b border-gray-300 px-3 py-2 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="zone in filteredAndSortedZones"
                :key="zone.id"
                class="hover:bg-gray-50 even:bg-gray-50/40 transition-colors"
              >
                <td class="border-b border-gray-200 px-3 py-1.5 truncate">
                  {{ zone.name }}
                </td>
                <td class="border-b border-gray-200 px-3 py-1.5 truncate">
                  {{ zone.address }}
                </td>
                <td class="border-b border-gray-200 px-3 py-1.5 truncate">
                  {{ zone.city }}
                </td>
                <td class="border-b border-gray-200 px-3 py-1.5 truncate">
                  {{ zone.state }}
                </td>

                <td class="border-b border-gray-200 px-3 py-1.5">
                  <span>{{ zone.ownerName }}</span>
                  <button
                    class="ml-1 text-blue-600 hover:underline text-[12px]"
                    @click="goToDetail(zone.owner_id)"
                  >
                    Details
                  </button>
                </td>

                <td class="border-b border-gray-200 px-3 py-1.5">
                  <span>{{ zone.managerName }}</span>
                  <button
                    class="ml-1 text-blue-600 hover:underline text-[12px]"
                    @click="goToDetail(zone.manager_id)"
                  >
                    Details
                  </button>
                </td>

                <td class="border-b border-gray-200 px-3 py-1.5">
                  <a
                    :href="`https://www.google.com/maps?q=${zone.latlong}&z=15`"
                    target="_blank"
                    class="inline-flex items-center text-blue-600 hover:text-blue-800 text-[12px]"
                  >
                    <i
                      class="fa-solid fa-location-dot text-red-500 mr-1 text-[14px]"
                    ></i>
                    View Map
                  </a>
                </td>

                <td class="border-b border-gray-200 px-3 py-1.5 text-center space-x-2">
                  <button
                    @click="goToZoneDetail(zone.id)"
                    class="text-green-600 hover:text-green-800"
                    title="Detail"
                  >
                    <i class="fas fa-info-circle text-[14px]"></i>
                  </button>
                  <button
                    v-if="$hasPermission('pms.change_propertyzone')"
                    @click="editZone(zone)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <i class="fas fa-edit text-[14px]"></i>
                  </button>
                  <button
                    v-if="$hasPermission('pms.delete_propertyzone')"
                    @click="askDeleteConfirmation(zone)"
                    class="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <i class="fas fa-trash-alt text-[14px]"></i>
                  </button>
                  <button
                    @click="properties(zone.id)"
                    class="text-blue-600 hover:text-blue-800 text-[12px]"
                    title="Properties"
                  >
                    Properties
                  </button>
                  <button
                    @click="openSaleModal(zone.id)"
                    class="text-yellow-600 hover:text-yellow-800 text-[12px]"
                    title="List for Sale"
                  >
                    <i class="fas fa-tag text-[13px]"></i> Sale
                  </button>
                </td>
              </tr>

              <tr v-if="!filteredAndSortedZones.length">
                <td colspan="8" class="text-center py-4 text-gray-500 text-[13px]">
                  No zones found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile View -->
        <div class="block lg:hidden p-4 space-y-4">
          <div
            v-for="zone in filteredAndSortedZones"
            :key="zone.id"
            class="bg-white border rounded-lg shadow-sm p-4"
          >
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-gray-800">{{ zone.name }}</h3>
              <span class="text-sm text-gray-500">{{ zone.state }}</span>
            </div>
            <p class="text-gray-600 text-sm mt-1">{{ zone.address }}</p>
            <p class="text-gray-600 text-sm">{{ zone.city }}</p>

            <div class="mt-3 text-sm">
              <p>
                <strong>Owner:</strong> {{ zone.ownerName }}
                <button
                  class="text-blue-600 ml-1"
                  @click="goToDetail(zone.owner_id)"
                >
                  Details
                </button>
              </p>
              <p>
                <strong>Manager:</strong> {{ zone.managerName }}
                <button
                  class="text-blue-600 ml-1"
                  @click="goToDetail(zone.manager_id)"
                >
                  Details
                </button>
              </p>
            </div>

            <div class="mt-3 flex flex-wrap gap-2">
              <button
                @click="goToZoneDetail(zone.id)"
                class="px-3 py-1 text-green-700 border border-green-300 rounded-lg text-xs"
              >
                Detail
              </button>
              <button
                v-if="$hasPermission('pms.change_propertyzone')"
                @click="editZone(zone)"
                class="px-3 py-1 text-blue-700 border border-blue-300 rounded-lg text-xs"
              >
                Edit
              </button>
              <button
                v-if="$hasPermission('pms.delete_propertyzone')"
                @click="askDeleteConfirmation(zone)"
                class="px-3 py-1 text-red-700 border border-red-300 rounded-lg text-xs"
              >
                Delete
              </button>
              <button
                @click="properties(zone.id)"
                class="px-3 py-1 text-blue-700 border border-blue-300 rounded-lg text-xs"
              >
                Properties
              </button>
              <button
                @click="openSaleModal(zone.id)"
                class="text-yellow-600 hover:text-yellow-800 text-xs"
                title="List for Sale"
              >
                <i class="fas fa-tag"></i> Sale
              </button>
              <a
                :href="`https://www.google.com/maps?q=${zone.latlong}&z=15`"
                target="_blank"
                class="text-blue-600 text-xs flex items-center"
              >
                <i class="fa-solid fa-location-dot text-red-500 mr-1"></i> View Map
              </a>
            </div>
          </div>

          <div
            v-if="!filteredAndSortedZones.length"
            class="text-center text-gray-500 py-6"
          >
            No zones found.
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-4 border-t">
          <button
            :disabled="currentPage <= 1"
            @click="changePage(currentPage - 1)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600 text-sm"
            >Page {{ currentPage }} of {{ totalPages }}</span
          >
          <button
            :disabled="currentPage >= totalPages"
            @click="changePage(currentPage + 1)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Modals -->
      <AddZone
        v-if="visible"
        :visible="visible"
        @close="visible = false"
        @refresh="fetchZones"
      />
      <UpdateZone
        v-if="updateVisible"
        :visible="updateVisible"
        :zone="zoneToEdit"
        @close="updateVisible = false"
        @refresh="fetchZones"
      />
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this zone?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
      <SaleModal
        v-if="saleVisible"
        :visible="saleVisible"
        :propertyZoneId="salePropertyId"
        sourceType="zone"
        @close="saleVisible = false"
        @refresh="fetchZones"
      />
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import AddZone from "./add.vue";
import UpdateZone from "./update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import SaleModal from "../propertiesListForSale/add.vue";

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
  components: { AddZone, UpdateZone, ConfirmModal, SortIcon, Toast, SaleModal },
  data() {
    return {
      globalZones: [],
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      zoneToEdit: null,
      zoneToDelete: null,
      searchTerm: "",
      sortKey: "name",
      sortAsc: true,
      currentPage: 1,
      totalPages: 1,
      pageSize: 10,
      pageSizes: [1, 5, 10, 20, 50, 100],
      saleVisible: false,
      salePropertyId: null,
      loading: false,
    };
  },
  computed: {
    filteredAndSortedZones() {
      let sorted = [...this.globalZones];
      sorted.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });
      return sorted;
    },
  },
  async mounted() {
    await this.fetchZones();
  },
  methods: {
    openSaleModal(propertyZoneId) {
      this.salePropertyId = propertyZoneId;
      this.saleVisible = true;
    },
    async fetchZones() {
      this.loading = true;
      try {
        const params = { ordering: "-id" };
        const url = `/get_property_zones?page=${this.currentPage}&page_size=${this.pageSize}&search=${this.searchTerm}`;
        const result = await this.$getZones(url, params);
        this.globalZones = result.zones;
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
      } catch (err) {
        console.error("Error fetching zones:", err);
        this.globalZones = [];
      } finally {
        this.loading = false;
      }
    },
    onSearch() {
      this.currentPage = 1;
      this.fetchZones();
    },
    changePage(page) {
      this.currentPage = page;
      this.fetchZones();
    },
    editZone(zone) {
      this.zoneToEdit = zone;
      this.updateVisible = true;
    },
    askDeleteConfirmation(zone) {
      this.zoneToDelete = zone;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const response = await this.$apiDelete(
          `/delete_property_zone/${this.zoneToDelete.id}`
        );
        if (response && response.error) {
          this.$root.$refs.toast.showToast(
            response.error || "Failed to delete zone",
            "error"
          );
        } else {
          this.$root.$refs.toast.showToast(
            "Zone deleted successfully",
            "success"
          );
          await this.fetchZones();
        }
      } catch (err) {
        this.$root.$refs.toast.showToast("Failed to delete zone", "error");
        console.error(err);
      }
      this.zoneToDelete = null;
    },
    goToZoneDetail(propertyZoneId) {
      if (propertyZoneId)
        this.$router.push(`/pms/property-zone-detail/${propertyZoneId}`);
    },
    properties(zoneId) {
      this.$router.push(`/pms/properties?zone=${zoneId}`);
    },
    goToDetail(id) {
      if (id) this.$router.push(`/users/${id}`);
    },
    sortBy(field) {
      if (this.sortKey === field) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = field;
        this.sortAsc = true;
      }
    },
  },
};
</script>
