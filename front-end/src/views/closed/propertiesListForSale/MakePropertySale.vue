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
        <!-- 🧍 Buyer Information -->
        <!-- <div class="md:col-span-2 border-t pt-4">
          <h3 class="text-lg font-semibold text-gray-800 mb-2">
            Buyer Information
          </h3>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              v-model="buyer.first_name"
              placeholder="First Name"
              class="custom-input"
              required
            />
            <input
              v-model="buyer.middle_name"
              placeholder="Middle Name"
              class="custom-input"
            />
            <input
              v-model="buyer.last_name"
              placeholder="Last Name"
              class="custom-input"
              required
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <input
              v-model="buyer.email"
              type="email"
              placeholder="Email"
              class="custom-input"
              required
            />
            <input
              v-model="buyer.phone_number"
              placeholder="Phone Number"
              class="custom-input"
            />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
            <input
              v-model="buyer.password"
              type="password"
              placeholder="Password"
              class="custom-input"
              required
            />
            <input
              v-model="buyer.address"
              placeholder="Address"
              class="custom-input"
            />
          </div>
        </div> -->

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

        <!-- 🏠 Listing Info -->
        <div>
          <label class="block text-gray-700 mb-1">Listing Price</label>
          <input
            v-model="listing.listing_price"
            disabled
            class="custom-input bg-gray-100 cursor-not-allowed"
          />
        </div>

        <!-- 💳 Payment Details -->
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

        <!-- 🧾 Actions -->
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
            :class="loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'"
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
  props: {
    visible: Boolean,
    listing: Object,
  },
  data() {
    return {
      loading: false,
      brokers: [],
      brokerSearch: "",
      brokerDropdown: false,
      selectedBroker: null,
      payment_method: "", // ✅ added
      transaction_id: "", // ✅ added
    //   buyer: {
    //     first_name: "",
    //     middle_name: "",
    //     last_name: "",
    //     email: "",
    //     phone_number: "",
    //     password: "",
    //     address: "",
    //     date_joined: new Date().toISOString(),
    //     last_login: new Date().toISOString(),
    //     is_active: true,
    //     is_staff: false,
    //     is_superuser: false,
    //   },
    };
  },

   mounted() {
    
    this.fetchBrokers();
  },
  methods: {
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
  this.selectedBroker = broker; // store selected broker
  this.brokerSearch = `${broker.user?.first_name || ''} ${broker.user?.last_name || ''}`.trim();
  this.brokerDropdown = false;
},

     // ✅ Hide dropdowns gracefully
    hideDropdown(type) {
      setTimeout(() => {
        if (type === "broker") this.brokerDropdown = false;
      }, 200);
    },

    // 💾 Submit Sale
    async submitSale() {
      this.loading = true;
      try {
        // 1️⃣ Create buyer
        // const buyerRes = await this.$apiPost("/post_user", this.buyer);
        // if (!buyerRes?.id) throw new Error("Failed to create buyer");

        // 2️⃣ Assign buyer to group
        // await this.$apiPost("/set_user_groups", {
        //   user_id: buyerRes.id,
        //   groups: ["buyer"],
        // });

        // 3️⃣ Post sale with broker info
       const payload = {
  //buyer_id: buyerRes.id,
  buyer_id: 4,
  selling_price: this.listing.listing_price,
  property_zone_sale_id: this.listing.property_id?.id || null,
  broker_id: this.selectedBroker?.id || null, // ✅ Correct reference
  payment_method: this.payment_method, // ✅ included
          transaction_id: this.transaction_id, // ✅ included
  status:"pending"
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
