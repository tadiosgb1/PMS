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
          <!-- ✅ Property -->
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

          <!-- ✅ Tenant (Now matches Property style) -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Tenant</label>
            <input
              v-model="tenantSearch"
              type="text"
              class="custom-input"
              placeholder="Search Tenant..."
              @input="searchTenants"
              @focus="tenantDropdown = true"
              @blur="hideDropdown('tenant')"
              required
            />
            <ul
              v-if="tenants.length > 0 && tenantDropdown"
              class="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow mt-1"
            >
              <li
                v-for="tenant in tenants"
                :key="tenant.id"
                class="p-2 hover:bg-gray-100 cursor-pointer"
                @mousedown.prevent="selectTenant(tenant)"
              >
                {{ tenant.first_name }} {{ tenant.middle_name }}
                {{ tenant.last_name }}
              </li>
            </ul>
          </div>

          <!-- ✅ Broker -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Broker</label>
            <input
              v-model="brokerSearch"
              type="text"
              class="custom-input"
              placeholder="Search Broker..."
              @input="searchBrokers"
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
                {{ broker.license_number }}
              </li>
            </ul>
          </div>

          <!-- Rent Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Rent Type</label
            >
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

          <div>
            <label class="block text-gray-700 mb-1">Start Date</label>
            <input
              v-model="form.start_date"
              type="date"
              class="custom-input"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">End Date</label>
            <input
              v-model="form.end_date"
              type="date"
              class="custom-input"
              required
            />
          </div>

          <!-- Payment Cycle -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Payment Cycle</label
            >
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

          <div>
            <label class="block text-gray-700 mb-1">Rent Amount</label>
            <input
              v-model="form.rent_amount"
              type="number"
              class="custom-input"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Deposit Amount</label>
            <input
              v-model="form.deposit_amount"
              type="number"
              class="custom-input"
              required
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Status</label
            >
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

      tenants: [],
      tenantSearch: "",
      tenantDropdown: false,

      brokers: [],
      brokerSearch: "",
      brokerDropdown: false,
    };
  },
  mounted() {
    this.fetchBrokers();
    this.fetchProperties();
    this.searchTenants(); // preload tenants
  },
  methods: {
    // ✅ Fetch properties
    async fetchProperties(url = null) {
      try {
        const pageUrl = url || `/get_properties?search=${this.propertySearch}`;
        const result = await this.$getProperties(pageUrl);
        this.properties = result.properties;
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    },
    searchProperties() {
      this.fetchProperties();
    },

    // ✅ Hide dropdowns
    hideDropdown(type) {
      setTimeout(() => {
        if (type === "property") this.propertyDropdown = false;
        if (type === "broker") this.brokerDropdown = false;
        if (type === "tenant") this.tenantDropdown = false;
      }, 200);
    },

    // ✅ Select property
    selectProperty(property) {
      this.form.property_id = property.id;
      this.propertySearch = property.name;
      this.propertyDropdown = false;
    },

    // ✅ Fetch brokers
    async fetchBrokers() {
      try {
        const res = await this.$apiGet("/get_broker_profiles");
        this.brokers = res.data || [];
      } catch (err) {
        console.error("Failed to fetch brokers:", err);
      }
    },
    searchBrokers() {
      if (this.brokerSearch === "") {
        this.fetchBrokers();
      } else {
        this.brokers = this.brokers.filter((b) =>
          b.license_number
            .toString()
            .toLowerCase()
            .includes(this.brokerSearch.toLowerCase())
        );
      }
    },
    selectBroker(broker) {
      this.form.broker = broker.id;
      this.brokerSearch = broker.license_number;
      this.brokerDropdown = false;
    },

    // ✅ Tenant search + select (NEW)
    async searchTenants() {
      try {
        const res = await this.$getTenants();
        if (this.tenantSearch) {
          this.tenants = res.tenants.filter((t) =>
            `${t.first_name} ${t.middle_name} ${t.last_name}`
              .toLowerCase()
              .includes(this.tenantSearch.toLowerCase())
          );
        } else {
          this.tenants = res.tenants;
        }
      } catch (error) {
        console.error("Failed to fetch tenants:", error);
        this.tenants = [];
      }
    },
    selectTenant(tenant) {
      this.form.user_id = tenant.id;
      this.tenantSearch = `${tenant.first_name} ${tenant.middle_name} ${tenant.last_name}`;
      this.tenantDropdown = false;
    },

    // ✅ Submit form
    async submitForm() {
      try {
        const response = await this.$apiPost("/post_rent", this.form);

        if (response.error) {
          this.$root.$refs.toast.showToast(response.error);
        } else {
          this.$root.$refs.toast.showToast(
            response.message || "Rent added successfully",
            "success"
          );

          // Reset form
          this.form = {
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
          };

          setTimeout(() => {
            this.$emit("close");
            this.$emit("refresh");
          }, 2000);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to add rent.");
      }
    },
  },
};
</script>
