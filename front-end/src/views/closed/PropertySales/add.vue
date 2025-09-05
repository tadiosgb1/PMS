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
          <!-- Property ID -->
          <div>
            <label class="block text-gray-700 mb-1">Property ID</label>
            <input v-model="form.property_id" type="number" class="custom-input" required />
          </div>

          <!-- Seller -->
          <!-- <div>
            <label class="block text-gray-700 mb-1">Seller ID</label>
            <input v-model="form.seller" type="number" class="custom-input" required />
          </div> -->

          <!-- Buyer -->
          <div>
            <label class="block text-gray-700 mb-1">Buyer ID</label>
            <input v-model="form.buyer" type="number" class="custom-input" required />
          </div>

          <!-- Listing Price -->
          <div>
            <label class="block text-gray-700 mb-1">Listing Price</label>
            <input v-model="form.listing_price" type="number" class="custom-input" required />
          </div>

          <!-- Selling Price -->
          <div>
            <label class="block text-gray-700 mb-1">Selling Price</label>
            <input v-model="form.selling_price" type="number" class="custom-input" required />
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
        seller: localStorage.getItem('userId'),
        buyer: 55,
        listing_price: "",
        selling_price: "",
        status: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await this.$apiPost("/post_property_sale", this.form);
        this.$root.$refs.toast.showToast(
          response.message || "Sale added successfully",
          "success"
        );

        // Reset form (keep property_id if provided from route)
        this.form = {
          property_id: this.propertyId || "",
          seller: "",
          buyer: "",
          listing_price: "",
          selling_price: "",
          status: "",
     
        };

        setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 2000);
      } catch (error) {
        console.error(error);
        alert("Failed to add sale.");
      }
    },
  },
};
</script>
