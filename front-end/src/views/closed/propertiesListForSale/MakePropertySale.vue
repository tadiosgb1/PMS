<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div class="bg-white w-full sm:max-w-[800px] rounded-lg shadow-lg overflow-hidden">
      <!-- Header -->
      <div
        class="bg-orange-500 text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
      >
        Make Property Sale
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <form
        @submit.prevent="submitSale"
        class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto"
      >
        <!-- 🧍 Owner -->
        <div class="relative">
          <label class="block text-gray-700 mb-1">Buyer</label>
          <input
            v-model="ownerSearch"
            type="text"
            class="custom-input"
            placeholder="Search Buyer..."
            @input="fetchOwners"
            @focus="ownerDropdown = true"
            @blur="hideDropdown('owner')"
            required
          />
          <ul
            v-if="owners.length > 0 && ownerDropdown"
            class="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow mt-1"
          >
            <li
              v-for="owner in owners"
              :key="owner.id"
              class="p-2 hover:bg-gray-100 cursor-pointer"
              @mousedown.prevent="selectOwner(owner)"
            >
              {{ owner.full_name }}
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
              {{ broker.user?.first_name }} {{ broker.user?.last_name }}
              <span class="text-sm text-gray-500">
                ({{ broker.license_number }})
              </span>
            </li>
          </ul>
        </div>

        <!-- Listing Info -->
        <div>
          <label class="block text-gray-700 mb-1">Listing Price</label>
          <input
            v-model="listing.listing_price"
            disabled
            class="custom-input bg-gray-100 cursor-not-allowed"
          />
        </div>

        <!-- Payment Details -->
        <div>
          <label class="block text-gray-700 mb-1">Payment Method</label>
          <select v-model="payment_method" class="custom-input" required>
            <option value="" disabled>Select Payment Method</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="cash">Cash</option>
            <option value="check">Check</option>
            <option value="mobile_money">Mobile Money</option>
          </select>
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Transaction ID</label>
          <input
            v-model="transaction_id"
            placeholder="Enter Transaction ID"
            class="custom-input"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Property</label>
          <input
            :value="
              listing.property_zone_id?.name ||
              listing.property_id?.name ||
              'N/A'
            "
            disabled
            class="custom-input bg-gray-100 cursor-not-allowed"
          />
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 mt-6 md:col-span-2">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 rounded text-white transition-all duration-200"
            :class="
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600'
            "
          >
            <span v-if="!loading">Submit Sale</span>
            <span v-else class="flex items-center space-x-2">
              <svg
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>Saving...</span>
            </span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "MakePropertySale",
  components: { Toast },
  props: { visible: Boolean, listing: Object },
  data() {
    return {
      loading: false,
      // ✅ Owner
      owners: [],
      ownerSearch: "",
      ownerDropdown: false,
      selectedOwner: null,

      // ✅ Broker
      brokers: [],
      brokerSearch: "",
      brokerDropdown: false,
      selectedBroker: null,

      payment_method: "",
      transaction_id: "",
    };
  },
  mounted() {
    this.fetchBrokers();
  },
  methods: {
    // ✅ Fetch Owners
    async fetchOwners() {
      try {
        const searchTerm = this.ownerSearch || "";
        const ordering = "full_name";
        const response = await this.$apiGet(
          `/get_owners?search=${searchTerm}&ordering=${ordering}`
        );
        this.owners = response.owners || [];
        this.ownerDropdown = true;
      } catch (err) {
        console.error("Failed to fetch owners:", err);
      }
    },

    selectOwner(owner) {
      this.selectedOwner = owner;
      this.ownerSearch = owner.full_name;
      this.ownerDropdown = false;
    },

    // ✅ Fetch Brokers
    async fetchBrokers() {
      try {
        const params = { user__first_name: this.brokerSearch || "" };
        const res = await this.$apiGet("/get_broker_profiles", params);
        this.brokers = res.data || [];
        this.brokerDropdown = true;
      } catch (err) {
        console.error("Failed to fetch brokers:", err);
      }
    },

    selectBroker(broker) {
      this.selectedBroker = broker;
      this.brokerSearch = `${broker.user?.first_name || ""} ${
        broker.user?.last_name || ""
      }`.trim();
      this.brokerDropdown = false;
    },

    hideDropdown(type) {
      setTimeout(() => {
        if (type === "broker") this.brokerDropdown = false;
        if (type === "owner") this.ownerDropdown = false;
      }, 200);
    },

    // 💾 Submit Sale
    async submitSale() {
      this.loading = true;
      try {
        const payload = {
          buyer_id: this.selectedOwner?.id || null, // ✅ use selected owner as buyer
          selling_price: this.listing.listing_price,
          property_zone_sale_id: this.listing.property_id?.id || null,
          broker_id: this.selectedBroker?.id || null,
          payment_method: this.payment_method,
          transaction_id: this.transaction_id,
          status: "pending",
        };

        const saleRes = await this.$apiPost("/sell_property", payload);
        if (saleRes) {
          this.$root.$refs.toast.showToast(
            "Property sold successfully!",
            "success"
          );
          this.$emit("success");
          this.$emit("close");
        }
      } catch (error) {
        console.error("Failed to submit sale:", error);
        this.$root.$refs.toast.showToast(
          error.message || "Failed to complete property sale",
          "error"
        );
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
