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
          Add New Rent
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
          <!-- Property -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Property</label>
            <input
              v-model="propertySearch"
              type="text"
              class="custom-input"
              placeholder="Search Property..."
              @input="fetchProperties"
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

          <!-- Tenant -->
          <div>
            <label class="block text-gray-700 mb-1">Tenant</label>
            <input
              v-model="form.user_id"
              type="text"
              class="custom-input"
              placeholder="Search Tenant..."
              @input="searchUser"
            />
            <div
              class="mt-2 border rounded bg-white shadow w-full"
              v-if="users.length > 0"
            >
              <div
                v-for="user in users"
                :key="user.id"
                class="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                @click="selectUser(user)"
              >
                <span>{{ user.first_name }} {{ user.middle_name }} {{ user.last_name }}</span>
                <i
                  v-if="form.user_id === user.id"
                  class="fas fa-check text-green-500"
                ></i>
              </div>
            </div>
          </div>

          <!-- Broker -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Broker</label>
            <input
              v-model="brokerSearch"
              type="text"
              class="custom-input"
              placeholder="Search Broker..."
              @input="fetchBrokers"
              @focus="brokerDropdown = true"
              @blur="hideDropdown('broker')"
              required
            />
            <ul
              v-if="brokers.length > 0 && brokerDropdown"
              class="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow mt-1"
            >
              <li
                v-for="broker in brokers"
                :key="broker.id"
                class="p-2 hover:bg-gray-100 cursor-pointer"
                @mousedown.prevent="selectBroker(broker)"
              >
                {{ broker.user?.first_name }} {{ broker.user?.last_name }}
                <span class="text-sm text-gray-500">({{ broker.license_number }})</span>
              </li>
            </ul>
          </div>

          <!-- Rent Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Rent Type</label>
            <select
              v-model="form.rent_type"
              class="custom-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="lease">Lease</option>
              <option value="house_rent">House Rent</option>
              <option value="vehicle_rent">Vehicle Rent</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Start Date -->
          <div>
            <label class="block text-gray-700 mb-1">Start Date</label>
            <input v-model="form.start_date" type="date" class="custom-input" required />
          </div>

          <!-- End Date -->
          <div>
            <label class="block text-gray-700 mb-1">End Date</label>
            <input v-model="form.end_date" type="date" class="custom-input" required />
          </div>

          <!-- Payment Cycle -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Payment Cycle</label>
            <select
              v-model="form.payment_cycle"
              class="custom-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <!-- Rent Amount -->
          <div>
            <label class="block text-gray-700 mb-1">Rent Amount</label>
            <input v-model="form.rent_amount" type="number" class="custom-input" required />
          </div>

          <!-- Deposit Amount -->
          <div>
            <label class="block text-gray-700 mb-1">Deposit Amount</label>
            <input v-model="form.deposit_amount" type="number" class="custom-input" required />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="form.status"
              class="custom-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="md:col-span-2 text-right pt-2">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded border-orange-100 focus:ring-orange-300 shadow"
            >
              Save Rent
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
  name: "AddRent",
  components: { Toast },
  props: {
    visible: Boolean,
    propertyId: [String, Number],
  },
  data() {
    return {
      form: {
        property_id: this.propertyId || "",
        user_id: "",
        rent_type: "",
        start_date: "",
        end_date: "",
        payment_cycle: "",
        rent_amount: "",
        deposit_amount: "",
        status: "",
        broker: "",
      },
      properties: [],
      propertySearch: "",
      propertyDropdown: false,
      users: [],
      brokers: [],
      brokerSearch: "",
      brokerDropdown: false,
    };
  },
  mounted() {
    this.fetchProperties();
    this.fetchBrokers();
  },
  methods: {
    // --- Properties ---
    async fetchProperties() {
      try {
        const params = { search: this.propertySearch || "" };
        const res = await this.$apiGet("/get_properties", { params });
        this.properties = res.data || [];
        this.propertyDropdown = true;
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    },
    selectProperty(property) {
      this.form.property_id = property.id;
      this.propertySearch = property.name;
      this.propertyDropdown = false;
    },

    // --- Users ---
    async searchUser() {
      if (!this.form.user_id) {
        this.users = [];
        return;
      }
      try {
        const params = { search: this.form.user_id, page_size: 1000 };
        const res = await this.$apiGet("/get_tenants", { params });
        this.users = res.data || [];
      } catch (err) {
        console.error("Error searching users:", err);
      }
    },
    selectUser(user) {
      this.form.user_id = user.id;
      this.users = [];
    },

    // --- Brokers ---
    async fetchBrokers() {
      if (!this.brokerSearch) {
        this.brokers = [];
        return;
      }
      try {
        const params = { user__first_name: this.brokerSearch };
        const res = await this.$apiGet("/get_broker_profiles", { params });
        this.brokers = res.data || [];
        this.brokerDropdown = true;
      } catch (err) {
        console.error("Failed to fetch brokers:", err);
      }
    },
    selectBroker(broker) {
      this.form.broker = broker.id;
      this.brokerSearch = broker.user
      this.brokerDropdown = false;
    },

    // --- Dropdown ---
    hideDropdown(type) {
      setTimeout(() => {
        if (type === "property") this.propertyDropdown = false;
        if (type === "broker") this.brokerDropdown = false;
      }, 200);
    },

    // --- Submit ---
    async submitForm() {
      try {
        const res = await this.$apiPost("/post_rent", this.form);
        this.$refs.toast.showToast(res.message || "Rent added successfully", "success");

        // Reset form (keep property_id if passed from parent)
        this.form = { ...this.form, user_id: "", rent_type: "", start_date: "", end_date: "", payment_cycle: "", rent_amount: "", deposit_amount: "", status: "", broker: "" };

        setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 1500);
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to add rent.", "error");
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
