<template>
  <div
    class="relative min-h-screen bg-gray-200"
    
  >
    <!-- Top Header -->
    <div
      class="absolute top-0 left-0 w-full flex justify-between items-center px-6 py-4"
    >
      <!-- Logo -->
      <!-- <div class="flex items-center space-x-2 text-white text-2xl font-bold">
        <img src="" alt="Logo" class="h-16 w-auto rounded-full" />
      </div> -->

      <!-- Language Dropdown -->
      <!-- <div>
        <select
          v-model="selectedLanguage"
          @change="changeLanguage"
          class="px-2 py-1 rounded border text-sm"
        >
          <option value="" selected>lan</option>
          <option value="en">English</option>
          <option value="am">Amharic</option>
          <option value="ti">Tigrigna</option>
        </select>
      </div> -->
    </div>

    <!-- Centered Form -->
    <div v-if="showForm" class="flex justify-center items-center min-h-screen">
      <Toast ref="toast" />
      <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">
          Forgot Password
        </h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label
              for="email"
              class="block text-sm font-semibold text-gray-700 mb-2"
              >Email Address</label
            >
            <input
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="Enter your email"
              class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
            />
          </div>
          <div class="flex items-center justify-between mb-4">
            <button
              type="submit"
              class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <i class="fas fa-envelope mr-2"></i> Send Reset Link
            </button>
          </div>
          <div
            v-if="message"
            :class="messageType"
            class="text-center text-sm mt-4"
          >
            <p>{{ message }}</p>
          </div>
        </form>
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Remember your password?
            <router-link
              to="/"
              class="text-indigo-600 hover:text-indigo-800"
              >Back to Home</router-link
            >
          </p>
        </div>
      </div>
    </div>

    <!-- Centered Reset Info Message -->
    <div
      v-if="showRestInfo"
      class="flex justify-center items-center min-h-screen px-4"
    >
      <div
        class="max-w-xl w-full p-6 bg-white border-l-4 border-primary shadow-md rounded-md"
      >
        <div class="flex items-start space-x-4">
          <div class="text-primary text-2xl mt-1">
            <i class="fas fa-envelope-open-text"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-800 mb-1">
              Reset Link Sent
            </h3>
            <p class="text-sm text-gray-600">
              We've sent a secure password reset link to your email address.
              Please check your
              <span class="text-blue-600 font-bold">inbox </span>and follow the
              instructions to securely update your password. If you don’t see
              the email, check your
              <span class="text-pink-400 font-bold">spam or junk</span> folder.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";


export default {
  components: {
    Toast,
  },
  data() {
    return {
      showForm: true,
      showRestInfo: false,
      email: "",
      message: "",
      messageType: "text-green-600",
      selectedLanguage: "",
    };
  },
  methods: {
    async submitForm() {
      this.showForm = true;
      this.showRestInfo = false;

      const payload = {
        email: this.email,
      };

      this.$apiPost("/send_password_reset_email", payload)
        .then((response) => {
          this.showForm = false;
          this.showRestInfo = true;
          this.$refs.toast.showSuccessToastMessage(response.message);
        })
        .catch((error) => {
          this.message =
            error.response?.data.message || "Something went wrong!";
          this.messageType = "text-red-600";
        });
    },
    changeLanguage() {
      // Language change logic if needed
    },
  },
};
</script>

<style scoped>
/* Additional styles if needed */
</style>
