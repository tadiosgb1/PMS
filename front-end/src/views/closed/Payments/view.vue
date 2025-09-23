<template>
  <div class="min-h-screen bg-gray-100 p-4 sm:p-6">
    <!-- Tabs -->
    <div class="flex flex-wrap sm:flex-nowrap gap-2 mb-4 sm:mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-3 sm:px-4 py-2 rounded-full text-sm font-semibold transition whitespace-nowrap',
          activeTab === tab
            ? 'bg-blue-600 text-white shadow'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Tab Content Wrapper -->
    <div class="space-y-4">
      <!-- Subscription Payments -->
      <div
        v-if="activeTab === 'Subscription Payments'"
        class="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto"
      >
        <subscriptionPayments />
      </div>

      <!-- Sales Payments -->
      <div
        v-if="activeTab === 'Sales Payments'"
        class="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto"
      >
        <salesPayments />
      </div>

      <!-- Rent Payments -->
      <div
        v-if="activeTab === 'Rent Payments'"
        class="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto"
      >
        <rent-payments />
      </div>

      <!-- Cowork Space Payments -->
      <div
        v-if="activeTab === 'Cowork Space Payments'"
        class="bg-white rounded-lg shadow p-4 sm:p-6 overflow-x-auto"
      >
        <coworkspacepayments />
      </div>
    </div>
  </div>
</template>

<script>
import subscriptionPayments from "../subscriptions/SubscriptionPayment/view.vue";
import rentPayments from "../rent/RentPayments.vue";
import salesPayments from "../SalesPayment/view.vue";
import coworkspacepayments from "../workspacePayment/view.vue";

export default {
  components: {
    rentPayments,
    salesPayments,
    subscriptionPayments,
    coworkspacepayments,
  },
  data() {
    return {
      activeTab: "Subscription Payments",
      tabs: [
        "Subscription Payments",
        "Sales Payments",
        "Rent Payments",
        "Cowork Space Payments",
      ],
    };
  },
};
</script>
