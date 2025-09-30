<template>
  <div class="m-3">
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Subscription Payments
        </div>

        <div class="p-6">
          <!-- Search + Filters -->
          <div class="flex flex-wrap justify-between items-center mb-6 gap-4">
            <!-- Search -->
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search Payment..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="fetchPayments(1)"
            />

            <!-- Status Filter -->
            <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Status</label>
              <select
                v-model="statusFilter"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Show Dropdown -->
            <div>
              <label class="mr-2 text-sm text-gray-600">Show</label>
              <select
                v-model.number="perPage"
                @change="fetchPayments(1)"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option v-for="n in [5, 10, 20, 50, 100]" :key="n" :value="n">
                  {{ n }}
                </option>
              </select>
            </div>
          </div>

          <!-- Amount Summary -->
          <div v-if="statusFilter" class="mb-4 text-sm font-semibold text-gray-700">
            Total {{ statusFilter }} Amount:
            <span class="text-orange-600">{{ totalAmountByStatus }}</span>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table
              class="min-w-full table-auto border-collapse border border-gray-300"
            >
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('payment_method')"
                  >
                    Payment Method
                    <SortIcon
                      :field="'payment_method'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('amount')"
                  >
                    Amount
                    <SortIcon
                      :field="'amount'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                 
                  <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('transaction_id')"
                  >
                    Transaction ID
                    <SortIcon
                      :field="'transaction_id'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th class="border border-gray-300 px-4 py-2">Created At</th>
                  <th v-if="showEndDate" class="border border-gray-300 px-4 py-2">End Date</th>
                  <th class="border border-gray-300 px-4 py-2">Owner</th>
                  <th class="border border-gray-300 px-4 py-2">Plan</th>
                   <th
                    class="border border-gray-300 px-4 py-2 cursor-pointer"
                    @click="sortBy('status')"
                  >
                    Status
                    <SortIcon
                      :field="'status'"
                      :sort-key="sortKey"
                      :sort-asc="sortAsc"
                    />
                  </th>
                  <th class="border border-gray-300 px-4 py-2 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in filteredAndSortedPayments"
                  :key="p.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.payment_method }}
                  </td>


                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.amount }}
                  </td>


                  


                

                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.transaction_id }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.created_at || "-" }}
                  </td>
                  <td v-if="showEndDate" class="border border-gray-300 px-4 py-2">
                    {{ p.end_date || "-" }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.ownerName }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.planName }}
                  </td>
                   <td
                  class="px-4 py-2 border text-black font-medium rounded"
                  :class="{
                    'bg-yellow-500': p.status === 'pending',
                    'bg-red-500': p.status === 'canceled',
                    'bg-green-500': p.status === 'paid'
                  }"
                >
                  {{ p.status }}
                </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <button
                      v-if="p.status == 'canceled'  || p.status=='pending' "
                      @click="approve(p)"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      Approve
                    </button>

                    <button
                      v-if="p.status == 'paid'  || p.status=='pending' "
                      @click="reject(p)"
                      class="ml-3 text-red-600 hover:text-red-800 focus:outline-none"
                    >
                     Reject
                    </button>

                    
                  </td>
                </tr>
                <tr v-if="filteredAndSortedPayments.length === 0">
                  <td colspan="9" class="text-center py-6 text-gray-500">
                    No subscription payments found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div
            class="flex justify-between items-center mt-4 text-sm text-gray-600"
          >
            <button
              @click="fetchUrl(previous)"
              :disabled="!previous"
              class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span>
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="fetchUrl(next)"
              :disabled="!next"
              class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

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
  name: "subscriptionPaymentView",
  components: { Toast, SortIcon },
  data() {
    return {
      payments: [],
      searchTerm: "",
      statusFilter: "", // added filter
      sortKey: "payment_method",
      sortAsc: true,
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
    };
  },
  computed: {
    filteredAndSortedPayments() {
      const term = this.searchTerm.toLowerCase();

      // search
      let filtered = this.payments.filter((p) =>
        Object.values(p).some((val) =>
          String(val || "").toLowerCase().includes(term)
        )
      );

      // status filter
      if (this.statusFilter) {
        filtered = filtered.filter((p) => p.status === this.statusFilter);
      }

      // sort
      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });

      return filtered;
    },

    // total amount based on status filter
    totalAmountByStatus() {
      return this.filteredAndSortedPayments.reduce(
        (sum, p) => sum + (parseFloat(p.amount) || 0),
        0
      );
    },
  },
  mounted() {
    this.fetchPayments(1);
  },
  methods: {
    async fetchPayments(page = 1) {
      try {
        const params = {
          page: page,
          page_size: this.perPage,
        };

        const response = await this.$apiGet("/get_subscription_payment", params);

        this.payments = response.data || [];
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.next = response.next;
        this.previous = response.previous;

        // fetch owner + plan names
        await Promise.all(
          this.payments.map(async (payment) => {
            if (payment.user_id) {
              const ownerRes = await this.$apiGetById(
                "get_user",
                payment.user_id
              );
              payment.ownerName = ownerRes.first_name || "Unknown";
            }
            if (payment.subscription_id) {
              const planRes = await this.$apiGetById(
                "get_subscription",
                payment.subscription_id
              );
              payment.planName = planRes.plan_name || "Unknown Plan";
            }
          })
        );
      } catch (error) {
        console.error("Failed to fetch subscription payments:", error);
        this.payments = [];
      }
    },
    async fetchUrl(url) {
      if (!url) return;
      try {
        const response = await this.$apiGet(url); // direct URL
        this.payments = response.data || [];
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.next = response.next;
        this.previous = response.previous;
      } catch (error) {
        console.error("Failed to fetch page:", error);
      }
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    async approve(payment) {
      const payload = { id: payment.id, status: "paid" };
      const res = await this.$apiPatch(`/update_subscription_payment`, payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast(`Payment Approved Successfully`, 'success');
        const subPayload = { id: res.subscription_id, status: "active" };
        const resSub = await this.$apiPatch(`/update_subscription`, res.subscription_id, subPayload);
        if (resSub) {
          this.$root.$refs.toast.showToast(`Subscription activated successfully!`, 'success');
          this.$reloadPage();
        }
      }
    },
    async reject(payment) {
      const payload = { id: payment.id, status: "canceled" };
      const res = await this.$apiPatch(`/update_subscription_payment`, payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast(`Payment DisApproved Successfully`, 'success');
        const subPayload = { id: res.subscription_id, status: "pending" };
        const resSub = await this.$apiPatch(`/update_subscription`, res.subscription_id, subPayload);
        if (resSub) {
          this.$root.$refs.toast.showToast(`Subscription status updated successfully!`, 'success');
          this.$reloadPage();
        }
      }
    },
  },
};
</script>
