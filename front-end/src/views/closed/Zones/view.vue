<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 p-4 lg:p-6">
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
            <label for="pageSize" class="mr-2 text-gray-700 text-sm"
              >Show</label
            >
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
            class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
          >
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th
                  class="border px-4 py-2 cursor-pointer"
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
                  class="border px-4 py-2 cursor-pointer"
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
                  class="border px-4 py-2 cursor-pointer"
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
                  class="border px-4 py-2 cursor-pointer"
                  @click="sortBy('state')"
                >
                  State
                  <SortIcon
                    :field="'state'"
                    :sort-key="sortKey"
                    :sort-asc="sortAsc"
                  />
                </th>
                <th class="border px-4 py-2">Owner</th>
                <th class="border px-4 py-2">Manager</th>
                <th class="border px-4 py-2">Locations</th>
                <th class="border px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="zone in filteredAndSortedZones"
                :key="zone.id"
                class="hover:bg-gray-100"
              >
                <td class="border px-4 py-2">{{ zone.name }}</td>
                <td class="border px-4 py-2">{{ zone.address }}</td>
                <td class="border px-4 py-2">{{ zone.city }}</td>
                <td class="border px-4 py-2">{{ zone.state }}</td>
                <td class="border px-4 py-2">
                  {{ zone.ownerName }}
                  <button
                    class="ml-2 text-blue-600 hover:underline"
                    @click="goToDetail(zone.owner_id)"
                  >
                    Details
                  </button>
                </td>

                <td class="border px-4 py-2">
                  {{ zone.managerName }}
                  <button
                    class="ml-2 text-blue-600 hover:underline"
                    @click="goToDetail(zone.manager_id)"
                  >
                    Details
                  </button>
                </td>

                <td class="border px-4 py-2">
                  <a
                    href="https://www.google.com/maps?q=13.4967,39.4753&z=15"
                    target="_blank"
                    style="
                      text-decoration: none;
                      color: #0078ff;
                      font-size: 16px;
                    "
                  >
                    <i
                      class="fa-solid fa-location-dot"
                      style="color: red; margin-right: 6px"
                    ></i>
                    View on Maps
                  </a>
                </td>

                <td class="border px-4 py-2 text-center space-x-2">
                  <button
                    @click="goToZoneDetail(zone.id)"
                    class="text-green-600 hover:text-green-800"
                    title="Detail"
                    :disabled="!zone.id"
                  >
                    <i class="fas fa-info-circle"></i>
                  </button>
                  <button
                    v-if="$hasPermission('pms.change_propertyzone')"
                    @click="editZone(zone)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    v-if="$hasPermission('pms.delete_propertyzone')"
                    @click="askDeleteConfirmation(zone)"
                    class="text-red-600 hover:text-red-800"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                  <button
                    @click="properties(zone.id)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Properties
                  </button>
                </td>
              </tr>

              <tr v-if="filteredAndSortedZones.length === 0">
                <td colspan="7" class="text-center py-6 text-gray-500">
                  No zones found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
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

              <a
                href="https://www.google.com/maps?q=13.4967,39.4753&z=15"
                target="_blank"
                style="text-decoration: none; color: #0078ff; font-size: 16px"
              >
                <i
                  class="fa-solid fa-location-dot"
                  style="color: red; margin-right: 6px"
                ></i>
                View on Maps
              </a>
            </div>
          </div>

          <div
            v-if="filteredAndSortedZones.length === 0"
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
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import AddZone from "./add.vue";
import UpdateZone from "./update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

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
  components: { AddZone, UpdateZone, ConfirmModal, SortIcon, Toast },
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
    async fetchZones() {
      try {
        const params = {
          ordering: "-id",
        };
        console.log("params in fetching zones", params);
        const url = `/get_property_zones?page=${this.currentPage}&page_size=${this.pageSize}&search=${this.searchTerm}`;

        const result = await this.$getZones(url, params);
        console.log("result for zones", result);
        this.globalZones = result.zones;
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
      } catch (err) {
        console.error("Error fetching zones:", err);
        this.globalZones = [];
        this.currentPage = 1;
        this.totalPages = 1;
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
        this.$router.push({
          name: "zoneDetail",
          params: { id: propertyZoneId },
        });
    },
    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    properties(zone_id) {
      this.$router.push({ path: "/properties", query: { zone_id } });
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
  },
};
</script>
