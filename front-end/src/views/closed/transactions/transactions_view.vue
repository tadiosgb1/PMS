<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-xl font-bold mb-6">Transactions</h1>

    <!-- Tabs -->
    <div class="flex space-x-4 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="[
          activeTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
          'px-4 py-2 rounded-lg font-semibold transition'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab content -->
    <div>
      <SaasTransactions v-if="activeTab === 'saas'" />
      <BrokerTransactions v-if="activeTab === 'broker'" />
    </div>
  </div>
</template>

<script>
import SaasTransactions from "./SaasTransactions.vue";
import BrokerTransactions from "./BrokerTransactions.vue";

export default {
  components: { SaasTransactions, BrokerTransactions },
  data() {
    return {
      tabs: [
        { key: "saas", label: "SaaS Transactions" },
        { key: "broker", label: "Broker Transactions" },
      ],
      activeTab: "saas",
    };
  },
};
</script>
