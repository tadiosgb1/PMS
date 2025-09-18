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
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="submitForm"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
        >
          <!-- License Number -->
          <div>
            <label class="block text-gray-700 mb-1">License Number</label>
            <input
              v-model="form.license_number"
              type="text"
              class="custom-input"
              placeholder="Enter license number"
              required
            />
          </div>

          <!-- Commission Rate -->
          <div>
            <label class="block text-gray-700 mb-1">Commission Rate</label>
            <input
              v-model="form.commission_rate"
              type="text"
              class="custom-input"
              placeholder="Enter commission rate"
              required
            />
          </div>

          <!-- Wallet -->
          <div>
            <label class="block text-gray-700 mb-1">Wallet</label>
            <input
              v-model="form.wallet"
              type="text"
              class="custom-input"
              placeholder="Enter wallet ID or address"
              required
            />
          </div>

          <!-- User Search -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">User</label>
            <input
              v-model="userQuery"
              @input="searchUsers"
              type="text"
              class="custom-input"
              placeholder="Search user by name or email"
              autocomplete="off"
            />
            <!-- Dropdown results -->
            <ul
              v-if="userResults.length > 0"
              class="absolute bg-white border rounded w-full max-h-40 overflow-auto z-50 mt-1"
            >
              <li
                v-for="user in userResults"
                :key="user.id"
                @click="selectUser(user)"
                class="px-4 py-2 hover:bg-gray-200 cursor-pointer"
              >
                {{ user.first_name }} ({{ user.email }})
              </li>
            </ul>
          </div>

          <!-- Hidden User ID -->
          <input type="hidden" v-model="form.user" />

          <!-- Actions -->
          <div class="md:col-span-2 text-right pt-4">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow transition-all duration-200"
              :disabled="!form.user"
            >
              Save Broker
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
  },
  data() {
    return {
      form: {
        license_number: "",
        commission_rate: "",
        wallet: "",
        user: null,
      },
      userQuery: "",
      userResults: [],
      searchTimeout: null,
    };
  },
  methods: {
    async searchUsers() {
      if (this.searchTimeout) clearTimeout(this.searchTimeout);

      this.searchTimeout = setTimeout(async () => {
        if (this.userQuery.trim() === "") {
          this.userResults = [];
          return;
        }
        try {
          const response = await this.$apiGet(`/get_users?search=${this.userQuery}`);
          console.log("response for search",response)
          this.userResults = response.data || [];
        } catch (error) {
          console.error("User search failed", error);
          this.userResults = [];
        }
      }, 300); // debounce 300ms
    },
    selectUser(user) {
      this.form.user = user.id;
      this.userQuery = `${user.first_name} (${user.email})`;
      this.userResults = [];
    },
    async submitForm() {
      if (!this.form.user) {
        this.$refs.toast.showToast("Please select a user", "error");
        return;
      }
      try {
        const response = await this.$apiPost("/post_broker_profile", this.form);
        this.$root.$refs.toast.showToast(
          response.message || "Broker added successfully",
          "success"
        );
        setTimeout(() => {
          this.$emit("close");
          this.$emit("success"); // refresh parent list
        }, 1500);
      } catch (error) {
        console.error("error is",error);
        this.$root.$refs.toast.showToast
            ("falied to add broker", "error");
      }
    },
  },
};
</script>
