<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 ">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Managers
          <button
            @click="showAddManager = true"
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
            placeholder="Search Manager..."
            class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="ml-4 flex items-center">
            <label for="pageSize" class="mr-2 text-gray-700">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchManagers()"
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
                  @click="sortBy('fullName')"
                >
                  Full Name
                  <SortIcon
                    :field="'fullName'"
                    :sort-key="sortKey"
                    :sort-asc="sortAsc"
                  />
                </th>
                  <th class="border border-gray-300 px-4 py-2">Owner</th>
                      <th class="border border-gray-300 px-4 py-2">Groups</th>
               
                <th class="border border-gray-300 px-4 py-2">Active</th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="manager in filteredAndSortedManagers"
                :key="manager.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">
              

             
                  {{ manager.manager.first_name }} {{ manager.manager.middle_name }}
                  {{ manager.manager.last_name }}
                </td>

                  <td class="border border-gray-300 px-4 py-2">
                {{ manager.owner.first_name }} {{ manager.owner.middle_name }}
                  {{ manager.owner.last_name }}
                  
                </td>
               <td class="border border-gray-300 px-4 py-2">
                  {{ manager.manager.groups.join(", ") }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ manager.is_active ? "Yes" : "No" }}
                </td>
                <td
                  class="border border-gray-300 px-4 py-2 text-center space-x-2"
                >
                  <router-link
                    :to="`/user_detail/${manager.id}`"
                    class="text-green-600 hover:text-green-800"
                    title="View"
                  >
                    <i class="fas fa-eye"></i>
                  </router-link>
                  <button
                    v-if="!manager.is_active"
                    @click="activateUser(manager.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Activate Manager"
                  >
                    Activate
                  </button>
                  <button
                    v-if="manager.is_active"
                    @click="deactivateUser(manager.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Deactivate Manager"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAndSortedManagers.length === 0">
                <td colspan="4" class="text-center py-6 text-gray-500">
                  No managers found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-6">
          <button
            :disabled="!previous"
            @click="fetchManagers(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600"
            >Page {{ currentPage }} of {{ totalPages }}</span
          >
          <button
            :disabled="!next"
            @click="fetchManagers(next)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add Manager Modal -->
      <AddManager
        :visible="showAddManager"
        @close="showAddManager = false"
        @success="fetchManagers()"
      />
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import AddManager from "./add.vue";

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
  name: "ManagersView",
  components: { SortIcon, Toast, AddManager },
  data() {
    return {
      searchTerm: "",
      sortKey: "fullName",
      sortAsc: true,
      managers: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50, 100],
      showAddManager: false,
    };
  },
  computed: {
    filteredAndSortedManagers() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.managers.filter(
        (manager) =>
          `${manager.first_name} ${manager.middle_name} ${manager.last_name}`
            .toLowerCase()
            .includes(term) ||
          manager.groups.join(", ").toLowerCase().includes(term) ||
          (manager.is_active ? "yes" : "no").includes(term)
      );

      filtered.sort((a, b) => {
        let aVal =
          `${a.first_name} ${a.middle_name} ${a.last_name}`.toLowerCase();
        let bVal =
          `${b.first_name} ${b.middle_name} ${b.last_name}`.toLowerCase();
        if (aVal < bVal) return this.sortAsc ? -1 : 1;
        if (aVal > bVal) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchManagers();
  },
  methods: {
    async fetchManagers(url = null) {
      try {
        const result = await this.$getManagers(); // Global function handles URL & params
        console.log("result", result);
        this.managers = result.managers;
        console.log("accepted managers",this.managers);
        this.currentPage = result.currentPage;
        this.totalPages = result.totalPages;
        this.next = result.next;
        this.previous = result.previous;
      } catch (err) {
        console.error("Failed to fetch managers:", err);
        this.managers = [];
        this.currentPage = 1;
        this.totalPages = 1;
        this.next = null;
        this.previous = null;
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    activateUser(id) {
      this.$apiPost(`/activate_user/${id}`, { id }).then((res) => {
        this.$root.$refs.toast.showToast("Plan saved successfully ", "success");
        this.fetchManagers();
      });
    },
    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, { id }).then((res) => {
        this.$root.$refs.toast.showToast("Plan saved successfully ", "success");
        this.fetchManagers();
      });
    },
  },
};
</script>
