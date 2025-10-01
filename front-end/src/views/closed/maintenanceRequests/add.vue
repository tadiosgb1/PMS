<template> 
  <div>
    <!-- ✅ Toast Component -->
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
          class="bg-primary hover:bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
        >
          Add Maintenance Request
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
          class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
        >
          <!-- Description -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 mb-1">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="custom-input"
              placeholder="Enter maintenance request description"
            ></textarea>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="custom-input">
              <option value="" disabled>Select status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <!-- Requested At -->
          <div>
            <label class="block text-gray-700 mb-1">Requested At</label>
            <input v-model="form.requested_at" type="date" class="custom-input" />
          </div>

          <!-- Resolved At -->
          <div>
            <label class="block text-gray-700 mb-1">Resolved At</label>
            <input v-model="form.resolved_at" type="date" class="custom-input" />
          </div>

          <!-- Property Dropdown -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Property</label>
            <input 
              v-model="propertySearch"
              type="text"
              class="custom-input"
              placeholder="Search property"
              @input="searchProperty"
              @focus="propertyDropdownOpen = true"
              @blur="closePropertyDropdown"
              autocomplete="off"
              required
            />

            <!-- Dropdown -->
            <ul 
              v-if="propertyDropdownOpen && filteredProperties.length > 0"
              class="absolute z-50 bg-white border rounded shadow w-full max-h-40 overflow-y-auto mt-1"
            >
              <li 
                v-for="property in filteredProperties" 
                :key="property.id"
                class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                @mousedown.prevent="selectProperty(property)"
              >
                <span>{{ property.name }}</span>
                <i v-if="form.property_id === property.id" class="fas fa-check text-green-500"></i>
              </li>
            </ul>
          </div>

          <!-- Requester Dropdown -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Requester</label>
            <input
              v-model="userSearch"
              type="text"
              class="custom-input"
              placeholder="Search user"
              @input="searchUser"
              @focus="userDropdownOpen = true"
              @blur="closeUserDropdown"
              autocomplete="off"
              required
            />

            <!-- Dropdown -->
            <ul
              v-if="userDropdownOpen && filteredUsers.length > 0"
              class="absolute z-50 bg-white border rounded shadow w-full max-h-40 overflow-y-auto mt-1"
            >
              <li
                v-for="user in filteredUsers"
                :key="user.id"
                class="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                @mousedown.prevent="selectUser(user)"
              >
                <span>{{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}</span>
                <i v-if="form.user_id === user.id" class="fas fa-check text-green-500"></i>
              </li>
            </ul>
          </div>

          <!-- Submit -->
          <div class="md:col-span-2 text-right pt-2">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded border-orange-100 focus:ring-orange-300 shadow"
            >
              Save Request
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "MaintenanceRequestAdd",
  components: { Toast },
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        status: "",
        description: "",
        requested_at: "",
        resolved_at: "",
        user_id: "",
        property_id: "",
      },
      propertySearch: "",
      userSearch: "",
      properties: [],
      users: [],
      filteredProperties: [],
      filteredUsers: [],
      propertyDropdownOpen: false,
      userDropdownOpen: false,
    };
  },
  methods: {
    async searchProperty() {
      if (!this.propertySearch) {
        this.filteredProperties = [];
        return;
      }

      const res = await this.$apiGet("get_properties", {
        search: this.propertySearch,
        page_size: 50,
      });
      this.properties = res.data;
      this.filteredProperties = res.data;
    },
    async searchUser() {
      if (!this.userSearch) {
        this.filteredUsers = [];
        return;
      }

      const res = await this.$apiGet("get_users", {
        search: this.userSearch,
        page_size: 50,
      });
      this.users = res.data;
      this.filteredUsers = res.data;
    },
    selectProperty(property) {
      this.form.property_id = property.id;  // store id for backend
      this.propertySearch = property.name;  // show name in input
      this.propertyDropdownOpen = false;
    },
    selectUser(user) {
      this.form.user_id = user.id;           // store id for backend
      this.userSearch = `${user.first_name} ${user.middle_name} ${user.last_name}`;
      this.userDropdownOpen = false;
    },
    closePropertyDropdown() {
      setTimeout(() => (this.propertyDropdownOpen = false), 150);
    },
    closeUserDropdown() {
      setTimeout(() => (this.userDropdownOpen = false), 150);
    },
    async submitForm() {
      try {
        const response = await this.$apiPost("/post_maintenance_request", this.form);
        this.$root.$refs.toast.showToast("Maintenance request saved successfully", "success");

        // Reset form
        this.form = {
          status: "",
          description: "",
          requested_at: "",
          resolved_at: "",
          user_id: "",
          property_id: "",
        };
        this.propertySearch = "";
        this.userSearch = "";

        // Auto-close modal after 2s
        setTimeout(() => {
          this.$emit("close");
        }, 2000);
      } catch (error) {
        console.error("Error saving request:", error);
        this.$root.$refs.toast.showToast("Failed to save request", "error");
      }
    },
  },
};
</script>
