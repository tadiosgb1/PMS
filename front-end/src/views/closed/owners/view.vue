<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Owners
          <button v-if="showAdd"
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add Owner
          </button>
        </div>

        <div class="p-6">
          <!-- Search -->
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search owner..."
            class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('full_name')">
                    Full Name
                    <SortIcon :field="'full_name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="owner in filteredAndSortedOwners"
                  :key="owner.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">{{ owner.full_name }}</td>
                  <td class="flex flex-row border border-gray-300 px-4 py-2 text-center space-x-2">
                   <button
                    class="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                    @click="goToDetail(owner.id)"
                  >
                    <i class="fas fa-info-circle"></i> Details
                  </button>

                  <!-- Activate / Deactivate -->
                  <button
                    v-if="!owner.is_active"
                    @click="activateUser(owner.id)"
                    class="flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  >
                    <i class="fas fa-check-circle"></i> Activate
                  </button>
                  <button
                    v-else
                    @click="deactivateUser(owner.id)"
                    class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                  >
                    <i class="fas fa-ban mr-1"></i> Deactivate
                  </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedOwners.length === 0">
                  <td colspan="2" class="text-center py-6 text-gray-500">No owners found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Add Owner Modal -->
      <AddOwner v-if="visible" :visible="visible" @close="visible = false" @saved="fetchOwners" />

      <!-- Update Owner Modal -->
      <UpdateOwner
        v-if="updateVisible"
        :visible="updateVisible"
        :ownerData="selectedOwner"
        @close="updateVisible = false"
        @updated="fetchOwners"
      />
    </div>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';
import AddOwner from './add.vue';
import UpdateOwner from './edit.vue';

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
  components: { SortIcon, AddOwner, UpdateOwner, Toast },
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
    };
  },
  computed: {
    filteredAndSortedOwners() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.owners.filter(o =>
        o.full_name.toLowerCase().includes(term)
      );
      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });
      return filtered;
    }
  },
async   mounted() {
    this.fetchOwners();
    const payload={
     group:'owner'
    }
     const response = await this.$apiGetById('/get_group_permissions',payload);
      console.log("response owners",response)

  },
  methods: {
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
        const response = await this.$apiGet('/get_owners');
        this.owners = response.owners || [];
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
