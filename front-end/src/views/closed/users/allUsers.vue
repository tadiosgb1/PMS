<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          <span>Users List</span>
          <button
            @click="showAddModal = true"
            class="bg-white text-primary px-4 py-1 rounded shadow hover:bg-gray-100 font-semibold"
          >
            ➕ Add
          </button>
        </div>

        <!-- Search -->
        <div class="p-4 flex gap-3">
          <input
            v-model="search"
            @input="fetchUsers"
            type="text"
            placeholder="Search by name, email, or phone..."
            class="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-orange-400"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-100 text-left">
              <tr>
                <th class="px-4 py-2">ID</th>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Phone</th>
                <th class="px-4 py-2">Groups</th>
                <th class="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in users"
                :key="user.id"
                class="hover:bg-gray-50"
              >
                <td class="px-4 py-2">{{ user.id }}</td>
                <td class="px-4 py-2">
                  {{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}
                </td>
                <td class="px-4 py-2">{{ user.email }}</td>
                <td class="px-4 py-2">{{ user.phone_number }}</td>
                <td class="px-4 py-2">
                  <span
                    v-if="user.groups.length > 0"
                    class="bg-gray-200 px-2 py-1 rounded text-sm"
                  >
                    {{ user.groups.join(", ") }}
                  </span>
                  <span v-else class="text-gray-400">No groups</span>
                </td>
                <td class="px-4 py-2 flex gap-2">
                  <!-- Edit -->
                 

                  <!-- Details -->
                  <button
                    class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    @click="goToDetail(user.id)"
                  >
                     <i class="fas fa-info-circle"></i>
                  </button>
                  <button
                    v-if="!user.is_active"
                    @click="activateUser(user.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Activate Manager"
                  >
                    Activate
                  </button>
                  <button
                    v-if="user.is_active"
                    @click="deactivateUser(user.id)"
                    class="text-blue-600 hover:text-blue-800"
                    title="Deactivate Manager"
                  >
                    Deactivate
                  </button>
                </td>
              </tr>
              <tr v-if="users.length === 0">
                <td colspan="6" class="text-center py-4 text-gray-500">
                  No users found
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="p-4 flex justify-between items-center">
          <button
            :disabled="!pagination.previous"
            @click="changePage(pagination.current_page - 1)"
            class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {{ pagination.current_page }} of {{ pagination.total_pages }}</span>
          <button
            :disabled="!pagination.next"
            @click="changePage(pagination.current_page + 1)"
            class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Add Modal -->
    <Add
      v-if="showAddModal"
      :visible="showAddModal"
      @close="showAddModal = false"
      @success="fetchUsers"
    />
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import Add from "./add.vue";

export default {
  name: "UsersView",
  components: { Toast, Add },
  data() {
    return {
      users: [],
      search: "",
      pagination: {
        current_page: 1,
        total_pages: 1,
        next: null,
        previous: null,
      },
      showAddModal: false,
    };
  },
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers(page = 1) {
      try {
        const response = await this.$apiGet("/get_users", {
          params: { search: this.search, page },
        });
        this.users = response.data || [];
        this.pagination = {
          current_page: response.current_page,
          total_pages: response.total_pages,
          next: response.next,
          previous: response.previous,
        };
      } catch (error) {
        console.error(error);
        this.$refs.toast.showToast("Failed to load users", "error");
      }
    },
    activateUser(id) {
      this.$apiPost(`/activate_user/${id}`, { id }).then((res) => {
        this.$root.$refs.toast.showToast("Activate User successfully ", "success");
        this.fetchUsers();
      });
    },
    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, id ).then((res) => {
        this.$root.$refs.toast.showToast("Deactive saved successfully ", "success");
        this.fetchUsers();
      });
    },
    changePage(page) {
      this.fetchUsers(page);
    },
    editUser(user) {
      this.$refs.toast.showToast(`Edit user ${user.first_name}`, "info");
    },
    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
  },
};
</script>
