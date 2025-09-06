<template>
  <div>
    <!-- ✅ Toast Component -->
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto">
        
        <!-- Header -->
        <div class="bg-primary hover:bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center">
          Add New Rent
          <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="submitForm"
          class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
        >
       

           <div>
            <label class="block text-gray-700 mb-1">Property ID</label>
            <input 
              v-model="form.property_id" 
              type="text"
              class="custom-input" 
              @input="searchProperty"
              required />
          </div>

         <div class="mt-2 border rounded bg-white shadow w-full" v-if="pr_length > 0">
  <div
    v-for="property in properties"
    :key="property.id"
    class="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
    @click="selectProperty(property.id)"
  >
    <span>{{ property.name }}</span>

    <!-- Show check icon only for the selected one -->
    <i v-if="form.property_id === property.id" class="fas fa-check text-green-500"></i>
  </div>
</div>


    

           <div>
            <label class="block text-gray-700 mb-1">Tenant </label>
            <input v-model="form.user_id" type="text" class="custom-input" 
              @input="searchUser()"/>
          </div>

           <div class="mt-2 border rounded bg-white shadow w-full" v-if="users.length > 0">
  <div
    v-for="user in users"
    :key="user.id"
    class="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
    @click="selectUser(user.id)"
  >
    <span>{{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}</span>

    <!-- Check icon if selected -->
    <i v-if="form.user_id === user.id" class="fas fa-check text-green-500"></i>
  </div>
</div>



          <div>
        <label class="block text-sm font-medium text-gray-700">Rent Type</label>
        <select
          v-model="form.rent_type"
          class="custom-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="lease">Lease</option>
          <option value="house_rent">House Rent</option>
          <option value="vehicle_rent">Vehicle Rent</option>
          <option value="other">Other</option>
        </select>
      </div>

          <div>
            <label class="block text-gray-700 mb-1">Start Date</label>
            <input v-model="form.start_date" type="date" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">End Date</label>
            <input v-model="form.end_date" type="date" class="custom-input" required />
          </div>

      

          <div>
        <label class="block text-sm font-medium text-gray-700">Payment Cycle</label>
        <select
          v-model="form.payment_cycle"
          class="custom-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
          <option value="quarterly">Quarterly</option>
        </select>
      </div>

          <div>
            <label class="block text-gray-700 mb-1">Rent Amount</label>
            <input v-model="form.rent_amount" type="number" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Deposit Amount</label>
            <input v-model="form.deposit_amount" type="number" class="custom-input" required />
          </div>

        

       <div>
        <label class="block text-sm font-medium text-gray-700">Status</label>
        <select
          v-model="form.status"
          class="custom-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
          <!-- Actions -->
          <div class="md:col-span-2 text-right pt-2">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded border-orange-100 focus:ring-orange-300 shadow"
            >
              Save Rent
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "AddRent",
  components: { Toast },
  props: {
    visible: Boolean,
    propertyId: [String, Number] // passed from parent if adding for specific property
  },
  data() {
    return {
      form: {
        property_id: this.propertyId || "",
        user_id: "",
        rent_type: "",
        start_date: "",
        end_date: "",
        payment_cycle: "",
        rent_amount: "",
        deposit_amount: "",
        status: ""
      },
      properties:[],
      pr_length:0,
      user_length:0,
      users:[],
    };
  },
  methods: {
selectUser(user_id){
this.form.user_id=user_id
console.log("form",this.form);
},
selectProperty(property_id){
this.form.property_id=property_id
console.log("form",this.form);
},
    async searchProperty() {
      const params={
        search:this.form.property_id,
        page_size:100000000,
      }
      console.log("Searching for:", this.form.property_id);
       const res=await this.$apiGet(`get_properties`,params);
       this.properties=res.data
       this.pr_length=res.data.length;
       console.log("res",res);
      
    },

   async searchUser() {
      const params={
        search:this.form.user_id,
        page_size:100000000,
      }
      console.log("Searching for:", this.form.user_id);
       const res=await this.$apiGet(`get_tenants`,params);
       this.users=res.data
       this.user_length=res.data.length;
       console.log("res",res);
      
    },
    async submitForm() {
      try {
        const response = await this.$apiPost("/post_rent", this.form);
        this.$root.$refs.toast.showToast(response.message || "Rent added successfully", "success");

        // Reset form (keep property_id if provided from route)
        this.form = {
          property_id: this.propertyId || "",
          user_id: "",
          rent_type: "",
          start_date: "",
          end_date: "",
          payment_cycle: "",
          rent_amount: "",
          deposit_amount: "",
          status: ""
        };

        // Close modal after short delay
        setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 2000);
      } catch (error) {
        console.error(error);
        alert("Failed to add rent.");
      }
    }
  }
};
</script>
