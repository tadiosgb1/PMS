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
          class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
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
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <!-- Property Dropdown (Refactored like AddSale) -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Property</label>
            <input
              v-model="propertySearch"
              type="text"
              class="custom-input"
              placeholder="Search Property..."
              @input="searchProperties"
              @focus="propertyDropdown = true"
              @blur="hideDropdown('property')"
              required
            />
            <ul
              v-if="properties.length > 0 && propertyDropdown"
              class="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow mt-1"
            >
              <li
                v-for="property in properties"
                :key="property.id"
                class="p-2 hover:bg-gray-100 cursor-pointer"
                @mousedown.prevent="selectProperty(property)"
              >
                {{ property.name }}
              </li>
            </ul>
          </div>

          <!-- Requester Dropdown -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Tenant</label>
            <input
              v-model="userSearch"
              type="text"
              class="custom-input"
              placeholder="Search user"
              @input="searchUsers"
              @focus="userDropdown = true"
              @blur="hideDropdown('user')"
              autocomplete="off"
              required
            />

            <ul
              v-if="users.length > 0 && userDropdown"
              class="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow mt-1"
            >
              <li
                v-for="user in users"
                :key="user.id"
                class="p-2 hover:bg-gray-100 cursor-pointer"
                @mousedown.prevent="selectUser(user)"
              >
                {{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}
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
import Toast from "@/components/Toast.vue";

export default {
  name: "MaintenanceRequestAdd",
  components: { Toast },
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        status: "pending",
        description: "",
        requested_at: new Date().toISOString().split("T")[0],
        user_id: "",
        property_id: "",
      },
      properties: [],
      users: [],
      propertySearch: "",
      userSearch: "",
      propertyDropdown: false,
      userDropdown: false,
      ordering:"-id"
    };
  },
  mounted() {
    this.fetchProperties();
    this.fetchUsers();
  },
  methods: {
    // ✅ Fetch all properties initially
    async fetchProperties(url=null) {
      try {
         const pageUrl =
          url ||
          `/get_properties?search=${this.propertySearch}&ordering=${this.ordering}`;

        let result = [];
      
          result = await this.$getProperties(pageUrl);
       

        this.properties = result.properties;
      
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    },

    // ✅ Fetch all users initially
   async fetchUsers(url = null) {
  try {
    const pageUrl = url || `/get_rents?search=${this.userSearch}`;

    // 👇 FIX: Bind `this` so $apiGet works properly inside getTenants
    const response = await this.$getTenants.call(this, pageUrl);

    this.users = response.tenants || response.data || [];
  } catch (err) {
    console.error("Error fetching users:", err);
  }
},

    // ✅ Search properties like AddSale
    searchProperties() {
    
        this.fetchProperties();
     
    },

    // ✅ Search users
    searchUsers() {
     
        this.fetchUsers();
     
    },

    // ✅ Selectors
    selectProperty(property) {
      this.form.property_id = property.id;
      this.propertySearch = property.name;
      this.propertyDropdown = false;
    },
    selectUser(user) {
      this.form.user_id = user.id;
      this.userSearch = `${user.first_name} ${user.middle_name} ${user.last_name}`;
      this.userDropdown = false;
    },

    // ✅ Hide dropdowns gracefully
    hideDropdown(type) {
      setTimeout(() => {
        if (type === "property") this.propertyDropdown = false;
        if (type === "user") this.userDropdown = false;
      }, 200);
    },

    // ✅ Submit
    async submitForm() {
      try {
        this.form.requested_at = new Date().toISOString().split("T")[0];

        const res = await this.$apiPost("/post_maintenance_request", this.form);
        if (res?.data?.error) {
          this.$root.$refs.toast.showToast(res.data.error || "Failed to save request", "error");
        } else {
          this.$root.$refs.toast.showToast("Maintenance request saved successfully", "success");
        }

        // Reset form
        this.form = {
          status: "pending",
          description: "",
          requested_at: new Date().toISOString().split("T")[0],
          user_id: "",
          property_id: "",
        };
        this.propertySearch = "";
        this.userSearch = "";

        setTimeout(() => this.$emit("close"), 2000);
      } catch (error) {
        console.error("Error saving request:", error);
        this.$refs.toast.showToast("Failed to save request", "error");
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary;
}
</style>
