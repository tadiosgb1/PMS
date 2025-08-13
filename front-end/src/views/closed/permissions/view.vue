<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class=" bg-white shadow-md rounded-lg overflow-hidden">
      <div
        class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
      >
        Permissions


            <button
  @click="addVisible = true"
  class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
>
   <span class="text-primary">+</span>  Add 
</button>
      </div>

      <div class="p-6">
        <!-- Search -->
        <input
          v-model="searchTerm"
          type="search"
          placeholder="Search permissions..."
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
                <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('codename')">
                  Codename
                  <SortIcon :field="'codename'" :sort-key="sortKey" :sort-asc="sortAsc" />
                </th>
                <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="permission in filteredAndSortedPermissions"
                :key="permission.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">{{ permission.name }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ permission.codename }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    @click="editPermission(permission)"
                    class="text-blue-600 hover:text-blue-800 focus:outline-none"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="deletePermission(permission)"
                    class="text-red-600 hover:text-red-800 focus:outline-none"
                    title="Delete"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>

              <tr v-if="filteredAndSortedPermissions.length === 0">
                <td colspan="3" class="text-center py-6 text-gray-500">No permissions found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddPermission v-if="addVisible" :visible="addVisible" @close="addVisible = false; fetchPermissions()" />
    <UpdatePermission
      v-if="updateVisible"
      :visible="updateVisible"
      :permission="permissionToEdit"
      @close="updateVisible = false"
      @refresh="fetchPermissions"
    />
    <ConfirmModal
      :visible="deleteModalVisible"
      title="Delete Permission"
      :message="`Are you sure you want to delete '${permissionToDelete?.name}'?`"
      @cancel="deleteModalVisible = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import AddPermission from './add.vue';
import UpdatePermission from './update.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';

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
  `,
};

export default {
  name: 'PermissionsView',
  components: {
    SortIcon,
    AddPermission,
    UpdatePermission,
    ConfirmModal,
  },
  data() {
    return {
      searchTerm: '',
      sortKey: 'name',
      sortAsc: true,
      permissions: [],
      addVisible: false,
      updateVisible: false,
      permissionToEdit: null,
      deleteModalVisible: false,
      permissionToDelete: null,
    };
  },
  computed: {
    filteredAndSortedPermissions() {
      let filtered = this.permissions.filter(p =>
        p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        p.codename.toLowerCase().includes(this.searchTerm.toLowerCase())
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
    this.fetchPermissions();
  },
  methods: {
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    async fetchPermissions() {
      const params={
        page_size:1000
      }
      try {
        const response = await this.$apiGet('/get_permissions',params);
        this.permissions = response.data;
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
        alert('Failed to load permissions.');
      }
    },
    editPermission(permission) {
      this.permissionToEdit = permission;
      this.updateVisible = true;
    },
    deletePermission(permission) {
      this.permissionToDelete = permission;
      this.deleteModalVisible = true;
    },
    async confirmDelete() {
      try {
        await this.$apiDelete(`/delete_permission/${this.permissionToDelete.id}`);
        alert("Permission deleted.");
        this.fetchPermissions();
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete permission.");
      } finally {
        this.permissionToDelete = null;
        this.deleteModalVisible = false;
      }
    }
  }
};
</script>
