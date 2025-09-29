<template>
  <div>
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[900px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
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
        <form
          @submit.prevent="submitForm"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
        >
          <!-- User Fields -->
          <div>
            <label class="block mb-1 font-medium text-gray-700"
              >First Name</label
            >
            <input
              v-model="form.first_name"
              type="text"
              placeholder="John"
              required
              class="custom-input"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700"
              >Middle Name</label
            >
            <input
              v-model="form.middle_name"
              type="text"
              placeholder="Michael"
              class="custom-input"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700"
              >Last Name</label
            >
            <input
              v-model="form.last_name"
              type="text"
              placeholder="Doe"
              required
              class="custom-input"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              required
              class="custom-input"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700"
              >Phone Number</label
            >
            <input
              v-model="form.phone_number"
              type="text"
              placeholder="+251912345678"
              class="custom-input"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              required
              class="custom-input"
            />
          </div>

          <!-- Broker Fields -->
          <div>
            <label class="block mb-1 font-medium text-gray-700"
              >License Number</label
            >
            <input
              v-model="form.license_number"
              type="text"
              placeholder="Enter license number"
              required
              class="custom-input"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700"
              >Commission Rate</label
            >
            <input
              v-model="form.commission_rate"
              type="text"
              placeholder="Enter commission rate"
              required
              class="custom-input"
            />
          </div>
          <div>
            <label class="block mb-1 font-medium text-gray-700">Wallet</label>
            <input
              v-model="form.wallet"
              type="text"
              placeholder="Enter wallet ID or address"
              required
              class="custom-input"
            />
          </div>

          <!-- Flags -->
          <div class="md:col-span-2 flex space-x-4">
            <label class="flex items-center"
              ><input type="checkbox" v-model="form.is_active" class="mr-2" />
              Active</label
            >
          </div>

          <!-- Actions -->
          <div class="md:col-span-2 text-right pt-4">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200"
            >
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
  name: "AddUserBrokerModal",
  components: { Toast },
  props: { visible: Boolean },
  data() {
    return {
      form: {
        // User
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        password: "",
        is_active: true,
        is_staff: false,
        is_superuser: false,
        // Broker
        license_number: "",
        commission_rate: "",
        wallet: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        // 1️⃣ Create User
        const userPayload = {
          first_name: this.form.first_name,
          middle_name: this.form.middle_name,
          last_name: this.form.last_name,
          email: this.form.email,
          phone_number: this.form.phone_number,
          password: this.form.password,
          is_active: this.form.is_active,
          is_staff: this.form.is_staff,
          is_superuser: this.form.is_superuser,
        };
        const userResponse = await this.$apiPost("/post_user", userPayload);
        console.log("userResponse", userResponse);

        const userId = userResponse.id; // make sure your API returns user ID

        // 2️⃣ Create Broker with User ID
        const brokerPayload = {
          license_number: this.form.license_number,
          commission_rate: this.form.commission_rate,
          wallet: this.form.wallet,
          user: userId,
        };
        await this.$apiPost("/post_broker_profile", brokerPayload);

        this.$root.$refs.toast.showToast(
          "Broker added successfully",
          "success"
        );
        setTimeout(() => {
          this.$emit("close");
          this.$emit("success"); // refresh parent
        }, 1500);
      } catch (error) {
        console.error("Error creating user/broker", error);
        this.$root.$refs.toast.showToast(
          "Failed to create user or broker",
          "error"
        );
      }
    },
  },
};
</script>
