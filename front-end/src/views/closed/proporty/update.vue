<template>
  <div>
    <Toast ref="toast"/>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px]  rounded-lg shadow-lg overflow-hidden relative mx-auto">
      <div class="bg-primary to-indigo-900 text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center">
        Update Property
        <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
      </div>

      <form @submit.prevent="submitForm" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
       
       <!-- <div>
          <label class="block text-gray-700">Owner ID</label>
          <input v-model="form.owner_id" type="text" class="custom-input" />
        </div> -->

        <div>
            <label class="block text-gray-700">Property Zone</label>
            <select v-model="form.property_zone_id" class="custom-input">
              <option value="">Select Zone</option>
              <option v-for="zone in zones" :key="zone.id" :value="zone.id">
                {{ zone.name }}
              </option>
            </select>
          </div>
        
        <!-- <div>
          <label class="block text-gray-700">Manager ID</label>
          <input v-model="form.manager_id" type="text" class="custom-input" />
        </div> -->
        <div>
            <label class="block text-gray-700">Property manager</label>
            <select v-model="form.manager_id" class="custom-input">
              <option value="">Select Manager</option>
              <option
                class="text-black"
                v-for="manager in managers"
                :key="manager.manager.id"
                :value="manager.manager.id"
              >
                {{ manager.manager.first_name }}
                {{ manager.manager.middle_name }}
              </option>
            </select>
          </div>
       
        <div>
          <label class="block text-gray-700">Name</label>
          <input v-model="form.name" type="text" class="custom-input" required />
        </div>

        
 <div>
        <label class="block text-gray-700">Property type</label>
        <select
          v-model="form.property_type"
          class="custom-input"
        >
        <option value="">Select property type</option>
          <option value="land">Land</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="room">Room</option>
        </select>
      </div>

        <div>
          <label class="block text-gray-700">Address</label>
          <input v-model="form.address" type="text" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700">City</label>
          <input v-model="form.city" type="text" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700">State</label>
          <input v-model="form.state" type="text" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700">ZIP Code</label>
          <input v-model="form.zip_code" type="text" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700">Selling Price</label>
          <input v-model.number="form.price" type="number" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700">Bedrooms</label>
          <input v-model.number="form.bed_rooms" type="number" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700">Bathrooms</label>
          <input v-model.number="form.bath_rooms" type="number" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700">Rent Price</label>
          <input v-model.number="form.rent" type="number" class="custom-input" />
        </div>

        <!-- <div>
          <label class="block text-gray-700">Status</label>
          <select v-model="form.status" class="custom-input">
            <option value="">Select</option>
            <option value="available">Available</option>
            <option value="rented">Rented</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div> -->

        <div class="md:col-span-2 text-right">
          <button
            type="button"
            @click="updateModalVisible = true"
            class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded shadow"
          >
            Update
          </button>
        </div>
      </form>
    </div>
    <ConfirmModal
        :visible="updateModalVisible"
        title="Update Property"
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
  name: 'UpdateProperty',
  components:{Toast,ConfirmModal},
  props: {
    visible: Boolean,
    property: Object
  },
  data() {
    return {

      zones: [],
      managers: [],
      updateModalVisible:false,
      form: {
        id: null,
        name: '',
        property_type: '',
        property_zone_id:'',
        manager_id: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        price: '',
        bed_rooms: '',
        bath_rooms: '',
        rent: '',
        
      }
    };
  },
  watch: {
    property: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.form = { ...newValue };
        }
      }
    }
  },
  async mounted() {

    if (localStorage.getItem("is_superuser") == true) {
      const res = await this.$apiGet(`/get_managers`);
      console.log("res managers", res);
      this.managers = res.data || [];
    } else {
      console.log("managers for the owner");
      const params = {
        owner__id: localStorage.getItem("userId"),
      };
      console.log("params", params);

      const res = await this.$apiGet(`/get_owner_managers`, params);
      console.log("res managers", res);
      this.managers = res.data || [];
    }
 const result = await this.$getZones();
    this.zones = result.zones;

    console.log("zones", this.zones);
  },
  methods: {
    async submitForm() {
      this.updateModalVisible=false
      try {
        const res = await this.$apiPut('/update_property', this.form.id, this.form);
       if(res & res.error){
         this.$root.$refs.toast.showToast(res.error || 'Failed to update property ', 'error');
       }else{
        this.$root.$refs.toast.showToast('Property Updated successfully ', 'success');
        this.$emit('refresh');
         this.$emit("close");
         
       }
//           setTimeout(() => {
//   this.$emit("close");
// }, 3000); // 3000 milliseconds = 3 seconds
      } catch (err) {
        this.$root.$refs.toast.showToast( 'Failed to update property ', 'error');
      }
    }
  }
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500;
}
</style>
