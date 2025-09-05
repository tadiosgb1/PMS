<template>
  <div
    v-if="visible"
   class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white  w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px]  rounded-lg shadow-lg overflow-hidden relative mx-auto">
      <!-- Close Button -->
      <div class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center">
        Add New Staff
        <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4 px-4 py-4">
        <!-- Row 1: Email & Phone -->

          <!-- Property Zone -->
        <div>
          <label class="block text-sm font-medium mb-1">Property Zone</label>
          <select
            v-model="form.property_zone"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Select Zone</option>
            <option
              v-for="zone in zones"
              :key="zone.id"
              :value="zone.id"
            >
              {{ zone.name }}
            </option>
          </select>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Phone Number</label>
            <input
              v-model="form.phone_number"
              type="tel"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Row 2: First & Last Name -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">First Name</label>
            <input
              v-model="form.first_name"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Last Name</label>
            <input
              v-model="form.last_name"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Middle Name -->
        <div>
          <label class="block text-sm font-medium mb-1">Middle Name</label>
          <input
            v-model="form.middle_name"
            type="text"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Address -->
        <div>
          <label class="block text-sm font-medium mb-1">Address</label>
          <textarea
            v-model="form.address"
            rows="2"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

          <div>
          <label class="block text-sm font-medium mb-1">Password</label>
          <input
            v-model="form.password"
            type="password"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          />
        </div>
      

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
          <button
            type="submit"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Save Manager
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddManagerModal",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      managerVisible: false,
      zones:[],
      form: {
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        property_zone: "",
        owner_id:localStorage.getItem('userId'),
        password: "",
      }
    };
  },
 async  mounted(){
  const result = await this.$getZones();
  this.zones=result.zones;
  console.log("zones",this.zones);
  },
  methods: {
   
    close() {
      this.resetForm();
      this.managerVisible = false;
    },
    async submitForm() {
      console.log("this.form",this.form)
      const res = await this.$apiPost('/create_staff',this.form);

      console.log("res manager add",res);

      this.resetForm();
      this.close();
    },
    resetForm() {
      this.form = {
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        owner_id:localStorage.getItem('userId'),
        property_zone: "",
        password: "",
      };
    }
  }
};
</script>
