<template>
  <div
    v-if="visible"
    class="fixed inset-0 w-full z-10 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white max-w-2xl w-full rounded-lg shadow-lg overflow-hidden relative">
      <div class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center">
        Add New Group
        <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 grid grid-cols-1 gap-6 max-h-[80vh] overflow-y-auto">
        <!-- Name -->
        <div>
          <label class="block text-gray-700">Group Name</label>
          <input v-model="form.name" type="text" class="w-full px-4 py-2 border rounded" required />
        </div>

        <!-- Permissions -->
        <div>
          <label class="block text-gray-700 mb-1">Select Permissions</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded p-2">
            <label v-for="perm in availablePermissions" :key="perm" class="flex items-center space-x-2">
              <input
                type="checkbox"
                :value="perm.codename"
                v-model="form.permissions"
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">{{ perm.name }}</span>
            </label>
          </div>
        </div>

        <!-- Submit -->
        <div class="text-right">
          <button
            type="submit"
            class="bg-primary hover:bg-primary text-white font-semibold px-6 py-3 rounded shadow"
          >
            Save Group
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddGroup",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        name: '',
        permissions: []
      },
      availablePermissions: []
    };
  },
  mounted() {
    this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
 const params={
        page_size:1000
      }

      try {
        const response = await this.$apiGet("/get_permissions",params);

        console.log("response permissions",response.data);

        this.availablePermissions = response.data || [];

        
      } catch (err) {
        console.error("Failed to fetch permissions:", err);
        this.availablePermissions = [];
      }
    },
    async submitForm() {
      try {
        const payload = {
          name: this.form.name,
          permissions: this.form.permissions        };



        console.log("permissions raw:", this.form.permissions);
        console.log("permissions type:", typeof this.form.permissions);
        console.log("Array.isArray:", Array.isArray(this.form.permissions));
        console.log("Converted:", Array.from(this.form.permissions));


        console.log("payload",payload);

        const response = await this.$apiPost("/post_group", payload);
        console.log("Group created:", response);
        alert("Group saved!");
        this.$emit("close");
      } catch (err) {
        console.error("Failed to create group:", err);
        alert("Failed to save group.");
      } finally {
        this.form.name = '';
        this.form.permissions = [];
      }
    }
  }
};
</script>
