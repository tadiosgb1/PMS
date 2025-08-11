<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class=" bg-white shadow-md rounded-lg overflow-hidden">
      <div class="bg-primary text-white px-6 py-4 text-xl font-semibold">
        Add New User
      </div>
      <form @submit.prevent="submitForm" class="p-6 space-y-6">

        <!-- User Info -->
        <div>
          <label class="block mb-2 font-medium text-gray-700">Full Name</label>
          <input
            v-model="form.fullName"
            type="text"
            required
            placeholder="John Doe"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label class="block mb-2 font-medium text-gray-700">Email</label>
          <input
            v-model="form.email"
            type="email"
            required
            placeholder="john@example.com"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label class="block mb-2 font-medium text-gray-700">Password</label>
          <input
            v-model="form.password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <!-- Roles Select -->
        <div>
          <label class="block mb-2 font-medium text-gray-700">Assign Role (Group of Permissions)</label>
          <select
            v-model="form.role"
            @change="onRoleChange"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="" disabled>Select Role</option>
            <option v-for="role in roles" :key="role.id" :value="role.id">
              {{ role.name }}
            </option>
          </select>
        </div>

        <!-- Permissions Checkboxes -->
        <div>
          <label class="block mb-2 font-medium text-gray-700">Or Select Individual Permissions</label>
          <div class="max-h-48 overflow-y-auto border rounded-md p-3 bg-gray-50">
            <div
              v-for="perm in permissions"
              :key="perm.id"
              class="flex items-center mb-2"
            >
              <input
                type="checkbox"
                :id="'perm-'+perm.id"
                :value="perm.id"
                v-model="form.selectedPermissions"
                :disabled="roleHasPermission(perm.id)"
                class="mr-2"
              />
              <label
                :for="'perm-'+perm.id"
                :class="{ 'text-gray-400 cursor-not-allowed': roleHasPermission(perm.id) }"
              >
                {{ perm.name }} ({{ perm.codename }})
              </label>
            </div>
          </div>
          <p class="mt-1 text-sm text-gray-500">
            Permissions checked by role are <span class="font-semibold">disabled</span> here.
          </p>
        </div>

        <div>
          <button
            type="submit"
            class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddUser",
  data() {
    return {
      form: {
        fullName: '',
        email: '',
        password: '',
        role: '',
        selectedPermissions: [],
      },
      // Example roles with permissions IDs assigned
      roles: [
        { id: 1, name: "Admin", permissionIds: [1, 2, 3, 4, 5, 6] },
        { id: 2, name: "Manager", permissionIds: [1, 2, 3] },
        { id: 3, name: "Viewer", permissionIds: [1] },
      ],
      // Example permissions list
      permissions: [
        { id: 1, name: "View Properties", codename: "view_properties" },
        { id: 2, name: "Add Property", codename: "add_property" },
        { id: 3, name: "Edit Property", codename: "change_property" },
        { id: 4, name: "Delete Property", codename: "delete_property" },
        { id: 5, name: "View Tenants", codename: "view_tenants" },
        { id: 6, name: "Edit Users", codename: "change_user" },
      ],
    };
  },
  methods: {
    onRoleChange() {
      // When a role is selected, clear manual permissions selection
      // Because role already defines those permissions
      this.form.selectedPermissions = [];
    },
    roleHasPermission(permissionId) {
      if (!this.form.role) return false;
      const role = this.roles.find(r => r.id === this.form.role);
      return role ? role.permissionIds.includes(permissionId) : false;
    },
    submitForm() {
      if (!this.form.fullName || !this.form.email || !this.form.password) {
        alert("Please fill all required user fields.");
        return;
      }

      // Prepare data to send
      const payload = {
        fullName: this.form.fullName,
        email: this.form.email,
        password: this.form.password,
        roleId: this.form.role || null,
        permissionIds: this.form.selectedPermissions,
      };

      console.log("Submitting user data:", payload);

      // Reset form
      this.form = {
        fullName: '',
        email: '',
        password: '',
        role: '',
        selectedPermissions: [],
      };

      alert("User created successfully!");
      // Redirect or other UI action here
    }
  }
};
</script>
