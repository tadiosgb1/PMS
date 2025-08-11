<template>
  <div>
    <Toast ref="toast"/>
  <div
    v-if="visible"
    class="fixed inset-0 w-full z-10 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px]  rounded-lg shadow-lg overflow-hidden relative mx-auto">
      <div class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center">
        Edit Permission
        <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
        <div>
          <label class="block text-gray-700">Content Type</label>
          <input v-model="form.content_type" type="number" class="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label class="block text-gray-700">Name</label>
          <input v-model="form.name" type="text" class="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label class="block text-gray-700">Codename</label>
          <input v-model="form.codename" type="text" class="w-full px-4 py-2 border rounded" />
        </div>

        <div class="text-right">
          <button
            type="submit"
            class="bg-primary hover:bg-primary text-white font-semibold px-6 py-2 rounded shadow"
          >
            Update Permission
          </button>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';

export default {
  name: "UpdatePermission",
  props: {
    visible: Boolean,
    permission: Object,
  },
  data() {
    return {
      form: {
        id: null,
        content_type: 20,
        name: '',
        codename: '',
      },
    };
  },
  watch: {
    permission: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = { ...newVal }; // clone to avoid direct mutation
        }
      }
    }
  },
  methods: {
    async submitForm() {
      try {
        await this.$apiPut("/update_permission", this.form.id, this.form);
        this.$root.$refs.toast.showToast('Permission Updated successfully ', 'success');
       setTimeout(() => {
  this.$emit("close");
}, 3000); // 3000 milliseconds = 3 seconds
        this.$emit("refresh");
      } catch (error) {
        console.error("Error updating permission:", error);
        alert("Failed to update permission.");
      }
    }
  }
};
</script>
