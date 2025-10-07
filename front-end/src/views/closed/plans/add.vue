<template>
  <div>
  <!-- ✅ Toast Component -->
    <Toast ref="toast" />


  <div
    v-if="visible"
   class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px]  rounded-lg shadow-lg overflow-hidden relative mx-auto">
      <!-- Header -->
      <div class="bg-primary hover:bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center">
        Add New Plan
        <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
      </div>

      <!-- Form -->
      <form
        @submit.prevent="submitForm"
        class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
      >
        <div>
          <label class="block text-gray-700 mb-1">Name</label>
          <input v-model="form.name" type="text" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Max Locations</label>
          <input v-model="form.max_locations" type="number" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Max Staff</label>
          <input v-model="form.max_staff" type="number" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Max Users</label>
          <input v-model="form.max_users" type="number" class="custom-input" />
        </div>

        <!-- <div>
          <label class="block text-gray-700 mb-1">Max KDS</label>
          <input v-model="form.max_kds" type="number" class="custom-input" />
        </div>

        <div class="flex items-center space-x-3">
  <input
    id="kdsEnabled"
    v-model="form.kds_enabled"
    type="checkbox"
    class="h-5 w-5 rounded border border-orange-100 text-orange-300 focus:ring-orange-300"
  />
  <label for="kdsEnabled" class="block text-gray-700">KDS Enabled</label>
</div>  -->


        <div>
          <label class="block text-gray-700 mb-1">Price</label>
          <input v-model="form.price" type="number" class="custom-input" />
        </div>

        <div>
            <label class="block text-gray-700 mb-1">Billing Cycle</label>
            <select v-model="form.billing_cycle" class="custom-input">
              <option value="" disabled>Select billing cycle</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

        <!-- <div>
          <label class="block text-gray-700 mb-1">Created At</label>
          <input v-model="form.created_at" type="date" class="custom-input" />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Updated At</label>
          <input v-model="form.updated_at" type="date" class="custom-input" />
        </div> -->

        <div class="md:col-span-2 text-right pt-2">
          <button
            type="submit"
            class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded border-orange-100 focus:ring-orange-300 shadow"
          >
            Save Plan
          </button>
        </div>
      </form>
    </div>

    
  </div>
  </div>
</template>


<script>
import Toast from "../../../components/Toast.vue";
export default {
  name: "AddPlan",
  components:{Toast},
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        Plan_zone_id: '',
        owner_id: '',
        manager_id: '',
        Plan_type: '',
        name: '',
        max_locations: '',
        max_staff: '',
        max_users: '',
        max_kds: '27',
        price: null,
        billing_cycle: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      
    };
  },
  methods: {
    async submitForm() {
      console.log("Submitted Plan:", this.form);
      await this.$apiPost("/post_plan", this.form).then(response=>{

        console.log("response.namejh,jkljkllllllllllllllllllllllllllllllllllllllllllllllllllllllllll",response.name);
    

     this.$root.$refs.toast.showToast('Plan saved successfully ', 'success');

      })

      
      // Reset and close modal
      this.form = {
        Plan_zone_id: '',
        owner_id: '',
        manager_id: '',
        Plan_type: '',
        name: '',
        max_locations: '',
        max_staff: '',
        max_users: '',
        max_kds: '',
        kds_enabled: null,
        price: null,
        billing_cycle: null,
        created_at: '',
        updated_at: '',
      };
      //alert("Plan saved!");
     setTimeout(() => {
  this.$emit("close");
}, 3000); // 3000 milliseconds = 3 seconds

    },
  },
};
</script>
