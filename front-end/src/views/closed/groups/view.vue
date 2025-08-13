<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class=" bg-white shadow-md rounded-lg overflow-hidden">
      <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
        Groups
       <button
      @click="visible = true"
      class="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
    >
      <span class="text-primary">+</span>   Add Group
    </button>

      </div>

      <div class="p-6">
        <!-- Search -->
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search group..."
          class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <!-- Table -->
        <div class="overflow-x-auto">
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
              <tr
                v-for="group in filteredAndSortedGroups"
                :key="group.id"
                class="hover:bg-gray-100"
              >
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
      </div>
    </div>

    <!-- Optional Modal -->
    <AddGroup v-if="visible" :visible="visible" @close="visible = false" />
  </div>
</template>

<script>
import AddGroup from './add.vue'
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
  components: {
    SortIcon,
    AddGroup,
  },
  data() {
    return {
      searchTerm: '',
      visible: false,
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
      const params={
        page_size:1000
      }
      try {
        const response = await this.$apiGet("/get_groups",params);
        console.log("response",response);
        this.groups = response.data || [];
        console.log("groups",this.groups);
      } catch (error) {
        console.error("Failed to fetch groups:", error);
        this.groups = [];
        alert("Failed to load groups. Please try again later.");
      }
    },
    sortBy(key) {
      this.sortKey === key ? (this.sortAsc = !this.sortAsc) : ((this.sortKey = key), (this.sortAsc = true));
    },
    editGroup(group) {
      alert(`Edit group: ${group.name}`);
    },
    deleteGroup(group) {
      if (confirm(`Are you sure you want to delete "${group.name}"?`)) {
        this.groups = this.groups.filter(g => g.id !== group.id);
        alert('Group deleted.');
      }
    }
  }
};
</script>
