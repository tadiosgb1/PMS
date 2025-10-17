<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-4 md:p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Groups
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add Group
          </button>
        </div>

        <div class="p-6">
          <!-- Search -->
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search group..."
            class="w-full md:w-1/3 px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <!-- Table for Desktop -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('name')">
                    Name
                    <SortIcon :field="'name'" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-4 py-2">Permissions</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="group in filteredAndSortedGroups" :key="group.id" class="hover:bg-gray-100">
                  <td class="border border-gray-300 px-4 py-2">{{ group.name }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <ul class="list-disc list-inside text-sm">
                      <li v-for="perm in group.permissions" :key="perm">{{ perm }}</li>
                    </ul>
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                    <button @click="editGroup(group)" class="text-blue-600 hover:text-blue-800" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button @click="deleteGroup(group)" class="text-red-600 hover:text-red-800" title="Delete">
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedGroups.length === 0">
                  <td colspan="3" class="text-center py-6 text-gray-500">No groups found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Card/List view for Mobile & Tablet -->
          <div class="md:hidden flex flex-col gap-4">
            <div v-for="group in filteredAndSortedGroups" :key="group.id" class="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2">
              <div class="flex justify-between items-center">
                <h3 class="font-semibold text-lg">{{ group.name }}</h3>
              </div>
              <div class="text-sm text-gray-700">
                <span class="font-semibold">Permissions:</span>
                <ul class="list-disc list-inside ml-4 mt-1">
                  <li v-for="perm in group.permissions" :key="perm">{{ perm }}</li>
                </ul>
              </div>
              <div class="flex gap-2 mt-2">
                <button @click="editGroup(group)" class="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 transition">
                  <i class="fas fa-edit mr-1"></i> Edit
                </button>
                <button @click="deleteGroup(group)" class="flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition">
                  <i class="fas fa-trash-alt mr-1"></i> Delete
                </button>
              </div>
            </div>
            <div v-if="filteredAndSortedGroups.length === 0" class="text-center py-6 text-gray-500">
              No groups found.
            </div>
          </div>
        </div>
      </div>

      <!-- Add Modal -->
      <AddGroup v-if="visible" :visible="visible" @close="visible = false" @saved="fetchGroups" />

      <!-- Update Modal -->
      <UpdateGroup
        v-if="updateVisible"
        :visible="updateVisible"
        :groupData="selectedGroup"
        @close="updateVisible = false"
        @updated="fetchGroups"
      />
    </div>
  </div>
</template>


<script>
import Toast from '../../../components/Toast.vue';
import AddGroup from './add.vue';
import UpdateGroup from './update.vue';

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
  name: 'GroupsView',
  components: { SortIcon, AddGroup, UpdateGroup ,Toast},
  data() {
    return {
      searchTerm: '',
      visible: false,
      updateVisible: false,
      selectedGroup: null,
      sortKey: 'name',
      sortAsc: true,
      groups: []
    };
  },
  computed: {
    filteredAndSortedGroups() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.groups.filter(g =>
        g.name.toLowerCase().includes(term) ||
        g.permissions.some(p => p.toLowerCase().includes(term))
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
  mounted() {
    this.fetchGroups();
  },
  methods: {
    async fetchGroups() {
      try {
        const response = await this.$apiGet('/get_groups', { page_size: 1000 });
        this.groups = response.data || [];
        
        console.log("groups",this.groups);

      } catch (error) {
        console.error('Failed to fetch groups:', error);
        alert('Failed to load groups. Please try again later.');
        this.groups = [];
      }
    },
    sortBy(key) {
      this.sortKey === key ? (this.sortAsc = !this.sortAsc) : ((this.sortKey = key), (this.sortAsc = true));
    },
    editGroup(group) {
      this.selectedGroup = { ...group };
      this.updateVisible = true;
    },
    async deleteGroup(group) {
      if (confirm(`Are you sure you want to delete "${group.name}"?`)) {
        try {
          await this.$apiDelete(`/delete_group/${group.id}`);
          this.$root.$refs.toast.showToast('Group deleted successfully', 'success');
          this.groups = this.groups.filter(g => g.id !== group.id);
          this.fetchGroups();
        } catch (err) {
          console.error(err);
          alert('Failed to delete group.');
        }
      }
    }
  }
};
</script>
