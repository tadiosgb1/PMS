<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Users
          <router-link
            to="/user_add"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add
          </router-link>
        </div>

        <!-- Body -->
        <div class="p-6">
          <!-- Search -->
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search User..."
            class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <!-- Table -->
          <div class="overflow-x-auto">
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
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('groups')"
                  >
                    Groups
                    <SortIcon
                      :field="'groups'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('is_active')"
                  >
                    Active
                    <SortIcon
                      :field="'is_active'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="user in filteredAndSortedUsers"
                  :key="user.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">
                    {{ user.first_name }} {{ user.middle_name }}
                    {{ user.last_name }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ user.groups.join(", ") }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ user.is_active ? "Yes" : "No" }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 text-center space-x-2"
                  >
                    <router-link
                      :to="`/user_detail/${user.id}`"
                      class="text-green-600 hover:text-green-800 focus:outline-none"
                      title="View"
                    >
                      <i class="fas fa-eye"></i>
                    </router-link>
                    <router-link
                      :to="`/user_edit/${user.id}`"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </router-link>
                    <button
                      @click="askDeleteConfirmation(user)"
                      class="text-red-600 hover:text-red-800 focus:outline-none"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedUsers.length === 0">
                  <td colspan="4" class="text-center py-6 text-gray-500">
                    No users found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Confirm Modal -->
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this user?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
    </div>
  </div>
</template>

<script>
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";

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
  name: "usersView",
  components: { SortIcon, ConfirmModal, Toast },
  data() {
    return {
      searchTerm: "",
      confirmVisible: false,
      userToDelete: null,
      sortKey: "first_name",
      sortAsc: true,
      users: [],
    };
  },
  computed: {
    filteredAndSortedUsers() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.users.filter(
        (user) =>
          `${user.first_name} ${user.middle_name} ${user.last_name}`
            .toLowerCase()
            .includes(term) ||
          user.groups.join(", ").toLowerCase().includes(term) ||
          (user.is_active ? "yes" : "no").includes(term)
      );

      filtered.sort((a, b) => {
        let aVal =
          this.sortKey === "fullName"
            ? `${a.first_name} ${a.middle_name} ${a.last_name}`.toLowerCase()
            : a[this.sortKey];
        let bVal =
          this.sortKey === "fullName"
            ? `${b.first_name} ${b.middle_name} ${b.last_name}`.toLowerCase()
            : b[this.sortKey];
        if (aVal < bVal) return this.sortAsc ? -1 : 1;
        if (aVal > bVal) return this.sortAsc ? 1 : -1;
        return 0;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const res = await this.$apiGet("/get_users");
        this.users = Array.isArray(res.data) ? res.data : [];
      } catch (err) {
        console.error(err);
        this.users = [];
      }
    },
    sortBy(key) {
      this.sortKey = key === "fullName" ? "fullName" : key;
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else this.sortAsc = true;
    },
    askDeleteConfirmation(user) {
      this.userToDelete = user;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        await this.$apiDelete(`/delete_user/${this.userToDelete.id}`);
        this.$refs.toast.showToast("User deleted", "success");
        this.fetchUsers();
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to delete user", "error");
      }
    },
  },
};
</script>
