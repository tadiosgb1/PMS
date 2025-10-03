<template>
  <div class="p-6 ">
    <h1 class="text-lg font-bold mb-6 text-gray-800">Property Sale Details</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 text-center py-10">Loading sale details...</div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 text-center py-10">{{ error }}</div>

    <!-- Sale Info -->
    <div v-else-if="sale" class="space-y-6">
      <!-- Sale Card -->
      <div class="bg-white shadow-lg rounded-lg p-6 space-y-3">
        <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-3">Sale Info</h2>

        <div class="grid grid-cols-2 gap-4">
          <p><strong>Listing Price:</strong> {{ sale.listing_price }}</p>
          <p><strong>Selling Price:</strong> {{ sale.selling_price }}</p>
          <p>
            <strong>Status:</strong>
            <span
              class="px-3 py-1 rounded-full text-white text-xs font-semibold"
              :class="{
                'bg-green-600': sale.status === 'active',
                'bg-yellow-600': sale.status === 'pending',
                'bg-red-600': sale.status === 'cancelled'
              }"
            >
              {{sale.status }}
            </span>
          </p>
          <p><strong>Created At:</strong> {{ formatDate(sale.created_at) }}</p>
        </div>
      </div>

      <!-- Links Card -->
      <div class="bg-white shadow-lg rounded-lg p-6 space-y-3">
        <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-3">Links</h2>

        <!-- Property Link -->
        <div v-if="sale.property_id">
          <strong>Property:</strong>
          <button
            @click="goToPropertyDetail(sale.property_id.id)"
            class="ml-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          >
            <i class="fa fa-info-circle mr-2"></i> View Property
          </button>
        </div>

        <!-- Zone Link -->
        <div v-if="sale.property_zone_id">
          <strong>Zone:</strong>
          <button
            @click="goToZoneDetail(sale.property_zone_id.id)"
            class="ml-2 mt-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center"
          >
            <i class="fa fa-info-circle mr-2"></i> View Zone
          </button>
        </div>

        <!-- Broker Link -->
        <div>
          <strong>Broker:</strong>
          <template v-if="sale.broker">
            <button
              @click="goToUserDetail(sale.broker)"
              class="ml-2 mt-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <i class="fa fa-info-circle mr-2"></i> View Broker
            </button>
          </template>
          <span v-else class="ml-2 text-gray-500">No Broker</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      sale: null,
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchSale();
  },
  methods: {
    async fetchSale() {
      try {
        const id = this.$route.params.id;
        const res = await this.$apiGetById(`/get_property_zone_sale`, id);
        console.log("sale detail",res);
        this.sale = res;
      } catch (err) {
        console.error(err);
        this.error = "Failed to load property sale details.";
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toLocaleString() : "N/A";
    },
    capitalize(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    goToZoneDetail(id) {
      this.$router.push(`/zones/${id}`);
    },
    goToPropertyDetail(id) {
      this.$router.push(`/properties/${id}`);
    },
  },
};
</script>
