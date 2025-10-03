<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Property Sale Detail</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- Only render once sale is loaded -->
    <div v-else-if="sale" class="space-y-4">
      <!-- Sale Info -->
      <div class="border rounded-lg p-4 shadow bg-white">
        <h2 class="text-lg font-semibold">Sale Info</h2>
        <!-- <p><strong>ID:</strong> {{ sale.id }}</p> -->
        <p><strong>Listing Price:</strong> ${{ sale.listing_price }}</p>
        <p><strong>Selling Price:</strong> ${{ sale.selling_price }}</p>
        <p>
          <strong>Status:</strong>
          <span
            class="px-3 py-1 rounded-full text-white text-xs font-semibold"
            :class="{
              'bg-green-600': sale.status === 'completed',
              'bg-yellow-600': sale.status === 'pending',
              'bg-red-600': sale.status === 'cancelled'
            }"
          >
            {{ sale.status }}
          </span>
        </p>
        <p><strong>Created At:</strong> {{ formatDate(sale.created_at) }}</p>
      </div>

      <!-- Links -->
      <div class="border rounded-lg p-4 shadow bg-white">
        <h2 class="text-lg font-semibold">Links</h2>

        <!-- Property Link -->
        <p v-if="sale.property_id">
          <strong>Property:</strong>
          

            <button @click="goToPropertyDetail(sale.property_id.id)" class="px-1  rounded bg-blue-500 text-white hover:bg-blue-600">
                    <i class="fa fa-info-circle mr-2"></i> Zone Detail
                  </button>
        </p>

        <!-- Zone Link -->
        <p v-if="sale.property_zone_id">
          <strong class="">Zone:</strong>
       

                  <button @click="goToZoneDetail(sale.property_zone_id.id)" class="mt-3 px-1  rounded bg-blue-500 text-white hover:bg-blue-600">
                    <i class="fa fa-info-circle mr-2"></i> Zone Detail
                  </button>
        </p>

        <!-- Broker Link -->
        <p v-if="sale.broker">
          <strong>Broker:</strong>
          <button @click="goToUserDetail(sale.broker)" class="mt-3 px-1  rounded bg-blue-500 text-white hover:bg-blue-600">
                    <i class="fa fa-info-circle mr-2"></i> Zone Detail
                  </button>
        </p>
        <p v-else> <span class="mr-2">Broker:</span>No Broker</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["id"],
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
     goToUseretail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
      goToZoneDetail(id) {
      this.$router.push(`/zones/${id}`);
    },
    goToPropertyDetail(id) {
      this.$router.push(`/properties/${id}`);
    },
    async fetchSale() {
      try {
        const id = this.$route.params.id;
        console.log("id", id);

        const res = await this.$apiGetById(`/get_property_zone_sale`, id);
        console.log("res", res);

        this.sale = res; // res already contains the object
        console.log("sale", this.sale);
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
  },
};
</script>
