<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Tabs -->
    <div class="flex space-x-4 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab"
        @click="activeTab = tab"
        :class="[
          'px-4 py-2 rounded-full text-sm font-semibold transition',
          activeTab === tab
            ? 'bg-blue-600 text-white shadow'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300',
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Subscription Payments -->
    <div
      v-if="activeTab === 'Subscription Payments'"
      class="bg-white rounded-lg shadow p-6"
    >
      <subscriptionPayments />
    </div>

    <!-- Sales Payments -->
    <div
      v-if="activeTab === 'Sales Payments'"
      class="bg-white rounded-lg shadow p-6"
    >
      <salesPayments />
    </div>

    <!-- Rent Payments -->
    <div
      v-if="activeTab === 'Rent Payments'"
      class="bg-white rounded-lg shadow p-6"
    >
      <rent-payments />
    </div>
  </div>
</template>

<script>
import subscriptionPayments from "../subscriptions/SubscriptionPayment/view.vue";
import rentPayments from "../rent/RentPayments.vue";
import salesPayments from "../SalesPayment/view.vue";

export default {
  components: {
    rentPayments,
    salesPayments,
    subscriptionPayments,
  },
  data() {
    return {
      activeTab: "Subscription Payments",
      tabs: ["Subscription Payments", "Sales Payments", "Rent Payments"],
      subscriptionPayments: [
        { user: "Alice", plan: "Gold", amount: "$50", date: "2025-09-01" },
        { user: "Bob", plan: "Silver", amount: "$30", date: "2025-08-28" },
      ],
      salesPayments: [
        {
          invoice: "#1001",
          customer: "Charlie",
          amount: "$200",
          date: "2025-09-01",
        },
        {
          invoice: "#1002",
          customer: "David",
          amount: "$150",
          date: "2025-08-29",
        },
      ],
      rentPayments: [
        {
          tenant: "Eve",
          property: "Apartment A",
          type: "Monthly",
          amount: "$500",
          date: "2025-09-01",
        },
        {
          tenant: "Frank",
          property: "Shop B",
          type: "Quarterly",
          amount: "$1200",
          date: "2025-08-20",
        },
      ],
    };
  },
};
</script>
