<template>
  <div
    v-if="managerVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white w-full max-w-3xl rounded-lg shadow-lg p-6 relative">
      <!-- Close Button -->
      <button
        @click="close"
        class="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
      >
        ✕
      </button>

      <!-- Modal Header -->
      <h2 class="text-xl font-semibold mb-4 border-b pb-2">
        Add New Manager
      </h2>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Row 1: Email & Phone -->
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

        <!-- Property Zone -->
        <div>
          <label class="block text-sm font-medium mb-1">Property Zone</label>
          <select
            v-model="form.property_zone"
            required
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          >
            <option disabled value="">Select Zone</option>
            <option
              v-for="zone in propertyZones"
              :key="zone.id"
              :value="zone.id"
            >
              {{ zone.name }}
            </option>
          </select>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
          <button
            type="button"
            @click="close"
            class="px-4 py-2 border rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
  data() {
    return {
      managerVisible: false,
      propertyZones: [
        { id: 101, name: "Zone 1" },
        { id: 102, name: "Zone 2" }
      ],
      form: {
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        property_zone: ""
      }
    };
  },
  mounted() {
    this.managerVisible = true;
  },
  methods: {
    close() {
      this.resetForm();
      this.managerVisible = false;
    },
    submitForm() {
      console.log("Form submitted:", this.form);
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
        property_zone: ""
      };
    }
  }
};
</script>
