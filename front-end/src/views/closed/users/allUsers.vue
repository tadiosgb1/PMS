<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 p-4 md:p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          <span>Users List</span>
          <button
            @click="showAddModal = true"
            class="bg-white text-primary px-4 py-1 rounded shadow hover:bg-gray-100 font-semibold flex items-center gap-2 transition-all"
          >
            <i class="fas fa-user-plus"></i> Add User
          </button>
        </div>

        <!-- Search + Page Size -->
        <div class="p-4 flex flex-col md:flex-row gap-3 md:items-center">
          <input
            v-model="search"
            @input="fetchUsers(1)"
            type="text"
            placeholder="Search by name, email, or phone..."
            class="flex-1 px-4 py-2 border rounded-lg focus:ring focus:ring-primary/40"
          />
          <div class="flex items-center gap-2">
            <label class="text-gray-600 text-sm">Show</label>
            <select
              v-model="pageSize"
              @change="fetchUsers(1)"
              class="border px-2 py-1 rounded-lg focus:ring focus:ring-primary/40"
            >
              <option v-for="size in [5,10,20,50,100,1000]" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
            <span class="text-gray-600 text-sm">per page</span>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto">
          <table class="w-full border-collapse">
            <thead class="bg-gray-100 text-left">
              <tr>
                <th class="px-4 py-2">ID</th>
                <th class="px-4 py-2">Name</th>
                <th class="px-4 py-2">Email</th>
                <th class="px-4 py-2">Phone</th>
                <th class="px-4 py-2">Groups</th>
                <th class="px-4 py-2 text-center">Actions</th>
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
                    v-if="user.groups?.length"
                    class="bg-gray-200 px-2 py-1 rounded text-sm"
                  >
                    {{ user.groups.join(", ") }}
                  </span>
                  <span v-else class="text-gray-400">No groups</span>
                </td>
                <td class="px-4 py-2 flex gap-2 justify-center">
                  <button
                    @click="goToDetail(user.id)"
                    class="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                  >
                    <i class="fas fa-info-circle"></i> Details
                  </button>
                  <button
                    v-if="!user.is_active"
                    @click="askConfirmation('activate',user.id)"
                    class="flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
                  >
                    <i class="fas fa-check-circle"></i> Activate
                  </button>
                  <button
                    v-else
                     @click="askConfirmation('deactivate',user.id)"
                    class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
                  >
                    <i class="fas fa-ban mr-1"></i> Deactivate
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

        <!-- Mobile / Tablet Card View -->
        <div class="md:hidden flex flex-col gap-4 p-4">
          <div
            v-for="user in users"
            :key="user.id"
            class="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-lg text-gray-800">
                {{ user.first_name }} {{ user.last_name }}
              </h3>
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
              >
                {{ user.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <p class="text-sm text-gray-600">
              <strong>Email:</strong> {{ user.email || '—' }}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Phone:</strong> {{ user.phone_number || '—' }}
            </p>

            <p class="text-sm text-gray-600">
              <strong>Groups:</strong>
              <span
                v-if="user.groups?.length"
                class="text-gray-700"
              >
                {{ user.groups.join(', ') }}
              </span>
              <span v-else class="text-gray-400">No groups</span>
            </p>

            <div class="flex flex-wrap gap-2 mt-2">
              <button
                @click="goToDetail(user.id)"
                class="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
              >
                <i class="fas fa-info-circle"></i> Details
              </button>
              <button
                v-if="!user.is_active"
                @click="askConfirmation('activate',user.id)"
                class="flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
              >
                <i class="fas fa-check-circle"></i> Activate
              </button>
              <button
                v-else
                @click="askConfirmation('deactivate',user.id)"
                class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
              >
                <i class="fas fa-ban"></i> Deactivate
              </button>
            </div>
          </div>

          <div v-if="users.length === 0" class="text-center py-6 text-gray-500">
            No users found.
          </div>
        </div>

        <!-- Pagination -->
        <div class="p-4 flex flex-col sm:flex-row justify-between items-center gap-3 border-t">
          <button
            :disabled="!pagination.previous"
            @click="changePage(pagination.current_page - 1)"
            class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
          >
            Previous
          </button>

          <span class="text-gray-700 text-sm">
            Page {{ pagination.current_page }} of {{ pagination.total_pages }}
          </span>

          <button
            :disabled="!pagination.next"
            @click="changePage(pagination.current_page + 1)"
            class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
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
   <ConfirmModal
  :visible="showConfirm"
  :title="confirmTitle"
  :message="confirmMessage"
  @cancel="showConfirm = false"
  @confirm="confirmAction"
/>
  </div>
</template>


<script>
import Toast from "@/components/Toast.vue";
import Add from "./add.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  name: "UsersView",
  components: { Toast, Add,ConfirmModal },
  data() {
    return {
      users: [],
      search: "",
      pageSize: 10,
      pagination: {
        current_page: 1,
        total_pages: 1,
        next: null,
        previous: null,
      },
      showAddModal: false,
       showConfirm: false,
    selectedUser: null,
    selectedAction: null, // 'activate' or 'deactivate'
    };
  },
  mounted() {
    this.fetchUsers();
  },
  computed: {
  confirmTitle() {
    return this.selectedAction === "activate"
      ? "Activate User"
      : "Deactivate User";
  },
  confirmMessage() {
    return this.selectedAction === "activate"
      ? "Are you sure you want to activate this user?"
      : "Are you sure you want to deactivate this user?";
  },
},
  methods: {
    async fetchUsers(page = 1) {
      try {
        const params = {
          search: this.search,
          page,
          page_size: this.pageSize,
          ordering:"-id"
        };

        const response = await this.$apiGet("/get_users", params);

        this.users = response.data || [];

        this.pagination = {
          current_page: response.current_page,
          total_pages: response.total_pages,
          next: response.next,
          previous: response.previous,
        };
      } catch (error) {
        console.error(error);
        this.$root.$refs.toast.showToast("Failed to load users", "error");
      }
    },

    activateUser(id) {
      this.$apiPost(`/activate_user/${id}`, { id }).then(() => {
        this.$root.$refs.toast.showToast("User activated successfully", "success");
        this.fetchUsers(this.pagination.current_page);
      });
    },

    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, id).then(() => {
        this.$root.$refs.toast.showToast("User deactivated successfully", "success");
        this.fetchUsers(this.pagination.current_page);
      });
    },
  askConfirmation(action, id) {
    this.selectedUser = id;
    this.selectedAction = action;
    this.showConfirm = true;
  },

  confirmAction() {
    if (!this.selectedUser || !this.selectedAction) return;

    if (this.selectedAction === "activate") {
      this.$apiPost(`/activate_user/${this.selectedUser}`, { id: this.selectedUser })
        .then(() => {
          this.$root.$refs.toast.showToast("User activated successfully", "success");
          this.fetchUsers(this.pagination.current_page);
        });
    } else {
      this.$apiDelete(`/deactivate_user`, this.selectedUser)
        .then(() => {
          this.$root.$refs.toast.showToast("User deactivated successfully", "success");
          this.fetchUsers(this.pagination.current_page);
        });
    }

    this.showConfirm = false;
  },
    changePage(page) {
      this.fetchUsers(page);
    },

    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
  },
};
</script>
