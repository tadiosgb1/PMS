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
          Add New Sale
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
          <!-- Property Zone -->
          <div class="relative">
            <label class="block text-gray-700 mb-1">Property Zone</label>
            <input
              v-model="zoneSearch"
              type="text"
              class="custom-input"
              placeholder="Search Zone..."
              @input="searchZones"
              @focus="zoneDropdown = true"
              @blur="hideDropdown('zone')"
              required
            />
            <ul
              v-if="zones.length > 0 && zoneDropdown"
              class="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow mt-1"
            >
              <li
                v-for="zone in zones"
                :key="zone.id"
                class="p-2 hover:bg-gray-100 cursor-pointer"
                @mousedown.prevent="selectZone(zone)"
              >
                {{ zone.name }}
              </li>
            </ul>
          </div>

          <!-- Property -->
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
                <!-- Display broker name (update based on your API response) -->
                {{ broker.user?.first_name }} {{ broker.user?.last_name }}
                <span class="text-sm text-gray-500">({{ broker.license_number }})</span>
              </li>
            </ul>
          </div>

          <!-- Listing Price -->
          <div>
            <label class="block text-gray-700 mb-1">Listing Price</label>
            <input
              v-model="form.listing_price"
              type="number"
              class="custom-input"
              required
            />
          </div>

          <!-- Selling Price -->
          <div>
            <label class="block text-gray-700 mb-1">Selling Price</label>
            <input
              v-model="form.selling_price"
              type="number"
              class="custom-input"
              required
            />
          </div>

          <!-- Status Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="form.status"
              class="custom-select mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            >
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="md:col-span-2 text-right pt-2">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded border-orange-100 focus:ring-orange-300 shadow"
            >
              Save Sale
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
  name: "AddSale",
  components: { Toast },
  props: {
    visible: Boolean,
    propertyId: [String, Number],
  },
  data() {
    return {
      form: {
        property_id: this.propertyId || "",
        property_zone_id: "",
        broker: "",
        listing_price: "",
        selling_price: "",
        status: "pending",
      },
      zones: [],
      properties: [],
      brokers: [],
      zoneSearch: "",
      propertySearch: "",
      brokerSearch: "",
      zoneSearch: "",zoneSearch: "",
      propertyDropdown: false,
      brokerDropdown: false,
    };
  },
  mounted() {
    this.fetchZones();
    this.fetchProperties();
    this.fetchBrokers();
  },
  methods: {
    // ✅ Fetch Zones
    async fetchZones() {
      try {
        const res = await this.$apiGet("/get_property_zones");
        this.zones = res.data || [];
      } catch (err) {
        console.error("Failed to fetch zones:", err);
      }
    },

    // ✅ Fetch Properties
    async fetchProperties() {
      try {
        const res = await this.$apiGet("/get_properties");
        this.properties = res.data || [];
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    },

    // ✅ Search Zones
    searchZones() {
      if (this.zoneSearch === "") {
        this.fetchZones();
      } else {
        this.zones = this.zones.filter((z) =>
          z.name.toLowerCase().includes(this.zoneSearch.toLowerCase())
        );
      }
    },

    // ✅ Search Properties
    searchProperties() {
      if (this.propertySearch === "") {
        this.fetchProperties();
      } else {
        this.properties = this.properties.filter((p) =>
          p.name.toLowerCase().includes(this.propertySearch.toLowerCase())
        );
      }
    },

    // ✅ Fetch Brokers (fixed version)
    async fetchBrokers() {
      try {
        const search = this.brokerSearch || "";
        const params = { user__first_name: search };
        const res = await this.$apiGet("/get_broker_profiles",params );
        this.brokers = res.data || [];
        this.brokerDropdown = true;
        console.log("brokers", this.brokers);
      } catch (err) {
        console.error("Failed to fetch brokers:", err);
      }
    },

    // ✅ Select Broker
    selectBroker(broker) {
      console.log("broker",broker)
      this.form.broker = broker.id;
      this.brokerSearch =broker.user;
      this.brokerDropdown = false;
    },

    // ✅ Select Zone
    selectZone(zone) {
      this.form.property_zone_id = zone.id;
      this.zoneSearch = zone.name;
      this.zoneDropdown = false;
    },

    // ✅ Select Property
    selectProperty(property) {
      this.form.property_id = property.id;
      this.propertySearch = property.name;
      this.propertyDropdown = false;
    },

    // ✅ Hide dropdowns gracefully
    hideDropdown(type) {
      setTimeout(() => {
        if (type === "zone") this.zoneDropdown = false;
        if (type === "property") this.propertyDropdown = false;
        if (type === "broker") this.brokerDropdown = false;
      }, 200);
    },

    // ✅ Submit form
    async submitForm() {
      try {
        const response = await this.$apiPost(
          "/post_property_zone_sale",
          this.form
        );
        this.$refs.toast.showToast(
          response.message || "Sale added successfully",
          "success"
        );

        setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 1500);
      } catch (error) {
        console.error(error);
        this.$refs.toast.showToast("Failed to add sale.", "error");
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
