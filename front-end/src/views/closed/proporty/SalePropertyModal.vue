<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold">Sale Property</h2>
        <button @click="$emit('close')" class="text-gray-600 hover:text-black">&times;</button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitSale">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Listing Price</label>
            <input
              v-model="form.listing_price"
              type="number"
              class="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Selling Price</label>
            <input
              v-model="form.selling_price"
              type="number"
              class="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Status</label>
            <select
              v-model="form.status"
              class="w-full mt-1 border rounded px-3 py-2"
              required
            >
              <option value="available">Available</option>
              <option value="sold">Sold</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Seller (User ID)</label>
            <input
              v-model="form.seller"
              type="number"
              class="w-full mt-1 border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Buyer (User ID)</label>
            <input
              v-model="form.buyer"
              type="number"
              class="w-full mt-1 border rounded px-3 py-2"
              placeholder="Leave empty if not sold"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 mt-6">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            :disabled="loading"
          >
            {{ loading ? 'Saving...' : 'Save Sale' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalePropertyModal",
  props: {
    visible: { type: Boolean, default: false },
    propertyId: { type: Number, required: true },
  },
  data() {
    return {
      loading: false,
      form: {
        listing_price: "",
        selling_price: "",
        status: "available",
        seller: localStorage.getItem("userId") || "", // default seller
        buyer: "",
      },
    };
  },
  methods: {
    async submitSale() {
      this.loading = true;
      try {
        const payload = {
          ...this.form,
          property_id: this.propertyId,
        };
        const res = await this.$apiPost("/create_sale_property", payload);
        this.$root.$refs.toast.showToast(res.message || "Property sale created", "success");
        this.$emit("close");
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to create sale", "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
