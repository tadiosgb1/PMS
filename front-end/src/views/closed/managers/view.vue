<template>
  <div class="min-h-screen bg-gray-100 p-1 sm:p-1">
    <Toast ref="toast" />

    <div class="bg-white shadow-md rounded-lg overflow-hidden">
      <!-- Header -->
      <div
        class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
      >
        Managers
        <button
          @click="showAddManager = true"
          class="bg-white text-blue-700 font-semibold px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition flex items-center border border-gray-300"
        >
          <span class="text-primary mr-1 text-lg">+</span> Add
        </button>
      </div>

      <!-- Search & Page Size -->
      <div class="p-4 sm:p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search manager..."
          class="w-full sm:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div class="flex items-center justify-end">
          <label for="pageSize" class="mr-2 text-gray-700">Show</label>
          <select
            id="pageSize"
            v-model="pageSize"
            @change="fetchManagers()"
            class="border px-3 py-1.5 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option v-for="size in pageSizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
          <span class="ml-2 text-gray-700">per page</span>
        </div>
      </div>

      <!-- ✅ Desktop Table -->
      <div class="hidden md:block overflow-x-auto p-6">
        <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
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
              <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="manager in managers"
              :key="manager.id"
              class="hover:bg-gray-100"
            >
              <td class="border border-gray-300 px-4 py-2">
                {{ manager.manager.first_name }} {{ manager.manager.middle_name }} {{ manager.manager.last_name }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ manager.owner.first_name }} {{ manager.owner.middle_name }} {{ manager.owner.last_name }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ manager.manager.groups.join(", ") }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                <span
                  :class="manager.is_active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'"
                >
                  {{ manager.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                <router-link
                  :to="`/user_detail/${manager.id}`"
                  class="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                >
                  Details
                </router-link>
                <button
                  v-if="!manager.is_active"
                   @click="askConfirmation('activate',manager.id)"
                  class="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200 hover:bg-green-100 transition"
                >
                  Activate
                </button>
                <button
                  v-else
                  @click="askConfirmation('deactivate',manager.id)"
                  class="px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-lg border border-orange-200 hover:bg-orange-100 transition"
                >
                  Deactivate
                </button>
              </td>
            </tr>
            <tr v-if="managers.length === 0">
              <td colspan="5" class="text-center py-6 text-gray-500">
                No managers found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- ✅ Mobile & Tablet Card Layout -->
      <div class="block md:hidden p-4 space-y-4">
        <div
          v-for="manager in managers"
          :key="manager.id"
          class="bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="font-semibold text-gray-900 text-base">
              {{ manager.manager.first_name }} {{ manager.manager.middle_name }} {{ manager.manager.last_name }}
            </h3>
            <span
              :class="manager.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
              class="px-2 py-1 text-xs font-semibold rounded-full"
            >
              {{ manager.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>

          <p class="text-sm text-gray-700">
            <strong>Owner:</strong>
            {{ manager.owner.first_name }} {{ manager.owner.middle_name }} {{ manager.owner.last_name }}
          </p>
          <p class="text-sm text-gray-700">
            <strong>Groups:</strong> {{ manager.manager.groups.join(", ") }}
          </p>

          <div class="mt-3 flex flex-wrap gap-2">
            <router-link
              :to="`/user_detail/${manager.id}`"
              class="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
            >
              Details
            </router-link>
            <button
              v-if="!manager.is_active"
               @click="askConfirmation('activate',manager.id)"
              class="px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
            >
              Activate
            </button>
            <button
              v-else
              @click="askConfirmation('deactivate',manager.id)"
              class="px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
            >
              Deactivate
            </button>
          </div>
        </div>

        <div v-if="managers.length === 0" class="text-center text-gray-500 py-6">
          No managers found.
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex flex-col sm:flex-row justify-between items-center p-4 sm:p-6 border-t bg-gray-50">
        <button
          :disabled="!previous"
          @click="fetchManagers(previous)"
          class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <span class="text-gray-600 my-2 sm:my-0"
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
      v-if="showAddManager"
      :visible="showAddManager"
      @close="showAddManager = false"
      @success="fetchManagers"
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
import AddManager from "./add.vue";
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
  name: "ManagersView",
  components: { SortIcon, Toast, AddManager,ConfirmModal },
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
      searchTimeout: null, // debounce timer

        showConfirm: false,
    selectedUser: null,
    selectedAction: null, // 'activate' or 'deactivate'
    };
  },
  // computed: {
  //   filteredAndSortedManagers() {
  //     const term = this.searchTerm.toLowerCase();
  //     let filtered = this.managers.filter(
  //       (manager) =>
  //         `${manager.first_name} ${manager.middle_name} ${manager.last_name}`
  //           .toLowerCase()
  //           .includes(term) ||
  //         manager.groups.join(", ").toLowerCase().includes(term) ||
  //         (manager.is_active ? "yes" : "no").includes(term)
  //     );

  //     filtered.sort((a, b) => {
  //       let aVal =
  //         `${a.first_name} ${a.middle_name} ${a.last_name}`.toLowerCase();
  //       let bVal =
  //         `${b.first_name} ${b.middle_name} ${b.last_name}`.toLowerCase();
  //       if (aVal < bVal) return this.sortAsc ? -1 : 1;
  //       if (aVal > bVal) return this.sortAsc ? 1 : -1;
  //       return 0;
  //     });

  //     return filtered;
  //   },
  // },
  watch: {
    searchTerm(newVal) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.fetchManagers(null, newVal);
      }, 400); // delay 400ms
    },
  },

  mounted() {
    if(this.$hasPermission('pms.view_ownermanager')==true){
     this.fetchManagers();
    }else{
      this.$router.push({
        name:'accessDenied'
      })
    }
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
    async fetchManagers(url = null, searchTerm = "") {
      try {
        const result = await this.$getManagers(searchTerm); // Global function handles URL & params
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
        this.$root.$refs.toast.showToast("Activate Manger User successfully ", "success");
        this.fetchManagers();
      });
    },
    deactivateUser(id) {
      this.$apiDelete(`/deactivate_user`, { id }).then((res) => {
        this.$root.$refs.toast.showToast("Deactivate Manger User successfully ", "success");
        this.fetchManagers();
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
          this.fetchManagers();
        });
    } else {
      this.$apiDelete(`/deactivate_user`, this.selectedUser)
        .then(() => {
          this.$root.$refs.toast.showToast("User deactivated successfully", "success");
          this.fetchManagers();
        });
    }

    this.showConfirm = false;
  },
  },
};
</script>
