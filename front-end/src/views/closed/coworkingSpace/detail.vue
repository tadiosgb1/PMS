<template>
  <div class="p-6 ">
    <h1 class="text-md font-bold mb-6 text-gray-800">Coworking Space Details</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 text-center py-10">Loading coworking space...</div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 text-center py-10">{{ error }}</div>

    <!-- Coworking Space Info -->
    <div v-else-if="space" class="bg-white shadow-lg rounded-lg p-6 space-y-6">

      <!-- Basic Info -->
      <div class="border-b pb-4">
        <h2 class="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Basic Info</h2>
        <p><strong>Name:</strong> {{ space.name }}</p>
        <p><strong>Location:</strong> {{ space.location }}</p>
        <p><strong>Description:</strong> {{ space.description }}</p>
        <p><strong>Capacity:</strong> {{ space.capacity }} people</p>
      </div>

      <!-- Pricing Info -->
      <div class="border-b pb-4">
        <h2 class="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Pricing</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <p><strong>Daily:</strong> {{ space.price_daily }}</p>
          <p><strong>Monthly:</strong> {{ space.price_monthly }}</p>
          <p><strong>Quarterly:</strong> {{ space.price_quarterly }}</p>
          <p><strong>Yearly:</strong> {{ space.price_yearly }}</p>
        </div>
      </div>

      <!-- Metadata -->
      <div>
        <h2 class="text-md font-semibold text-gray-700 mb-3 border-b pb-2">Metadata</h2>
        <p><strong>Created At:</strong> {{ formatDate(space.created_at) }}</p>
        <p><strong>Updated At:</strong> {{ formatDate(space.updated_at) }}</p>
        <p><strong>Zone:</strong>  <button
                      @click="goToZoneDetail(space.zone)"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                      title="View Payment"
                    >
                      View Zone
                    </button></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      space: null,
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchSpace();
  },
  methods: {
    goToZoneDetail(id) {
      this.$router.push(`/zones/${id}`);
    },

    async fetchSpace() {
      try {
        const id = this.$route.params.id;
        const res = await this.$apiGetById(`/get_coworking_space`, id);
        this.space = res; // Use res directly
      } catch (err) {
        console.error(err);
        this.error = "Failed to load coworking space details.";
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
