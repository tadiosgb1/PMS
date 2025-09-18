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
          <!-- Property -->
          <div>
            <label class="block text-gray-700 mb-1">Property</label>
            <input
              v-model="form.property_id"
              type="text"
              class="custom-input"
              @input="searchProperty"
              required
            />
          </div>

          <div
            class="mt-2 border rounded bg-white shadow w-full"
            v-if="pr_length > 0"
          >
            <div
              v-for="property in properties"
              :key="property.id"
              class="p-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
              @click="selectProperty(property)"
            >
              <span>{{ property.name }}</span>
              <i
                v-if="form.property_id === property.id"
                class="fas fa-check text-green-500"
              ></i>
            </div>
          </div>

          <!-- Zone -->
          <div>
            <label class="block text-gray-700 mb-1">Property Zone</label>
            <input
              v-model="form.property_zone_id"
              type="number"
              class="custom-input"
              required
            />
          </div>

          <!-- Broker -->
          <div>
            <label class="block text-gray-700 mb-1">Broker</label>
            <input
              v-model="form.broker"
              type="number"
              class="custom-input"
              required
            />
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
      properties: [],
      pr_length: 0,
    };
  },
  methods: {
    selectProperty(property) {
      this.form.property_id = property.id;
      console.log("Selected property:", this.form.property_id);
    },

    async searchProperty() {
      const params = {
        search: this.form.property_id,
        page_size: 50,
      };
      try {
        const res = await this.$apiGet("get_properties", params);
        this.properties = res.data;
        this.pr_length = res.data.length;
      } catch (err) {
        console.error("Error fetching properties:", err);
      }
    },

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
