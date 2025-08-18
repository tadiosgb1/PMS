<template>
  <div>
  <div v-if="visible" class="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-auto">
    <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px]  rounded-lg shadow-lg overflow-hidden relative mx-auto">
      <div class="bg-primary text-white px-6 py-4 flex justify-between items-center text-xl font-semibold">
        Add Property Zone
        <button @click="$emit('close')" class="text-white font-bold">✕</button>
      </div>
      <form @submit.prevent="submitForm" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label class="block text-gray-700">Name</label><input v-model="form.name" class="custom-input" /></div>
        <div><label class="block text-gray-700">Address</label><input v-model="form.address" class="custom-input" /></div>
        <div><label class="block text-gray-700">City</label><input v-model="form.city" class="custom-input" /></div>
        <div><label class="block text-gray-700">State</label><input v-model="form.state" class="custom-input" /></div>
        <div><label class="block text-gray-700">Owner ID</label><input v-model="form.owner_id" type="number" class="custom-input" /></div>
        <div><label class="block text-gray-700">Manager ID</label><input v-model="form.manager_id" type="number" class="custom-input" /></div>
        <div class="md:col-span-2 text-right">
          <button type="submit" class="bg-primary hover:bg-primary text-white px-6 py-2 rounded">Save</button>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
export default {
  props: { visible: Boolean },
  components:{Toast},
  data() {
    return {
      form: {
        owner_id:localStorage.getItem('userId'),
        name: '',
        address: '',
        city: '',
        state: '',
        manager_id: null
      }
    };
  },
  methods: {
    async submitForm() {

      console.log("Payload zone",this.form);

      try {
        await this.$apiPost("post_property_zone", this.form);
        this.$root.$refs.toast.showToast('Property saved successfully ', 'success');
        setTimeout(() => {
  this.$emit("close");
}, 3000); // 3000 milliseconds = 3 seconds
        this.$emit("refresh");
      } catch (err) {
        console.error("Failed to add zone:", err);
        alert("Failed to add zone");
      }
    }
  }
};
</script>
