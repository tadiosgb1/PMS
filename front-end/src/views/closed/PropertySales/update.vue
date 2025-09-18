<template>
  <div>
    <Toast ref="toast" />
    <div
      v-if="visible"
      class="fixed inset-0 w-full z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
        >
          Edit Property Sale
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
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto"
        >
          <!-- Listing Price -->
          <div>
            <label class="block text-gray-700">Listing Price</label>
            <input
              v-model.number="form.listing_price"
              type="number"
              class="custom-input"
            />
          </div>

          <!-- Selling Price -->
          <div>
            <label class="block text-gray-700">Selling Price</label>
            <input
              v-model.number="form.selling_price"
              type="number"
              class="custom-input"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="custom-input">
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <!-- Property Zone with Dropdown -->
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

          <!-- Property with Dropdown -->
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

          <!-- Broker with Dropdown -->
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

          <!-- Submit -->
          <div class="md:col-span-2 text-right mt-4">
            <button
              type="submit"
              class="bg-primary hover:bg-primary-dark text-white font-semibold px-6 py-3 rounded shadow"
            >
              Update Sale
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
  name: "PropertySaleUpdate",
  components: { Toast },
  props: {
    visible: Boolean,
    sale: Object,
  },
  data() {
    return {
      form: {
        id: null,
        listing_price: 0,
        selling_price: 0,
        status: "pending",
        property_zone_id: 0,
        property_id: 0,
        broker: 0,
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
  watch: {
    sale: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            id: val.id,
            listing_price: val.listing_price || 0,
            selling_price: val.selling_price || 0,
            status: val.status || "pending",
            property_zone_id: val.property_zone_id?.id || 0,
            property_id: val.property_id?.id || 0,
            broker: val.broker?.id || 0,
          };
          this.zoneSearch = val.property_zone_id?.name || "";
          this.propertySearch = val.property_id?.name || "";
          this.brokerSearch = val.broker?.license_number || "";
        }
      },
    },
  },
  mounted() {
    this.fetchZones();
    this.fetchProperties();
    this.fetchBrokers();
  },
  methods: {
    async fetchZones() {
      try {
        const res = await this.$apiGet("/get_property_zones");
        this.zones = res.data || [];
      } catch (err) {
        console.error("Failed to fetch zones:", err);
      }
    },
    async fetchProperties() {
      try {
        const res = await this.$apiGet("/get_properties");
        this.properties = res.data || [];
      } catch (err) {
        console.error("Failed to fetch properties:", err);
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
      if (this.zoneSearch === "") {
        this.fetchZones();
      } else {
        this.zones = this.zones.filter((z) =>
          z.name.toLowerCase().includes(this.zoneSearch.toLowerCase())
        );
      }
    },
    searchProperties() {
      if (this.propertySearch === "") {
        this.fetchProperties();
      } else {
        this.properties = this.properties.filter((p) =>
          p.name.toLowerCase().includes(this.propertySearch.toLowerCase())
        );
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
        await this.$apiPut(`/update_property_zone_sale`, this.form.id, this.form);
        this.$root.$refs.toast.showToast(
          "Property sale updated successfully",
          "success"
        );
        this.$emit("refresh");
        setTimeout(() => this.$emit("close"), 1500);
      } catch (err) {
        console.error("Update failed:", err);
        this.$root.$refs.toast.showToast(
          err?.response?.data?.message || "Failed to update sale",
          "error"
        );
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
