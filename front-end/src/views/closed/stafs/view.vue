<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 ">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Staffs
          <button
            @click="showAddStaff = true"
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
            placeholder="Search Staff..."
            class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="ml-4 flex items-center">
            <label for="pageSize" class="mr-2 text-gray-700">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchStaffs()"
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
                <th class="border border-gray-300 px-4 py-2">Email</th>
                <th class="border border-gray-300 px-4 py-2">Phone</th>
                <th class="border border-gray-300 px-4 py-2">Groups</th>
                <th class="border border-gray-300 px-4 py-2">Active</th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="staff in filteredAndSortedStaffs"
                :key="staff.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">
                  {{ staff.first_name }} {{ staff.middle_name }}
                  {{ staff.last_name }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ staff.email }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ staff.phone_number }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ staff.groups.join(", ") }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ staff.is_active ? "Yes" : "No" }}
                </td>
                <td
                  class="border border-gray-300 px-4 py-2 text-center space-x-2"
                >
                  <router-link
                    :to="`/user_detail/${staff.id}`"
                    class="text-green-600 hover:text-green-800"
                    title="View"
                  >
                    <i class="fas fa-eye"></i>
                  </router-link>
                  <button
                    v-if="!staff.is_active"
                    @click="activateUser(staff.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Activate Staff"
                  >
                    Activate
                  </button>
                  <button
                    v-if="staff.is_active"
                    @click="deactivateUser(staff.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Deactivate Staff"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAndSortedStaffs.length === 0">
                <td colspan="6" class="text-center py-6 text-gray-500">
                  No staffs found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-6">
          <button
            :disabled="!previous"
            @click="fetchStaffs(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600"
            >Page {{ currentPage }} of {{ totalPages }}</span
          >
          <button
            :disabled="!next"
            @click="fetchStaffs(next)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add Staff Modal -->
      <AddStaff
        :visible="showAddStaff"
        @close="showAddStaff = false"
        @success="fetchStaffs()"
      />
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import AddStaff from "./add.vue";

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
  name: "StaffsView",
  components: { SortIcon, Toast, AddStaff },
  data() {
    return {
      searchTerm: "",
      sortKey: "fullName",
      sortAsc: true,
      staffs: [],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 5,
      pageSizes: [5, 10, 20, 50, 100],
      showAddStaff: false,
    };
  },
  computed: {
    filteredAndSortedStaffs() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.staffs.filter(
        (staff) =>
          `${staff.first_name} ${staff.middle_name} ${staff.last_name}`
            .toLowerCase()
            .includes(term) ||
          staff.email.toLowerCase().includes(term) ||
          staff.phone_number.toLowerCase().includes(term) ||
          staff.groups.join(", ").toLowerCase().includes(term) ||
          (staff.is_active ? "yes" : "no").includes(term)
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
    this.fetchStaffs();
  },
  methods: {
  async fetchStaffs(customUrl = null) {
  try {
    let params = {};
    let url = customUrl;

    if (localStorage.getItem('is_superuser') === 'true') {
      url = 'get_staffs';   // fixed spelling
      params = {};          // keep it object
    } else {
      url = 'get_owner_staffs';
      params = {
        owner__id: localStorage.getItem('userId')
      };
    }


    console.log("params",params);

    const res = await this.$apiGet(url, params);

    console.log("staffs result", res);

    this.staffs = Array.isArray(res.data) ? res.data : [];

    console.log("staffs", this.staffs);

    // TODO: handle pagination if backend returns { next, previous, count }
  } catch (err) {
    console.error("Failed to fetch staffs:", err);
    this.staffs = [];
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
      this.$apiPost(`/activate_user/${id}`, { id }).then(() => {
        this.$root.$refs.toast.showToast(
          "Staff activated successfully",
          "success"
        );
        this.fetchStaffs();
      });
    },
    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, { id }).then(() => {
        this.$root.$refs.toast.showToast(
          "Staff deactivated successfully",
          "success"
        );
        this.fetchStaffs();
      });
    },
  },
};
</script>
