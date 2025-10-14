<template>
  <div>
    <!-- Toast -->
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:max-w-[950px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center"
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
          @submit.prevent="handleSubmit"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
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
              @focus="openPropertyDropdown"
              @blur="hideDropdown('property')"
              required
            />
            <ul
              v-if="propertyDropdown && properties.length > 0"
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

          <!-- Tenant Info -->
          <div class="relative md:col-span-2 border-t pt-4 mt-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-2">Tenant Information</h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input v-model="tenant.first_name" placeholder="First Name" class="custom-input" required />
              <input v-model="tenant.middle_name" placeholder="Middle Name" class="custom-input" />
              <input v-model="tenant.last_name" placeholder="Last Name" class="custom-input" required />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <input v-model="tenant.email" type="email" placeholder="Email" class="custom-input" required />
              <input v-model="tenant.phone_number" type="text" placeholder="Phone Number" class="custom-input" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <input v-model="tenant.password" type="password" placeholder="Password" class="custom-input" required />
              <input v-model="tenant.address" type="text" placeholder="Address" class="custom-input" />
            </div>
          </div>

          <!-- Rent Type -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Rent Type</label>
            <select v-model="form.rent_type" class="custom-select mt-1 block w-full" required>
              <option value="">Select Type</option>
              <option value="lease">Lease</option>
              <option value="house_rent">House Rent</option>
              <option value="vehicle_rent">Vehicle Rent</option>
              <option value="other">Other</option>
            </select>
          </div>

          <!-- Dates -->
          <div>
            <label class="block text-gray-700 mb-1">Start Date</label>
            <input v-model="form.start_date" type="date" class="custom-input" required />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">End Date</label>
            <input v-model="form.end_date" type="date" class="custom-input" />
          </div>

          <!-- Payment Cycle -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Payment Cycle</label>
            <select v-model="form.payment_cycle" class="custom-select mt-1 block w-full" required>
              <option value="">Select Cycle</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <!-- Amounts -->
          <div>
            <label class="block text-gray-700 mb-1">Rent Amount</label>
            <input v-model="form.rent_amount" type="number" class="custom-input" required />
          </div>
          <div>
            <label class="block text-gray-700 mb-1">Deposit Amount</label>
            <input v-model="form.deposit_amount" type="number" class="custom-input" required />
          </div>

          <div class="md:col-span-2 text-right pt-4">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded shadow flex items-center justify-center"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center gap-2">
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Saving Rent...
              </span>
              <span v-else>Save Rent</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import { text } from "@fortawesome/fontawesome-svg-core";

export default {
  name: "AddRent",
  components: { Toast },
  props: {
    visible: Boolean,
    propertyId: [String, Number],
  },
  data() {
    return {
      loading: false,
      form: {
        property_id: this.propertyId || "",
        rent_type: "",
        start_date: "",
        end_date: "",
        payment_cycle: "",
        rent_amount: "",
        deposit_amount: "",
        status: "pending",
      },
      tenant: {
        password: "",
        last_login: new Date().toISOString(),
        email: "",
        first_name: "",
        middle_name: "",
        last_name: "",
        phone_number: "",
        address: "",
        date_joined: new Date().toISOString(),
        is_active: true,
        is_staff: false,
        is_superuser: false,
      },
      properties: [],
      propertySearch: "",
      propertyDropdown: false,
      ordering: "-id",
    };
  },
  methods: {
    async fetchProperties(url = null) {
      try {
        const pageUrl =
          url || `/get_properties?search=${this.propertySearch}&ordering=${this.ordering}`;
        const response = await this.$apiGet(pageUrl);

        // ✅ Safely handle structure variations
        this.properties =
          response.data?.results || response.data || response.properties || [];

        this.propertyDropdown = this.properties.length > 0;
        console.log("Properties fetched:", this.properties);
      } catch (err) {
        console.error("Error fetching properties:", err);
        this.properties = [];
      }
    },
    openPropertyDropdown() {
      this.propertyDropdown = true;
      this.fetchProperties();
    },
    selectProperty(property) {
      this.form.property_id = property.id;
      this.propertySearch = property.name;
      this.propertyDropdown = false;
    },
    hideDropdown(type) {
      setTimeout(() => {
        if (type === "property") this.propertyDropdown = false;
      }, 200);
    },

    /** ✅ Unified Submit **/
    async handleSubmit() {
      this.loading = true;
      try {
        // Step 1: Create tenant
        const tenantRes = await this.$apiPost("/post_user", this.tenant);
        if (!tenantRes.id) throw new Error("Failed to create tenant");

        // Step 2: Assign to 'tenant' group
        await this.$apiPost("/set_user_groups", {
          user_id: tenantRes.id,
          groups: ["tenant"],
        });

        // Step 3: Create rent linked to that tenant
        const rentPayload = { ...this.form, user_id: tenantRes.id };
        const rentRes = await this.$apiPost("/post_rent", rentPayload);

        this.$root.$refs.toast.showToast(
          rentRes.message || "Rent added successfully",
          "success"
        );

        setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 1500);
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast(err.message, "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary;
}
.custom-select {
  @apply border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-primary;
}
</style>
