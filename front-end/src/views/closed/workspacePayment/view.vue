<template>
  <div class="p-6 min-h-screen bg-gray-100">
    <Toast ref="toast" />

    <!-- Card Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Work Space Payments</h1>
      <button
        @click="showModal = true"
        class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
      >
        Add Payment
      </button>
    </div>

    <!-- Controls -->
    <div class="flex justify-between items-center mb-4">
      <!-- Search -->
      <input
        v-model="searchTerm"
        @input="fetchPayments(1)"
        type="search"
        placeholder="Search payments..."
        class="px-3 py-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- Show page size -->
      <div class="ml-4">
        <label class="mr-2 text-sm text-gray-600">Show</label>
        <select v-model.number="perPage" @change="fetchPayments(1)" class="px-2 py-1 border rounded">
          <option v-for="n in [5,10,20,50,100,1000]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Table Card -->
    <div class="overflow-x-auto bg-white shadow rounded-lg">
      <table class="w-full text-left">
        <thead class="bg-gray-200">
          <tr>
            <th class="px-4 py-2">#</th>
            <th class="px-4 py-2">Rental Info</th>
            <th class="px-4 py-2">Amount</th>
            <th class="px-4 py-2">Cycle Start</th>
            <th class="px-4 py-2">Cycle End</th>
            <th class="px-4 py-2">Paid At</th>
            <th class="px-4 py-2">Created At</th>
            <th class="px-4 py-2">Updated At</th>
            <th class="px-4 py-2">Rental ID</th>
            <th class="px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(payment, index) in filteredPayments"
            :key="payment.id"
            class="border-b hover:bg-gray-50"
          >
            <td class="px-4 py-2">{{ index + 1 + (currentPage - 1) * perPage }}</td>
            <td class="px-4 py-2">{{ payment.rental_info }}</td>
            <td class="px-4 py-2">{{ payment.amount }} ETB</td>
            <td class="px-4 py-2">{{ formatDate(payment.cycle_start) }}</td>
            <td class="px-4 py-2">{{ formatDate(payment.cycle_end) }}</td>
            <td class="px-4 py-2">{{ formatDate(payment.paid_at) }}</td>
            <td class="px-4 py-2">{{ formatDate(payment.created_at) }}</td>
            <td class="px-4 py-2">{{ payment.updated_at ? formatDate(payment.updated_at) : "-" }}</td>
            <td class="px-4 py-2">{{ payment.rental }}</td>
            <td class="px-4 py-2 text-center">
              <button
                v-if="payment.status !== 'paid'"
                @click="approve(payment)"
                class="text-blue-600 hover:text-blue-800 focus:outline-none mr-2"
              >
                Approve
              </button>
              <button
                v-else
                @click="disApprove(payment)"
                class="text-red-600 hover:text-red-800 focus:outline-none"
              >
                Disapprove
              </button>
            </td>
          </tr>
          <tr v-if="filteredPayments.length === 0">
            <td colspan="10" class="px-4 py-4 text-center text-gray-500">
              No payments found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center mt-4 text-sm text-gray-600">
      <button
        @click="fetchUrl(previous)"
        :disabled="!previous"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="fetchUrl(next)"
        :disabled="!next"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
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
import AddRentalPayment from "./add.vue";
export default {
  name: "RentalPaymentsView",
  components: { AddRentalPayment },
  data() {
    return {
      showModal: false,
      payments: [],
      selectedRental: null,
      searchTerm: "",
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
    };
  },
  computed: {
    filteredPayments() {
      const term = this.searchTerm.toLowerCase();
      return this.payments.filter((p) =>
        Object.values(p).some((val) =>
          String(val || "").toLowerCase().includes(term)
        )
      );
    },
  },
  mounted() {
    this.fetchPayments(1);
  },
  methods: {
    async fetchPayments(page = 1) {
      try {
        const params = { page, page_size: this.perPage };
        const res = await this.$apiGet("/get_rental_payments", params);
        this.payments = Array.isArray(res.data) ? res.data : [];
        this.currentPage = res.current_page;
        this.totalPages = res.total_pages;
        this.next = res.next;
        this.previous = res.previous;
      } catch (err) {
        console.error(err);
        this.payments = [];
      }
    },
    async fetchUrl(url) {
      if (!url) return;
      try {
        const res = await this.$apiGet(url);
        this.payments = Array.isArray(res.data) ? res.data : [];
        this.currentPage = res.current_page;
        this.totalPages = res.total_pages;
        this.next = res.next;
        this.previous = res.previous;
      } catch (err) {
        console.error(err);
      }
    },
    async approve(payment) {
      const payload = { id: payment.id, status: "paid" };
      const res = await this.$apiPatch(`/update_rental_payments`, payment.id, payload);
      
      console.log("res for workspacepayment",res);

      if (res) {
        this.$root.$refs.toast.showToast("Payment Approved Successfully", "success");
        this.fetchPayments(this.currentPage);
      }
    },
    async disApprove(payment) {
      const payload = { id: payment.id, status: "pending" };
      const res = await this.$apiPatch(`/update_rental_payments`, payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast("Payment Disapproved Successfully", "success");
        this.fetchPayments(this.currentPage);
      }
    },
    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString();
    },
  },
};
</script>
