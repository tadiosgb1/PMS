<template>
  <div class="bg-white shadow rounded-lg">
    <!-- Header -->
    <div class="bg-blue-600 text-white px-6 py-3 text-lg font-bold">
      Rent Payments
    </div>

    <!-- Table -->
    <div class="p-4 overflow-x-auto">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left">#</th>
            <th class="px-3 py-2 text-left">Tenant</th>
            <th class="px-3 py-2 text-left">Property</th>
            <th class="px-3 py-2 text-left">Amount</th>
            <th class="px-3 py-2 text-left">Payment Date</th>
            <th class="px-3 py-2 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in payments" :key="index" class="border-t">
            <td class="px-3 py-2">{{ index + 1 }}</td>
            <td class="px-3 py-2">{{ payment.tenant }}</td>
            <td class="px-3 py-2">{{ payment.property }}</td>
            <td class="px-3 py-2">{{ payment.amount }} ETB</td>
            <td class="px-3 py-2">{{ payment.date }}</td>
            <td class="px-3 py-2">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="{
                  'bg-green-100 text-green-800': payment.status === 'Paid',
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
  name: "RentPayments",
  data() {
    return {
      payments: [
        {
          tenant: "John Doe",
          property: "Apartment A101",
          amount: 5000,
          date: "2025-08-01",
          status: "Pending"
        },
        {
          tenant: "Jane Smith",
          property: "Villa B203",
          amount: 15000,
          date: "2025-08-10",
          status: "Paid"
        },
        {
          tenant: "Michael Brown",
          property: "House C305",
          amount: 8000,
          date: "2025-08-15",
          status: "Paid"
        }
      ]
    };
  }
};
</script>
