<template>
  <div>
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
        >
          Add New Broker
          <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">
            ✕
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitUser" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto">
          <!-- User Fields -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block mb-1 font-medium text-gray-700">First Name</label>
              <input v-model="userForm.first_name" type="text" required placeholder="John"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label class="block mb-1 font-medium text-gray-700">Middle Name</label>
              <input v-model="userForm.middle_name" type="text" placeholder="Michael"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label class="block mb-1 font-medium text-gray-700">Last Name</label>
              <input v-model="userForm.last_name" type="text" required placeholder="Doe"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <!-- Row 2 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 font-medium text-gray-700">Email</label>
              <input v-model="userForm.email" type="email" required placeholder="john@example.com"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label class="block mb-1 font-medium text-gray-700">Phone Number</label>
              <input v-model="userForm.phone_number" type="text" placeholder="+251912345678"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <!-- Row 3 -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block mb-1 font-medium text-gray-700">Password</label>
              <input v-model="userForm.password" type="password" required placeholder="••••••••"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label class="block mb-1 font-medium text-gray-700">Address</label>
              <input v-model="userForm.address" type="text" placeholder="Addis Ababa, Ethiopia"
                class="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <div class="md:col-span-2 text-right pt-4">
            <button type="submit" class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200">
              Create User
            </button>
          </div>
        </form>

        <!-- Broker Form (User ID is given) -->
        <form @submit.prevent="submitBroker" class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto mt-6">
          <div>
            <label class="block text-gray-700 mb-1">License Number</label>
            <input v-model="brokerForm.license_number" type="text" class="custom-input" placeholder="Enter license number" required />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Commission Rate</label>
            <input v-model="brokerForm.commission_rate" type="text" class="custom-input" placeholder="Enter commission rate" required />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Wallet</label>
            <input v-model="brokerForm.wallet" type="text" class="custom-input" placeholder="Enter wallet ID or address" required />
          </div>

          <!-- Hidden User ID from backend -->
          <input type="hidden" v-model="brokerForm.user" />

          <div class="md:col-span-2 text-right pt-4">
            <button type="submit" class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200">
              Create Broker
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
  name: "AddBroker",
  components: { Toast },
  props: {
    visible: Boolean,
    userId: Number, // user ID provided from backend
  },
  data() {
    return {
      userForm: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        address: "",
      },
      brokerForm: {
        license_number: "",
        commission_rate: "",
        wallet: "",
        user: this.userId || null, // prefill from backend
      },
    };
  },
  methods: {
    async submitUser() {
      try {
        const response = await this.$apiPost("/post_user", this.userForm);

        
        console.log("response",response);


        this.$refs.toast.showToast(response.message || "User created successfully", "success");
        // Get user ID from backend response
        if (response.data && response.data.id) {
          this.brokerForm.user = response.data.id;
        }
      } catch (error) {
        console.error(error);
        this.$refs.toast.showToast("Failed to create user", "error");
      }
    },
    async submitBroker() {
      if (!this.brokerForm.user) {
        this.$refs.toast.showToast("User ID is required for broker", "error");
        return;
      }
      try {
        const response = await this.$apiPost("/post_broker_profile", this.brokerForm);
        this.$refs.toast.showToast(response.message || "Broker added successfully", "success");
        setTimeout(() => this.$emit("close"), 1500);
      } catch (error) {
        console.error(error);
        this.$refs.toast.showToast("Failed to create broker", "error");
      }
    },
  },
};
</script>
