<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
      <h1 class="text-2xl font-bold text-center mb-6">Reset Password</h1>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Hidden Token -->
        <input type="hidden" :value="token" />

        <!-- New Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            v-model="password"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            v-model="confirmPassword"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <!-- Error message -->
        <p v-if="errorMessage" class="text-red-500 text-sm">{{ errorMessage }}</p>

        <!-- Success message -->
        <p v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</p>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          Change Password
        </button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: ["lang"],
  data() {
    return {
      token: "",
      password: "",
      confirmPassword: "",
      errorMessage: "",
      successMessage: "",
    };
  },
  mounted() {
    // Attempt to get token from query parameter 'token'
    this.token = this.$route.query.token || "";

    // If not present, fallback: take entire query string as token
    if (!this.token) {
      const query = this.$route.fullPath.split("?")[1];
      this.token = query || "";
    }

    console.log("Lang:", this.lang);
    console.log("Token:", this.token);
  },
  methods: {
    async submitForm() {
      this.errorMessage = "";
      this.successMessage = "";

      if (this.password !== this.confirmPassword) {
        this.errorMessage = "Passwords do not match.";
        return;
      }

      if (!this.token) {
        this.errorMessage = "Invalid or missing token.";
        return;
      }

      try {
        const payload= {
          password: this.password,
        }
        // Replace with your API client
        const res = await this.$apiPost(`/reset_password/${this.token}`,payload);

        console.log("res reset",res);
        if (res) {
          alert("reseted successfully")
          this.successMessage = "Password changed successfully!";
          this.password = "";
          this.confirmPassword = "";
        } else {
          this.errorMessage = res.data.message || "Something went wrong.";
        }
      } catch (err) {
        this.errorMessage = "Server error. Please try again.";
        console.error(err);
      }
    },
  },
};
</script>
