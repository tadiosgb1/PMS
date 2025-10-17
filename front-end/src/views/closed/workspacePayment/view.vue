<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 m-3">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Workspace Payments
          <button
            v-if="!rentalId"
            @click="showModal = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300 flex items-center"
          >
            <span class="text-primary mr-1">+</span> Add Payment
          </button>
        </div>

        <!-- Filters & Search -->
        <div
          class="p-4 flex flex-col lg:flex-row gap-4 justify-between items-center"
        >
          <input
            v-model="searchTerm"
            @input="fetchPayments(1)"
            type="search"
            placeholder="Search payments..."
            class="w-full lg:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex flex-wrap gap-3 items-center justify-between w-full lg:w-auto">
            <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Status</label>
              <select
                @change="fetchPayments()"
                v-model="status"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Payment Method</label>
              <select
                @change="fetchPayments(1)"
                v-model="payment_method"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="tellebirr">Tellebirr</option>
                <option value="cash">Cash</option>
              </select>
            </div>

            <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Show</label>
              <select
                v-model="perPage"
                @change="fetchPayments(1)"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option
                  v-for="size in pageSizes"
                  :key="size"
                  :value="size"
                >
                  {{ size }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Table (Desktop) -->
        <div class="hidden md:block overflow-x-auto p-6">
          <table
            class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
          >
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="border border-gray-300 px-4 py-2">Rental Info</th>
                <th class="border border-gray-300 px-4 py-2">Amount</th>
                <th class="border border-gray-300 px-4 py-2">Transaction ID</th>
                <th class="border border-gray-300 px-4 py-2">Payment Method</th>
                <th class="border border-gray-300 px-4 py-2">Cycle Start</th>
                <th class="border border-gray-300 px-4 py-2">Cycle End</th>
                <th class="border border-gray-300 px-4 py-2">Paid At</th>
                <th class="border border-gray-300 px-4 py-2">Status</th>
                <th class="border border-gray-300 px-4 py-2 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="payment in filteredAndSortedPayments"
                :key="payment.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.rental_id }}
                  <button
                    @click="goToRentalDetail(payment.rental)"
                    class="text-blue-600 hover:text-blue-800"
                  >
                    View Detail
                  </button>
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.amount }} ETB
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.transaction_id }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.payment_method }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ formatDate(payment.cycle_start) }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ formatDate(payment.cycle_end) }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ formatDate(payment.paid_at) }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  <span
                    :class="{
                      'bg-green-600 text-white px-2 py-1 rounded': payment.status === 'paid',
                      'bg-yellow-500 text-white px-2 py-1 rounded': payment.status === 'pending',
                      'bg-red-600 text-white px-2 py-1 rounded': payment.status === 'cancelled'
                    }"
                  >
                    {{ payment.status }}
                  </span>
                </td>
                <td class="border border-gray-300 px-4 py-2 text-center">
                  <button
                    v-if="payment.status !== 'complete'"
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
                <td colspan="9" class="text-center py-6 text-gray-500">
                  No payments found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Responsive List (Mobile + Tablet) -->
        <div
          class="md:hidden p-4 grid gap-4 sm:grid-cols-2"
        >
          <div
            v-for="payment in filteredAndSortedPayments"
            :key="payment.id"
            class="bg-gray-50 border rounded-lg p-4 shadow-sm"
          >
            <div class="flex justify-between items-center mb-2">
              <h3 class="font-semibold text-gray-800">
                Rental #{{ payment.rental_id }}
              </h3>
              <span
                :class="{
                  'bg-green-600 text-white px-2 py-1 rounded': payment.status === 'paid',
                  'bg-yellow-500 text-white px-2 py-1 rounded': payment.status === 'pending',
                  'bg-red-600 text-white px-2 py-1 rounded': payment.status === 'cancelled'
                }"
              >
                {{ payment.status }}
              </span>
            </div>
            <p class="text-sm text-gray-600">
              <strong>Amount:</strong> {{ payment.amount }} ETB
            </p>
            <p class="text-sm text-gray-600">
              <strong>Method:</strong> {{ payment.payment_method }}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Transaction ID:</strong> {{ payment.transaction_id }}
            </p>
            <p class="text-sm text-gray-600">
              <strong>Cycle:</strong> {{ formatDate(payment.cycle_start) }} →
              {{ formatDate(payment.cycle_end) }}
            </p>
            <p class="text-sm text-gray-600 mb-3">
              <strong>Paid At:</strong> {{ formatDate(payment.paid_at) }}
            </p>
            <div class="flex justify-between items-center">
              <button
                @click="goToRentalDetail(payment.rental)"
                class="text-blue-600 font-medium hover:underline"
              >
                View Detail
              </button>
              <button
                v-if="payment.status !== 'complete'"
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
            </div>
          </div>

          <div v-if="filteredAndSortedPayments.length === 0" class="text-center text-gray-500">
            No payments found.
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="!rentalId"
          class="flex justify-between items-center p-6 text-sm text-gray-600"
        >
          <button
            :disabled="!previous"
            @click="fetchPayments(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
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
      payment_method:"",
      status:"",
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
    goToRentalDetail(id) {
      //console.log("id",id);
      this.$router.push(`/co-work-rental-detail/${id}`);
    },
    async fetchPayments(urlOrPage = null) {
      try {
        let params = {};
        let url = null;

        if (this.rentalId) {
          // detail mode: only fetch by rental_id
          params = { rental__id: this.rentalId ,
            payment_method:this.payment_method,
            status:this.status
          };
          
        } else {
          params.pament_method=this.payment_method;
          params.status=this.status;
          // list mode
          if (typeof urlOrPage === "string") url = urlOrPage;
          else params = { page: urlOrPage || 1, payment_method:this.payment_method, page_size: this.perPage };
        }

       const res = await this.$getWorkspacePayments(null, params);

       console.log("cow-payments",res);
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
      this.updatePaymentStatus(payment, "complete", "Payment Approved Successfully");
    },

    disApprove(payment) {
      this.updatePaymentStatus(payment, "pending", "Payment Disapproved Successfully");
    },

   async updatePaymentStatus(payment, status, message) {
  try {
    console.log("payment", payment);

    // 1️⃣ Update rental payment first
    const res1 = await this.$apiPatch("/update_rental_payment", payment.id, { status });

    if (res1 ) {
      // 2️⃣ Only if the first update succeeds, update workspace rental
      const payloadWorkspaceRental = { is_active: true };
      const res2 = await this.$apiPatch("/update_workspace_rental", payment.rental, payloadWorkspaceRental);

      if (res2) {
        this.$root.$refs.toast.showToast(message, "success");
        this.fetchPayments(this.currentPage);
      } else {
        this.$refs.toast.showToast("Failed to update workspace rental", "error");
      }
      this.$reloadPage();
    } else {
      this.$refs.toast.showToast("Failed to update rental payment", "error");
    }

  } catch (err) {
    console.error(err);
    this.$refs.toast.showToast("Something went wrong while updating payment", "error");
  }
}
,

    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString();
    },
  },
};
</script>
