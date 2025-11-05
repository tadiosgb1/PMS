<template>
  <div>
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <!-- 🔹 Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
        >
          Add Property for Sale
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <!-- 🔹 Form -->
        <form
          @submit.prevent="submitSale"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto"
        >
          <!-- Listing Price -->
          <div class="md:col-span-2">
            <label class="block text-gray-700 mb-1">Listing Price</label>
            <input
              v-model="listingPrice"
              type="number"
              placeholder="Enter listing price"
              class="custom-input"
              required
            />
          </div>

          <!-- Buttons -->
          <div class="md:col-span-2 text-right mt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="bg-orange-300 text-gray-700 font-semibold px-6 py-3 rounded shadow hover:bg-orange-400 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-primary text-white font-semibold px-6 py-3 rounded shadow hover:bg-orange-600"
              :disabled="loading"
            >
              {{ loading ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "SaleModal",
  components: { Toast },
  props: {
    visible: Boolean,
    propertyId: Number,
  },
  data() {
    return {
      listingPrice: "",
      loading: false,
    };
  },
  methods: {
    async submitSale() {
    
      try {
        this.loading = true;
        const payload = {
          property_id: this.propertyId,
          listing_price: this.listingPrice,
        };

        const res = await this.$apiPost("/create_property_sale_listing", payload);

        if (res && res.error) {
          this.$root.$refs.toast.showToast(res.error, "error");
        } else {
          this.$root.$refs.toast.showToast(
            "Property listed for sale successfully!",
            "success"
          );
          this.$emit("close");
          this.$emit("refresh");
        }
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to create sale listing", "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500;
}
</style>
