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
      zoneDropdown: false,
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
    async fetchZones() {
      try {
        const url = `/get_property_zones?search=${this.zoneSearch}`;
      
        const result = await this.$getZones(url);
        console.log("result for zones",result)
        this.zones = result.zones;
        
      } catch (err) {
        console.error("Failed to fetch zones:", err);
      }
    },
    async fetchProperties(url = null) {
      try {
         const pageUrl =
          url ||
          `/get_properties?search=${this.propertySearch}`;

        let result = [];
      
          result = await this.$getProperties(pageUrl);
       
        this.properties = result.properties;
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    },
    async fetchBrokers() {
      try {
        const res = await this.$apiGet("/get_broker_profiles");
        this.brokers = res.data || [];
      } catch (err) {
        console.error("Failed to fetch brokers:", err);
      }
    },
    searchZones() {
     this.fetchZones();
    },
    searchProperties() {
      this.fetchProperties()
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
    selectZone(zone) {
      this.form.property_zone_id = zone.id;
      this.zoneSearch = zone.name;
      this.zoneDropdown = false;
    },
    selectProperty(property) {
      this.form.property_id = property.id;
      this.propertySearch = property.name;
      this.propertyDropdown = false;
    },
    selectBroker(broker) {
      this.form.broker = broker.id;
      this.brokerSearch = broker.license_number;
      this.brokerDropdown = false;
    },
    hideDropdown(type) {
      setTimeout(() => {
        if (type === "zone") this.zoneDropdown = false;
        if (type === "property") this.propertyDropdown = false;
        if (type === "broker") this.brokerDropdown = false;
      }, 200);
    },
    async submitForm() {
      try {
        const response = await this.$apiPost(
          "/post_property_zone_sale",
          this.form
        );
        this.$root.$refs.toast.showToast(
          response.message || "Sale added successfully",
          "success"
        );

        setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 1500);
      } catch (error) {
        console.error(error);
        this.$root.$refs.toast.showToast("Failed to add sale.", "error");
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
