<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 mt-3 mx-3">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Co-Working Spaces
          <button
            @click="showAddSpace = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add
          </button>
        </div>

        <!-- Search & Page Size -->
        <div class="p-6 flex justify-between items-center mb-6">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Spaces..."
            class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="ml-4 flex items-center">
            <label for="pageSize" class="mr-2 text-gray-700">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchSpaces()"
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
        <div class="overflow-x-auto p-6">
          <table
            class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
          >
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th
                  class="border border-gray-300 px-4 py-2 cursor-pointer"
                  @click="sortBy('name')"
                >
                  Name
                  <SortIcon
                    :field="'name'"
                    :sort-key="sortKey"
                    :sort-asc="sortAsc"
                  />
                </th>
                <th class="border border-gray-300 px-4 py-2">Location</th>
                <th class="border border-gray-300 px-4 py-2">Description</th>
                <th class="border border-gray-300 px-4 py-2">Capacity</th>
                <th class="border border-gray-300 px-4 py-2">Daily Price</th>
                <th class="border border-gray-300 px-4 py-2">Monthly Price</th>
                <th class="border border-gray-300 px-4 py-2">Quarterly Price</th>
                <th class="border border-gray-300 px-4 py-2">Yearly Price</th>
                <th class="border border-gray-300 px-4 py-2">Zone</th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="space in filteredAndSortedSpaces"
                :key="space.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">{{ space.name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ space.location }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ space.description }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ space.capacity }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ space.price_daily }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ space.price_monthly }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ space.price_quarterly }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ space.price_yearly }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ space.zone }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    @click="editSpace(space)"
                    class="text-green-600 hover:text-green-800"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="askDeleteConfirmation(space);"
                    class="text-red-600 hover:text-red-800"
                  >
                    <i class="fas fa-trash"></i>
                  </button>

             
                  <button
                    @click="goToRentals(space.id);"
                    class="text-blue-600 hover:text-blue-800"
                      >
                    Payments
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAndSortedSpaces.length === 0">
                <td colspan="10" class="text-center py-6 text-gray-500">
                  No co-working spaces found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-6">
          <button
            :disabled="!previous"
            @click="fetchSpaces(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            :disabled="!next"
            @click="fetchSpaces(next)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add & Update Modals -->
      <AddSpace
        :visible="showAddSpace"
        @close="showAddSpace = false"
        @success="fetchSpaces()"
      />
      <UpdateCoworkspace
        :visible="updateVisible"
        :space="spaceToEdit"
        @close="updateVisible = false"
        @refresh="fetchSpaces"
      />

      <!-- Delete Confirmation Modal -->
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this co-working space?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import AddSpace from "./Add.vue";
import UpdateCoworkspace from "./update.vue";
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
  name: "CoworkingSpacesView",
  components: { SortIcon, Toast, AddSpace, UpdateCoworkspace, ConfirmModal },
  data() {
    return {
      searchTerm: "",
      sortKey: "name",
      sortAsc: true,
      spaces: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      showAddSpace: false,
      updateVisible: false,
      spaceToEdit: null,
      confirmVisible: false,
      spaceToDelete: null,
    };
  },
  computed: {
    filteredAndSortedSpaces() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.spaces.filter(
        (space) =>
          space.name.toLowerCase().includes(term) ||
          space.location.toLowerCase().includes(term) ||
          space.description.toLowerCase().includes(term) ||
          String(space.capacity).includes(term) ||
          String(space.price_daily).includes(term) ||
          String(space.price_monthly).includes(term) ||
          String(space.price_quarterly).includes(term) ||
          String(space.price_yearly).includes(term) ||
          String(space.zone).includes(term)
      );

      filtered.sort((a, b) => {
        let aVal = a[this.sortKey];
        let bVal = b[this.sortKey];

        if (typeof aVal === "string") aVal = aVal.toLowerCase();
        if (typeof bVal === "string") bVal = bVal.toLowerCase();

        if (aVal < bVal) return this.sortAsc ? -1 : 1;
        if (aVal > bVal) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchSpaces();
  },
  methods: {
      goToRentals(workspace_id) {
        this.$router.push({
          path: "/coworking-space-rentals",
          query: { workspace_id }
        });
      },
    async fetchSpaces(customUrl = null) {
      try {
        let url = customUrl || "get_coworking_spaces";
        const res = await this.$apiGet(url, { page_size: this.pageSize });
        const data = res.data || {};
        this.spaces = res.data;
        this.currentPage = data.current_page || 1;
        this.totalPages = data.total_pages || 1;
        this.next = data.next;
        this.previous = data.previous;
      } catch (err) {
        console.error("Failed to fetch spaces:", err);
        this.spaces = [];
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else this.sortKey = key;
    },
    editSpace(space) {
      this.spaceToEdit = space;
      this.updateVisible = true;
    },
    askDeleteConfirmation(space) {
       
      this.spaceToDelete = space;
       this.confirmVisible = true;
    
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        await this.$apiDelete(`/delete_coworking_space/${this.spaceToDelete.id}`);
        this.$root.$refs.toast.showToast("Co-Working Space deleted successfully", "success");
        this.fetchSpaces();
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to delete co-working space", "error");
      } finally {
        this.spaceToDelete = null;
      }
    },
  },
};
</script>
