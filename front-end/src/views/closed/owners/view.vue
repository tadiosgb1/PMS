<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 p-4">
      <!-- Card Container -->
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center flex-wrap gap-3"
        >
          <span>Owners</span>

          <button
            v-if="showAdd"
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-4 py-2 rounded-lg shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary text-xl font-bold mr-1">+</span>
            Add Owner
          </button>
        </div>

        <!-- Search -->
        <div class="p-4 border-b bg-gray-50">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search owner..."
            class="w-full md:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block p-4 overflow-x-auto">
          <table class="min-w-full table-auto border-collapse border border-gray-300 rounded-lg overflow-hidden">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th
                  class="border border-gray-300 px-4 py-2 text-left cursor-pointer"
                  @click="sortBy('full_name')"
                >
                  Full Name
                  <SortIcon
                    :field="'full_name'"
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
                v-for="owner in owners"
                :key="owner.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">
                  {{ owner.full_name }}
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <div class="flex justify-center gap-2 flex-wrap">
                    <button
                      class="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                      @click="goToDetail(owner.id)"
                    >
                      <i class="fas fa-info-circle"></i> Details
                    </button>

                    <button
                      v-if="!owner.is_active"
                       @click="askConfirmation('activate',owner.id)"
                      class="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
                    >
                      <i class="fas fa-check-circle"></i> Activate
                    </button>
                    <button
                      v-else
                      @click="askConfirmation('deactivate',owner.id)"
                      class="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
                    >
                      <i class="fas fa-ban"></i> Deactivate
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="owners.length === 0">
                <td colspan="2" class="text-center py-6 text-gray-500">
                  No owners found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile / Tablet Cards -->
        <div class="md:hidden p-4 space-y-4">
          <div
            v-for="owner in owners"
            :key="owner.id"
            class="border border-gray-200 bg-white rounded-lg shadow-sm p-4"
          >
            <div class="flex justify-between items-center mb-2">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ owner.full_name }}
              </h3>
              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="owner.is_active ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'"
              >
                {{ owner.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                class="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition"
                @click="goToDetail(owner.id)"
              >
                <i class="fas fa-info-circle"></i> Details
              </button>

              <button
                v-if="!owner.is_active"
                @click="askConfirmation('activate',owner.id)"
                class="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
              >
                <i class="fas fa-check-circle"></i> Activate
              </button>
              <button
                v-else
                @click="askConfirmation('deactivate',owner.id)"
                class="flex items-center gap-1 px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
              >
                <i class="fas fa-ban"></i> Deactivate 
              </button>
            </div>
          </div>

          <div v-if="owners.length === 0" class="text-center py-6 text-gray-500">
            No owners found.
          </div> 
        </div>
      </div>

      <!-- Add Owner Modal -->
      <AddOwner
        v-if="visible"
        :visible="visible"
        @close="visible = false"
        @saved="fetchOwners"
      />

      <!-- Update Owner Modal -->
      <UpdateOwner
        v-if="updateVisible"
        :visible="updateVisible"
        :ownerData="selectedOwner"
        @close="updateVisible = false"
        @updated="fetchOwners"
      />

       <ConfirmModal
  :visible="showConfirm"
  :title="confirmTitle"
  :message="confirmMessage"
  @cancel="showConfirm = false"
  @confirm="confirmAction"
/>
    </div>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';
import AddOwner from './add.vue';
import UpdateOwner from './edit.vue';
import ConfirmModal from "@/components/ConfirmModal.vue";

const SortIcon = {
  props: ['field', 'sortKey', 'sortAsc'],
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
  `
};

export default {
  name: 'OwnersView',
  components: { SortIcon, AddOwner, UpdateOwner, Toast,ConfirmModal },
  data() {
    return {
      searchTerm: '',
      visible: false,
      updateVisible: false,
      selectedOwner: null,
      sortKey: 'full_name',
      sortAsc: true,
      owners: [],
      groupPermissions:"",
      ordering:"-id",

      showConfirm: false,
    selectedUser: null,
    selectedAction: null, // 'activate' or 'deactivate'
    };
  },
  // computed: {
  //   filteredAndSortedOwners() {
  //     const term = this.searchTerm.toLowerCase();
  //     let filtered = this.owners.filter(o =>
  //       o.full_name.toLowerCase().includes(term)
  //     );
  //     filtered.sort((a, b) => {
  //       let res = 0;
  //       if (a[this.sortKey] < b[this.sortKey]) res = -1;
  //       if (a[this.sortKey] > b[this.sortKey]) res = 1;
  //       return this.sortAsc ? res : -res;
  //     });
  //     return filtered;
  //   }
  // },
async   mounted() {
    this.fetchOwners();
    const payload={
     group:'owner'
    }
     const response = await this.$apiGetById('/get_group_permissions',payload);
      console.log("response owners",response)

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
          this.fetchOwners();
        });
    } else {
      this.$apiDelete(`/deactivate_user`, this.selectedUser)
        .then(() => {
          this.$root.$refs.toast.showToast("User deactivated successfully", "success");
          this.fetchOwners();
        });
    }

    this.showConfirm = false;
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

   

    goToDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    async fetchOwners() {
      try {
        const response = await this.$apiGet(`/get_owners?search=${this.searchTerm}&ordering=${this.ordering}`);

        this.owners = response.owners || [];

        console.log("owners",response);

      } catch (error) {
        console.error('Failed to fetch owners:', error);
        this.owners = [];
        alert('Failed to load owners. Please try again later.');
      }
    },
    sortBy(key) {
      this.sortKey === key ? (this.sortAsc = !this.sortAsc) : ((this.sortKey = key), (this.sortAsc = true));
    },
    editOwner(owner) {
      this.selectedOwner = { ...owner };
      this.updateVisible = true;
    },
    async deleteOwner(owner) {
      if (confirm(`Are you sure you want to delete "${owner.full_name}"?`)) {
        try {
          await this.$apiDelete(`/delete_owner/${owner.id}`);
          this.$root.$refs.toast.showToast('Owner deleted successfully', 'success');
          this.owners = this.owners.filter(o => o.id !== owner.id);
        } catch (err) {
          console.error(err);
          alert('Failed to delete owner.');
        }
      }
    }
  }
};
</script>
