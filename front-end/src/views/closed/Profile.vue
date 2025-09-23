<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
  >
    <div
      class="bg-white rounded-lg shadow-lg w-full max-w-md max-h-full overflow-y-auto p-6 relative"
    >
      <!-- Close button -->
      <button
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        @click="$emit('close')"
      >
        <i class="fas fa-times"></i>
      </button>

      <h2 class="text-xl font-bold text-blue-500 mb-4">Update Profile</h2>

      <form @submit.prevent="updateProfile">
        <div class="space-y-3">
          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700">First Name</label>
            <input
              v-model="form.first_name"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>

          <!-- Middle Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Middle Name</label>
            <input
              v-model="form.middle_name"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              v-model="form.last_name"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>

          <!-- Phone Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              v-model="form.phone_number"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>

          <!-- Address -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Address</label>
            <input
              v-model="form.address"
              type="text"
              class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-yellow-400"
            />
          </div>
        </div>

        <div class="flex justify-end mt-5 space-x-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Profile",
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      form: {
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
      },
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.loadProfile();
      }
    },
  },
  methods: {
    async loadProfile() {
      try {
        const id = localStorage.getItem("userId");
        const res = await this.$apiGet(`/get_user/${id}`);
        //this.form = res;
        this.form.email=res.email;
        this.form.first_name=res.first_name;
        this.form.last_name=res.last_name;
        this.form.middle_name=res.middle_name;
        this.form.phone_number=res.phone_number;
        this.form.address=res.address;

        

      } catch (err) {
        console.error("Failed to fetch user", err);
      }
    },
    async updateProfile() {
      try {
        const id = localStorage.getItem("userId");

        console.log("this form",this.form);

        await this.$apiPatch(`/old_update_user`, id, this.form);
        this.$emit("updated", this.form);
        this.$emit("close");
        this.$toast?.success("Profile updated successfully");
      } catch (err) {
        console.error("Update failed", err);
        this.$toast?.error("Failed to update profile");
      }
    },
  },
};
</script>
