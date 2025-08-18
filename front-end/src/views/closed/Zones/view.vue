<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Property Zones

          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add Zone
          </button>
        </div>

        <div class="p-6">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Zone..."
            class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="overflow-x-auto">
            <table
              class="min-w-full table-auto border-collapse border border-gray-300"
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
                  <th class="border px-4 py-2">Owner ID</th>
                  <th class="border px-4 py-2">Manager ID</th>
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
                  <td class="border px-4 py-2">{{ zone.owner_id }}</td>
                  <td class="border px-4 py-2">{{ zone.manager_id }}</td>
                  <td class="border px-4 py-2 text-center space-x-2">
                    <button
                      @click="editZone(zone)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="askDeleteConfirmation(zone)"
                      class="text-red-600 hover:text-red-800"
                    >
                      <i class="fas fa-trash-alt"></i>
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
        </div>
      </div>

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
import ConfirmModal from "@/components/ConfirmModal.vue"; // adjust path as needed

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
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      zoneToEdit: null,
      zoneToDelete: null,
      zones: [],
      searchTerm: "",
      sortKey: "name",
      sortAsc: true,
    };
  },
  computed: {
    filteredAndSortedZones() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.zones.filter(
        (z) =>
          z.name.toLowerCase().includes(term) ||
          z.address.toLowerCase().includes(term) ||
          z.city.toLowerCase().includes(term) ||
          z.state.toLowerCase().includes(term)
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
  mounted() {
    this.fetchZones();
  },
  methods: {
    async fetchZones() {
      try {
        const isSuperUser =
          localStorage.getItem("is_superuser") == "1" ||
          localStorage.getItem("is_superuser") === "true";
        const params = isSuperUser
          ? {}
          : { owner_id__email: localStorage.getItem("email") };

        console.log("params", params);
        const response = await this.$apiGet("/get_property_zones", params);

        this.zones = response.data || [];
      } catch (err) {
        console.error("Error fetching zones:", err);
      }
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
        await this.$apiDelete(`/delete_property_zone/${this.zoneToDelete.id}`);
        this.$root.$refs.toast.showToast(
          "Zone deleted successfully ",
          "success"
        );
        setTimeout(() => {
          this.$emit("close");
        }, 3000); // 3000 milliseconds = 3 seconds
        this.fetchZones();
      } catch (err) {
        alert("Failed to delete zone");
        console.error(err);
      }
      this.zoneToDelete = null;
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
  },
};
</script>
