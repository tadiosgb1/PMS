<template>
  <div>
    <Toast ref="toast" />
    <div
      class="max-w-7xl p-4 mx-auto bg-white shadow rounded-lg overflow-hidden"
    >
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        &larr; Back
      </button>

      <!-- Broker Title -->
      <h1 v-if="broker" class="text-2xl font-bold mb-4">
        Broker Profile: {{ broker.license_number }}
      </h1>
      <p v-else>Loading...</p>

      <!-- Broker Details -->
      <div v-if="broker" class="grid grid-cols-2 gap-4 mb-6">
        <div class="mb-2"><strong>ID:</strong> {{ broker.id }}</div>
        <div class="mb-2"><strong>License Number:</strong> {{ broker.license_number }}</div>
        <div class="mb-2"><strong>Commission Rate:</strong> {{ broker.commission_rate }}%</div>
        <div class="mb-2"><strong>Wallet Balance:</strong> {{ broker.wallet }}</div>
        <div class="mb-2"><strong>Created At:</strong> {{ broker.created_at }}</div>
        <div class="mb-2"><strong>Updated At:</strong> {{ broker.updated_at }}</div>
        <div class="mb-2"><strong>User ID:</strong> {{ broker.user }}</div>
      </div>

      <!-- Placeholder for future sections -->
      <div v-if="broker" class="mt-10">
        <h2 class="text-xl font-semibold mb-2">Related Transactions</h2>
        <p class="text-gray-500">
          Future enhancement: show broker’s transaction history here.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "BrokerDetail",
  components: { Toast },
  data() {
    return {
      broker: null,
    };
  },
  mounted() {
    this.fetchBroker();
  },
  methods: {
    async fetchBroker() {
      try {
        const res = await this.$apiGet(
          `/get_broker_profile/${this.$route.params.id}`
        );
        this.broker = res.data || res;
      } catch (err) {
        console.error("Failed to fetch broker details", err);
        this.$refs.toast.showToast("Could not load broker details.", "error");
      }
    },
  },
};
</script>
