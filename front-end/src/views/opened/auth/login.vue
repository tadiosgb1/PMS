<template>
  <Toast ref="toast" />

  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8"
    >
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-400 hover:text-orange-600 text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>

        <!-- Title -->
        <h2 class="text-3xl font-bold text-center mb-6 text-orange-700">
          Login to Alpha Account
        </h2>

        <!-- Form -->
        <form @submit.prevent="login" class="space-y-5">
          <!-- Email -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1" for="email">
              Email Address/Username
            </label>
            <input
              id="email"
              type="email"
              v-model="form.email"
              required
              placeholder="you@example.com or username"
              class="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-gray-700 font-semibold mb-1" for="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              v-model="form.password"
              required
              placeholder="••••••••"
              class="text-black w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
              minlength="2"
            />
            <!-- Forgot Password Link -->
            <div class="text-right mt-1">
              <a
                @click="$emit('close')"
                href="/forgot-password"
                class="text-sm text-orange-600 font-semibold hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </div>

          <!-- Error -->
          <p v-if="error" class="text-red-600 text-sm font-semibold">
            {{ error }}
          </p>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-md transition flex items-center justify-center"
            :disabled="loading"
          >
            <span v-if="!loading">Login</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              Logging in...
            </span>
          </button>
        </form>

        <!-- Register Link -->
        <p class="mt-5 text-center text-sm text-gray-600">
          Don't have an account?
          <a
            @click="$emit('close')"
            href="#plans"
            class="text-orange-700 font-semibold hover:underline ml-1"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "LoginModal",
  components: { Toast },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      error: "",
      loading: false, // Added loading state
    };
  },
  methods: {
    async login() {
      this.error = "";
      this.loading = true; // start loading

      const payload = {
        email: this.form.email,
        password: this.form.password,
      };

      try {
        const response = await this.$apiPost("/token", payload);

        const {
          refresh,
          access,
          permissions,
          id,
          is_superuser,
          email,
          groups,
        } = response;

        localStorage.setItem("refresh", refresh);
        localStorage.setItem("access", access);
        localStorage.setItem("permissions", JSON.stringify(permissions));
        localStorage.setItem("groups", JSON.stringify(groups));
        localStorage.setItem("userId", id);
        localStorage.setItem("is_superuser", is_superuser);
        localStorage.setItem("email", email);

        const user = await this.$apiGetById(`/get_user`, id);
        localStorage.setItem("name", user.first_name);

        this.$refs.toast?.showSuccessToastMessage("Login successful!");
        setTimeout(() => {
          this.$emit("close"); // Close the modal
          this.$router.push({ path: "/dashboard/first-dash" });
        }, 1000);
      } catch (error) {
        console.error("Login error", error);
        this.error =
          error.response?.data?.message ||
          "Login failed. Please check your credentials.";
      } finally {
        this.loading = false; // stop loading
      }
    },
  },
};
</script>
