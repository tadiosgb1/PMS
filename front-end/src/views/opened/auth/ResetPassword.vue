<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="w-full max-w-md p-8 bg-white rounded shadow">
      <h2 class="text-2xl font-bold mb-6 text-center">Reset Password</h2>

      <form @submit.prevent="submit">
        <input
          v-model="password"
          type="password"
          placeholder="New password"
          class="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          class="w-full mb-4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Reset Password
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ["token"],
  data() {
    return {
      password: "",
      confirmPassword: "",
    };
  },
  computed: {
    decodedToken() {
      return decodeURIComponent(this.token);
    },
  },
  methods: {
    async submit() {
      if (!this.password || !this.confirmPassword) {
        alert("Please enter both fields");
        return;
      }
      if (this.password !== this.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      try {
        // Call your backend reset_password endpoint with the decoded token
        await axios.post(
          `http://localhost:3000/api/reset_password/${this.decodedToken}`,
          {
            password: this.password,
          }
        );
        alert("Password reset successful");
        // Optional: redirect to login page
        this.$router.push("/en/login");
      } catch (err) {
        console.error(err);
        alert("Error resetting password");
      }
    },
  },
};
</script>

<style scoped>
/* Optional Tailwind custom styles if needed */
</style>
