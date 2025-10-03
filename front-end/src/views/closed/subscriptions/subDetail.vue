<template>
  <div class="p-6 ">
    <h1 class="text-lg font-bold mb-6 text-gray-800">Subscription Details</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-gray-500 text-center py-10">Loading subscription...</div>

    <!-- Error State -->
    <div v-else-if="error" class="text-red-500 text-center py-10">{{ error }}</div>

    <!-- Subscription Info -->
    <div v-else-if="subscription" class="bg-white shadow-md rounded-lg p-6 space-y-4">
      <h2 class="text-xl font-semibold text-gray-700 border-b pb-2 mb-4">Subscription Information</h2>

      <div class="grid grid-cols-2 gap-4">
        <p><strong>Plan Name:</strong> {{ subscription.plan_name }}</p>
        <p><strong>Price:</strong> ${{ subscription.price }}</p>
        <p><strong>Billing Cycle:</strong> {{ subscription.billing_cycle || 'N/A' }}</p>
        <p><strong>Status:</strong>
          <span
            class="px-3 py-1 rounded-full text-white text-xs font-semibold"
            :class="{
              'bg-green-600': subscription.status === 'active',
              'bg-yellow-600': subscription.status === 'pending',
              'bg-red-600': subscription.status === 'cancelled'
            }"
          >
            {{ capitalize(subscription.status) }}
          </span>
        </p>
        <p><strong>Start Date:</strong> {{ formatDate(subscription.start_date) }}</p>
        <p><strong>End Date:</strong> {{ formatDate(subscription.end_date) }}</p>
        <p><strong>Created At:</strong> {{ formatDate(subscription.created_at) }}</p>
      </div>

      <!-- User Detail Button -->
      <div class="pt-4">
        <button
          @click="goToUserDetail(subscription.user_id)"
          class="bg-primary hover:bg-primary text-white px-4 py-2 rounded shadow"
        >
          View User
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      subscription: null,
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchSubscription();
  },
  methods: {
    async fetchSubscription() {
      try {
        const id = this.$route.params.id;
        console.log("Fetching subscription for id:", id);

        const res = await this.$apiGetById(`/get_subscription`, id);
        console.log("Response:", res);

        this.subscription = res;
      } catch (err) {
        console.error(err);
        this.error = "Failed to load subscription details.";
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
  },
};
</script>
