<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div
      class="bg-white w-full sm:w-auto sm:max-w-[500px] md:max-w-[650px] lg:max-w-[750px] xl:max-w-[850px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
    >
      <!-- Header -->
      <div class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center">
        Add Sale Commission
        <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4 px-4 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">SaaS Commission %</label>
            <input
              v-model="form.saas_commission"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Broker Commission %</label>
            <input
              v-model="form.broker_commission"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

        

          <!-- Property Sale Autocomplete -->
          <div class="relative">
            <label class="block text-sm font-medium mb-1">Property Sale Code</label>
            <input
              v-model="form.property_sale"
              type="text"
              placeholder="Search property..."
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />

            <!-- Suggestions -->
            <!-- <ul
              v-if="propertySales.length && showSuggestions"
              class="pb-10 absolute z-10 bg-white border rounded-lg shadow-md mt-1 w-full max-h-48 overflow-auto"
            >
              <li
                v-for="sale in propertySales"
                :key="sale.id"
                @click="selectPropertySale(sale);searchTerm=sale.id"
                class="px-3 pt-2  hover:bg-gray-100 cursor-pointer"
              >
                {{ sale.id }}
              </li>
            </ul> -->
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
          <button
            type="submit"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Save Commission
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddCommission",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        saas_commission: "",
        broker_commission: "",
        total_commission:0,
        property_sale: null, // ID of selected property
      },
      searchTerm: "",
      propertySales: [],
      showSuggestions: false,
      searchTimeout: null,
    };
  },

  methods: {
    async searchPropertySales() {
      this.showSuggestions = true;

      // debounce API calls
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        if (!this.searchTerm) {
          this.propertySales = [];
          return;
        }

        try {
          const res = await this.$apiGet(
            `/get_property_zone_sales?search=${encodeURIComponent(this.searchTerm)}`
          );
          console.log("search res",res);
          this.propertySales = res.data || [];
        } catch (err) {
          console.error("Failed to fetch property sales:", err);
        }
      }, 400); // wait 400ms after typing
    },

    selectPropertySale(sale) {
      this.form.property_sale = sale.id; // store ID
      this.searchTerm = sale.name || sale.code; // show name in input
      this.propertySales = [];
      this.showSuggestions = false;
    },

    async submitForm() {

 
      try {
        const payload = { ...this.form };
        const res = await this.$apiPost("/post_commission", payload);
        console.log("Commission added:", res);
        this.$emit("success");
        this.resetForm();
        this.$emit("close");
      } catch (err) {
        console.error("Failed to add commission:", err);
            this.$root.$refs.toast.showToast(err.message, 'error');
        //alert("Failed to add commission.");
      }
    },

    resetForm() {
      this.form = {
        saas_commission: "",
        broker_commission: "",
        total_commission: "",
        property_sale: 0,
      };
      this.searchTerm = "";
      this.propertySales = [];
      this.showSuggestions = false;
    },
  },
};
</script>
