<template>
  <div>
    <Toast ref="toast"/>
  <div v-if="visible" class="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-auto">
    <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px]  rounded-lg shadow-lg overflow-hidden relative mx-auto">
      <div class="bg-primary text-white px-6 py-4 flex justify-between items-center text-xl font-semibold">
        Edit Property Zone
        <button @click="$emit('close')" class="text-white font-bold">✕</button>
      </div>
      <form @submit.prevent="submitForm" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label class="block text-gray-700">Name</label><input v-model="form.name" class="custom-input" /></div>
        <div><label class="block text-gray-700">Address</label><input v-model="form.address" class="custom-input" /></div>
        <div><label class="block text-gray-700">City</label><input v-model="form.city" class="custom-input" /></div>
        <div><label class="block text-gray-700">State</label><input v-model="form.state" class="custom-input" /></div>
        <div><label class="block text-gray-700">Manager ID</label><input v-model="form.manager_id" type="number" class="custom-input" /></div>
        <div class="md:col-span-2 text-right">
          <button 
            type="button"
            @click="updateModalVisible = true"
           class="bg-primary hover:bg-orange-600 text-white px-6 py-2 rounded">Update</button>
        </div>
      </form>
    </div>

     <ConfirmModal
        :visible="updateModalVisible"
        title="Update Property Zone"
        :message="`Are you sure you want to update '${form?.name}'?`"
        @cancel="updateModalVisible = false"
        @confirm="submitForm"
      />
  </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  props: {
    visible: Boolean,
    zone: Object
  },
  components:{Toast,ConfirmModal},
  data() {
    return {
      form: {
        id: null,
        name: '',
        address: '',
        city: '',
        state: '',
        owner_id: null,
        manager_id: null
      },
      updateModalVisible:false
    };
  },
  watch: {
    zone: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = { ...val };
        }
      }
    }
  },
  methods: {
    async submitForm() {
      this.updateModalVisible=false
      try {
        const response= await this.$apiPut("/update_property_zone", this.form.id, this.form);
        
       if(response && response.error){
       this.$root.$refs.toast.showToast(response.error || "Failed to update property zone", "error");
        }else {
        this.$root.$refs.toast.showToast('Property zone updated successfully ', 'success');
        this.$emit('refresh')
        this.$emit('close')
        }
        
      } catch (err) {
        console.error("Failed to update property zone:", err);
         this.$root.$refs.toast.showToast("Failed to update property zone", "error");
      }
    }
  }
};
</script>
