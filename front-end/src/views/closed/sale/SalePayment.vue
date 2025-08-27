<template>
  <div class="bg-white shadow rounded-lg">
    <!-- Header -->
    <div class="bg-green-600 text-white px-6 py-3 text-lg font-bold">
      Sale Payments
    </div>

    <!-- Table -->
    <div class="p-4 overflow-x-auto">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left">#</th>
            <th class="px-3 py-2 text-left">Buyer</th>
            <th class="px-3 py-2 text-left">Property</th>
            <th class="px-3 py-2 text-left">Amount</th>
            <th class="px-3 py-2 text-left">Payment Date</th>
            <th class="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in payments" :key="index" class="border-t">
            <td class="px-3 py-2">{{ index + 1 }}</td>
            <td class="px-3 py-2">{{ payment.buyer }}</td>
            <td class="px-3 py-2">{{ payment.property }}</td>
            <td class="px-3 py-2">{{ payment.amount }} ETB</td>
            <td class="px-3 py-2">{{ payment.date }}</td>
            <td class="px-3 py-2">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="{
                  'bg-green-100 text-green-800': payment.status === 'Completed',
                  'bg-yellow-100 text-yellow-800': payment.status === 'Partial',
                  'bg-red-100 text-red-800': payment.status === 'Pending'
                }"
              >
                {{ payment.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: "SalePayments",
  data() {
    return {
      payments: [
        {
          buyer: "Alice Johnson",
          property: "Land Plot D10",
          amount: 500000,
          date: "2025-08-05",
          status: "Completed"
        },
        {
          buyer: "David Wilson",
          property: "Apartment E22",
          amount: 300000,
          date: "2025-08-12",
          status: "Partial"
        },
        {
          buyer: "Sophia Martinez",
          property: "Villa F07",
          amount: 1200000,
          date: "2025-08-20",
          status: "Pending"
        }
      ]
    };
  }
};
</script>
