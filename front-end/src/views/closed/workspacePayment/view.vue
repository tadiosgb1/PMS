<template>
  <div class="p-6 min-h-screen bg-gray-100">
    <!-- Card Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Rental Payments</h1>
      <button
        @click="showModal = true"
        class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
      >
        Add Payment
      </button>
    </div>
    <!-- Table Card -->
    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="w-full text-left">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2">Amount</th>
            <th class="px-4 py-2">Cycle Start</th>
            <th class="px-4 py-2">Cycle End</th>
            <th class="px-4 py-2">Rental</th>
            <th class="px-4 py-2">Created At</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="payment in payments"
            :key="payment.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ payment.amount }}</td>
            <td class="px-4 py-2">{{ payment.cycle_start | formatDate }}</td>
            <td class="px-4 py-2">{{ payment.cycle_end | formatDate }}</td>
            <td class="px-4 py-2">{{ payment.rental_name || payment.rental }}</td>
            <td class="px-4 py-2">{{ payment.created_at | formatDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add Rental Payment Modal -->
    <AddRentalPayment
      :visible="showModal"
      :rental="selectedRental"
      @close="showModal = false"
      @success="fetchPayments"
    />
  </div>
</template>

<script>
import AddRentalPayment from "./add.vue"; // your modal component

export default {
  name: "RentalPaymentsView",
  components: { AddRentalPayment },
  data() {
    return {
      showModal: false,
      payments: [],
      selectedRental: null, // pass rental id if needed
    };
  },
  filters: {
    formatDate(value) {
      if (!value) return "";
      return new Date(value).toLocaleDateString();
    },
  },
  mounted() {
    this.fetchPayments();
  },
  methods: {
    async fetchPayments() {
      try {
        const res = await this.$apiGet("/get_rental_payments");
        this.payments = res.data || [];
      } catch (err) {
        console.error("Failed to fetch rental payments:", err);
      }
    },
  },
};
</script>
