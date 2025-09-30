<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 m-3">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Workspace Payments
          <button
            v-if="!rentalId"
            @click="showModal = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add Payment
          </button>
        </div>

        <!-- Search & Page Size (hide in detail) -->
        <div v-if="!rentalId" class="p-6 flex justify-between items-center mb-6">
          <input
            v-model="searchTerm"
            @input="fetchPayments(1)"
            type="search"
            placeholder="Search payments..."
            class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="ml-4 flex items-center">
            <label class="mr-2 text-gray-700">Show</label>
            <select v-model="perPage" @change="fetchPayments(1)" class="border px-2 py-1 rounded">
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
            </select>
            <span class="ml-1 text-gray-700">per page</span>
          </div>
        </div>
{{ this.$route.params.id }}
        <!-- Table -->
        <div class="overflow-x-auto p-6">
          <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="border border-gray-300 px-4 py-2 cursor-pointer" @click="sortBy('rental_info')">
                  Rental Info
                  <SortIcon :field="'rental_info'" :sort-key="sortKey" :sort-asc="sortAsc" />
                </th>
                <th class="border border-gray-300 px-4 py-2">Amount</th>
                <th class="border border-gray-300 px-4 py-2">Cycle Start</th>
                <th class="border border-gray-300 px-4 py-2">Cycle End</th>
                <th class="border border-gray-300 px-4 py-2">Paid At</th>
                <th class="border border-gray-300 px-4 py-2">Status</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="payment in filteredAndSortedPayments" :key="payment.id" class="hover:bg-gray-100">
                <td class="border border-gray-300 px-4 py-2">{{ payment.rental_info }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ payment.amount }} ETB</td>
                <td class="border border-gray-300 px-4 py-2">{{ formatDate(payment.cycle_start) }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ formatDate(payment.cycle_end) }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ formatDate(payment.paid_at) }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ payment.status }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    v-if="payment.status !== 'paid'"
                    @click="approve(payment)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Approve
                  </button>
                  <button
                    v-else
                    @click="disApprove(payment)"
                    class="text-red-600 hover:text-red-800"
                  >
                    Disapprove
                  </button>
                </td>
              </tr>
              <tr v-if="filteredAndSortedPayments.length === 0">
                <td colspan="7" class="text-center py-6 text-gray-500">
                  No payments found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination (hide in detail) -->
        <div v-if="!rentalId" class="flex justify-between items-center p-6">
          <button
            :disabled="!previous"
            @click="fetchPayments(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            :disabled="!next"
            @click="fetchPayments(next)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Add Payment Modal -->
      <AddRentalPayment
        v-if="!rentalId"
        :visible="showModal"
        @close="showModal = false"
        @success="fetchPayments"
      />
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import AddRentalPayment from "./add.vue";

const SortIcon = {
  props: ["field", "sortKey", "sortAsc"],
  template: `
    <span class="inline-block ml-1 text-gray-500">
      <svg v-if="sortKey !== field" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
      <svg v-else-if="sortAsc" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13l4 4 4-4m0-6l-4-4-4 4"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
    </span>
  `,
};

export default {
  name: "WorkspacePaymentsView",
  components: { Toast, AddRentalPayment, SortIcon },
  data() {
    return {
      payments: [],
      searchTerm: "",
      perPage: 10,
      pageSizes: [5, 10, 20, 50, 100],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      showModal: false,
      sortKey: "rental_info",
      sortAsc: true,
    };
  },
  computed: {
    rentalId() {
      return this.$route.params.id || null; // detail mode if exists
    },
    filteredAndSortedPayments() {
      const term = this.searchTerm.toLowerCase();
      return this.payments
        .filter(
          (p) =>
            String(p.rental_info).toLowerCase().includes(term) ||
            String(p.status).toLowerCase().includes(term) ||
            String(p.amount).toLowerCase().includes(term)
        )
        .sort((a, b) => {
          let aVal = a[this.sortKey];
          let bVal = b[this.sortKey];
          if (typeof aVal === "string") aVal = aVal.toLowerCase();
          if (typeof bVal === "string") bVal = bVal.toLowerCase();
          if (aVal < bVal) return this.sortAsc ? -1 : 1;
          if (aVal > bVal) return this.sortAsc ? 1 : -1;
          return 0;
        });
    },
  },
  mounted() {
    this.fetchPayments();
  },
  watch: {
    "$route.params.id"() {
      this.fetchPayments();
    },
  },
  methods: {
    async fetchPayments(urlOrPage = null) {
      try {
        let params = {};
        let url = null;

        if (this.rentalId) {
          // detail mode: only fetch by rental_id
          params = { rental_id: this.rentalId };
        } else {
          // list mode
          if (typeof urlOrPage === "string") url = urlOrPage;
          else params = { page: urlOrPage || 1, page_size: this.perPage };
        }

       const res = await this.$getWorkspacePayments(null, params);
        this.payments = res.payments || [];
        this.currentPage = res.currentPage || 1;
        this.totalPages = res.totalPages || 1;
        this.next = res.next || null;
        this.previous = res.previous || null;
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        this.payments = [];
      }
    },

    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else this.sortKey = key;
    },

    approve(payment) {
      this.updatePaymentStatus(payment, "paid", "Payment Approved Successfully");
    },

    disApprove(payment) {
      this.updatePaymentStatus(payment, "pending", "Payment Disapproved Successfully");
    },

    async updatePaymentStatus(payment, status, message) {
      try {
        await this.$apiPatch("/update_rental_payments", payment.id, { status });
        this.$root.$refs.toast.showToast(message, "success");
        this.fetchPayments(this.currentPage);
      } catch (err) {
        console.error(err);
        this.$refs.toast.showToast("Failed to update payment", "error");
      }
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString();
    },
  },
};
</script>
