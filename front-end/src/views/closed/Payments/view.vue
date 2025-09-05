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
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        ]"
      >
        {{ tab }}
      </button>
    </div>

    <!-- Subscription Payments -->
    <div v-if="activeTab === 'Subscription Payments'" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold mb-4">Subscription Payments</h2>
      <table class="w-full border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2 text-left">User</th>
            <th class="border p-2 text-left">Plan</th>
            <th class="border p-2 text-left">Amount</th>
            <th class="border p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in subscriptionPayments" :key="i" class="hover:bg-gray-50">
            <td class="border p-2">{{ item.user }}</td>
            <td class="border p-2">{{ item.plan }}</td>
            <td class="border p-2">{{ item.amount }}</td>
            <td class="border p-2">{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Sales Payments -->
    <div v-if="activeTab === 'Sales Payments'" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold mb-4">Sales Payments</h2>
      <table class="w-full border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2 text-left">Invoice</th>
            <th class="border p-2 text-left">Customer</th>
            <th class="border p-2 text-left">Amount</th>
            <th class="border p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in salesPayments" :key="i" class="hover:bg-gray-50">
            <td class="border p-2">{{ item.invoice }}</td>
            <td class="border p-2">{{ item.customer }}</td>
            <td class="border p-2">{{ item.amount }}</td>
            <td class="border p-2">{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Rent Payments -->
    <div v-if="activeTab === 'Rent Payments'" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-lg font-bold mb-4">Rent Payments</h2>
      <table class="w-full border-collapse border border-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th class="border p-2 text-left">Tenant</th>
            <th class="border p-2 text-left">Property</th>
            <th class="border p-2 text-left">Rent Type</th>
            <th class="border p-2 text-left">Amount</th>
            <th class="border p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in rentPayments" :key="i" class="hover:bg-gray-50">
            <td class="border p-2">{{ item.tenant }}</td>
            <td class="border p-2">{{ item.property }}</td>
            <td class="border p-2">{{ item.type }}</td>
            <td class="border p-2">{{ item.amount }}</td>
            <td class="border p-2">{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: "Subscription Payments",
      tabs: ["Subscription Payments", "Sales Payments", "Rent Payments"],
      subscriptionPayments: [
        { user: "Alice", plan: "Gold", amount: "$50", date: "2025-09-01" },
        { user: "Bob", plan: "Silver", amount: "$30", date: "2025-08-28" },
      ],
      salesPayments: [
        { invoice: "#1001", customer: "Charlie", amount: "$200", date: "2025-09-01" },
        { invoice: "#1002", customer: "David", amount: "$150", date: "2025-08-29" },
      ],
      rentPayments: [
        { tenant: "Eve", property: "Apartment A", type: "Monthly", amount: "$500", date: "2025-09-01" },
        { tenant: "Frank", property: "Shop B", type: "Quarterly", amount: "$1200", date: "2025-08-20" },
      ],
    };
  },
};
</script>
