<template>
  <div>
    <Toast ref="toast"/>
  <div
    v-if="visible"
    class="fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px]  rounded-lg shadow-lg overflow-hidden relative mx-auto">
      <!-- Header -->
      <div class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center">
        Add Permission
        <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="p-6 space-y-4">
        <div>
          <label class="block text-gray-700 mb-1">Content Type</label>
          <input v-model="form.content_type" type="number" class="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text" class="w-full px-4 py-2 border rounded" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Codename</label>
          <input v-model="form.codename" type="text" class="w-full px-4 py-2 border rounded" />
        </div>

        <div class="text-right pt-2">
          <button type="submit" class="bg-primary text-white font-semibold px-6 py-2 rounded shadow">
            Save Permission
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
  name: "AddPermission",
  props: {
    visible: Boolean,
  },
  components:{Toast},
  data() {
    return {
      form: {
        content_type: 20,
        name: '',
        codename: '',
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await this.$apiPost("/post_permission", this.form);
        this.$root.$refs.toast.showToast('Permission saved successfully ', 'success');
        setTimeout(() => {
  this.$emit("close");
}, 3000); // 3000 milliseconds = 3 seconds
      } catch (error) {
        console.error("Error saving permission:", error);
        this.$root.$refs.toast.showToast(error.message,"error")
       // alert("Failed to save permission.");
      }
    },
  },
};
</script>
