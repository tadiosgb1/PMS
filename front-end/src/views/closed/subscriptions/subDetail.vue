<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Subscription Detail</h1>

    <div v-if="loading" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <div v-else-if="subscription" class="space-y-4">
      <div class="border rounded-lg p-4 shadow bg-white">
        <h2 class="text-lg font-semibold">Subscription Info</h2>
        <p><strong>ID:</strong> {{ subscription.id }}</p>
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
        <p><strong>User ID:</strong> {{ subscription.user_id }}</p>
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
        const id = this.$route.params.id; // get id from route
        console.log("Fetching subscription for id:", id);

        // Assume $apiGetById returns the object directly (not under .data)
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
  },
};
</script>
