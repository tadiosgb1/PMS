<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6">
    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Header -->
      <div
        class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
      >
        Super Staff Users
        <button
          @click="showAddModal = true"
          class="bg-white text-blue-700 font-semibold px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition flex items-center border border-gray-300"
        >
          <span class="text-primary mr-1 text-lg">+</span> Add
        </button>
      </div>

      <!-- Desktop Table -->
      <div class="hidden md:block p-6 overflow-x-auto">
        <table class="min-w-full border-collapse border border-gray-300 text-sm">
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
              <th class="border border-gray-300 px-4 py-2">Groups</th>
              <th class="border border-gray-300 px-4 py-2">Active</th>
              <th class="border border-gray-300 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in sortedSuperStaffs"
              :key="user.id"
              class="hover:bg-gray-100"
            >
              <td class="border border-gray-300 px-4 py-2">
                {{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ user.groups.join(", ") }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                <span
                  :class="user.is_active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'"
                >
                  {{ user.is_active ? "Active" : "Inactive" }}
                </span>
              </td>
              <td
                class="border border-gray-300 px-4 py-2 text-center space-x-2 flex justify-center"
              >
                <button
                  class="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                  @click="goToDetail(user.id)"
                >
                  Details
                </button>

                <button
                  v-if="!user.is_active"
                  @click="askConfirmation('activate', user.id)"
                  class="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
                >
                  Activate
                </button>
                <button
                  v-else
                  @click="askConfirmation('deactivate', user.id)"
                  class="px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
                >
                  Deactivate
                </button>
              </td>
            </tr>
            <tr v-if="superStaffs.length === 0">
              <td colspan="4" class="text-center py-6 text-gray-500">
                No super staff found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ✅ Mobile / Tablet List View -->
      <div class="block md:hidden p-4 space-y-4">
        <div
          v-for="user in sortedSuperStaffs"
          :key="user.id"
          class="bg-gray-50 rounded-xl shadow-sm p-4 border border-gray-200 hover:shadow-md transition"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-base font-semibold text-gray-900">
              {{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}
            </h3>
            <span
              :class="user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              class="px-2 py-1 text-xs font-semibold rounded-full"
            >
              {{ user.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <p class="text-sm text-gray-600 mb-3">
            <strong>Groups:</strong> {{ user.groups.join(", ") }}
          </p>

          <div class="flex flex-wrap gap-2">
            <button
              class="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
              @click="goToDetail(user.id)"
            >
              Details
            </button>

            <button
              v-if="!user.is_active"
              @click="askConfirmation('activate', user.id)"
              class="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
            >
              Activate
            </button>

            <button
              v-else
             @click="askConfirmation('deactivate', user.id)"
              class="px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
            >
              Deactivate
            </button>
          </div>
        </div>

        <div v-if="superStaffs.length === 0" class="text-center text-gray-500 py-6">
          No super staff found.
        </div>
      </div>
    </div>

    <!-- Add User Modal -->
    <Addsuperstaff
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
import Addsuperstaff from "./addSuperStaff.vue";
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
  components: {
    Addsuperstaff,
    SortIcon,
    ConfirmModal
  },
  data() {
    return {
      users: [],
      sortKey: "fullName",
      sortAsc: true,
      showAddModal: false, // ✅ only one variable now
       showConfirm: false,
    selectedUser: null,
    selectedAction: null, // 'activate' or 'deactivate'
    };
  },
  computed: {
    superStaffs() {
      return this.users.filter((u) => u.groups.includes("super_staff"));
    },
    sortedSuperStaffs() {
      return this.superStaffs.sort((a, b) => {
        const aName = `${a.first_name} ${a.middle_name} ${a.last_name}`.toLowerCase();
        const bName = `${b.first_name} ${b.middle_name} ${b.last_name}`.toLowerCase();
        if (aName < bName) return this.sortAsc ? -1 : 1;
        if (aName > bName) return this.sortAsc ? 1 : -1;
        return 0;
      });
    },
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
  mounted() {
    this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const params = { page_size: 1000000 };
        const res = await this.$apiGet("/get_users", params);
        this.users = res.data;
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else this.sortKey = key;
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
    
    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
  },
};
</script>

<style scoped>
@media (max-width: 640px) {
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}
</style>
