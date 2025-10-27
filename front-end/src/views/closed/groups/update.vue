<template>
    <div>
    <Toast ref="toast"/>
  <div
    v-if="visible"
    class="fixed inset-0 w-full z-10 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white max-w-2xl w-full rounded-lg shadow-lg overflow-hidden relative">
      <div class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center">
        Update Group
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
            <label v-for="perm in availablePermissions" :key="perm.codename" class="flex items-center space-x-2">
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
           type="button"
            @click="updateModalVisible = true"
            class="bg-primary hover:bg-primary text-white font-semibold px-6 py-3 rounded shadow"
          >
            Update Group
          </button>
        </div>
      </form>
    </div>

     <ConfirmModal
        :visible="updateModalVisible"
        title="Update Group"
        :message="`Are you sure you want to update '${form?.name}'?`"
        @cancel="updateModalVisible = false"
        @confirm="submitForm"
      />
  </div>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  name: 'UpdateGroup',
  components: { Toast,ConfirmModal },
  props: {
    visible: Boolean,
    groupData: Object
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        permissions: []
      },
      availablePermissions: [],
      updateModalVisible:false
    };
  },
  watch: {
    groupData: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.id = newVal.id;
          this.form.name = newVal.name;
          this.form.permissions = [...newVal.permissions];
        }
      }
    }
  },
  mounted() {
    this.fetchPermissions();
  },
  methods: {
    async fetchPermissions() {
      try {
        const response = await this.$apiGet('/get_permissions', { page_size: 1000 });
        this.availablePermissions = response.data || [];
      } catch (err) {
        console.error('Failed to fetch permissions:', err);
        this.availablePermissions = [];
      }
    },
    async submitForm() {
      this.updateModalVisible=false
      try {
        const payload = {
          name: this.form.name,
          permissions: this.form.permissions
        };
        await this.$apiPut(`/update_group`, this.form.id, payload);
        this.$root.$refs.toast.showToast('Group updated successfully', 'success');
        this.$emit('updated');
        this.$emit('close');
      } catch (err) {
        console.error(err);
        //alert('Failed to update group. Please try again.');
         this.$root.$refs.toast.showToast(err.message,"error")
      }
    }
  }
};
</script>
