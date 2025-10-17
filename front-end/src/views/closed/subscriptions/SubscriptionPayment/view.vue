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
              class="w-full md:w-auto max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            <!-- Payment Method -->
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
          <div
            v-if="statusFilter && statusFilter !== 'pending'"
            class="mb-4 text-sm font-semibold text-gray-700"
          >
            Total {{ statusFilter }} Amount:
            <span class="text-orange-600">{{ totalAmountByStatus }}</span>
          </div>

          <!-- Table View (Desktop) -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full border border-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-3 py-2 text-left">Transaction ID</th>
                  <th class="px-3 py-2 text-left">Subscription</th>
                  <th class="px-3 py-2 text-left">Owner</th>
                  <th class="px-3 py-2 text-left">Payment Method</th>
                  <th class="px-3 py-2 text-left">Amount</th>
                  <th class="px-3 py-2 text-left">Created At</th>
                  <th class="px-3 py-2 text-left">End Date</th>
                  <th class="px-3 py-2 text-left">Plan</th>
                  <th class="px-3 py-2 text-left">Status</th>
                  <th class="px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in filteredAndSortedPayments"
                  :key="p.id"
                  class="border-t hover:bg-gray-50"
                >
                  <td class="px-3 py-2">{{ p.transaction_id }}</td>
                  <td class="px-3 py-2">
                    <button
                      @click="goToSubDetail(p.subscription_id)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                  </td>
                  <td class="px-3 py-2">
                    <button
                      @click="goToUserDetail(p.user_id)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      View
                    </button>
                  </td>
                  <td class="px-3 py-2">{{ p.payment_method }}</td>
                  <td class="px-3 py-2">{{ p.amount }}</td>
                  <td class="px-3 py-2">{{ p.created_at || "-" }}</td>
                  <td class="px-3 py-2">{{ p.end_date || "-" }}</td>
                  <td class="px-3 py-2">{{ p.planName }}</td>
                  <td class="px-3 py-2">
                    <span
                      class="px-2 py-1 rounded text-xs font-semibold"
                      :class="{
                        'bg-green-100 text-green-700': p.status === 'paid',
                        'bg-yellow-100 text-yellow-700': p.status === 'pending',
                        'bg-red-100 text-red-700': p.status === 'canceled',
                      }"
                    >
                      {{ p.status }}
                    </span>
                  </td>
                  <td class="px-3 py-2 text-center">
                    <button
                      v-if="p.status === 'pending' || p.status === 'canceled'"
                      @click="approve(p)"
                      class="text-blue-600 hover:text-blue-800"
                    >
                      Approve
                    </button>
                    <button
                      v-if="p.status === 'pending' || p.status === 'paid'"
                      @click="reject(p)"
                      class="ml-2 text-red-600 hover:text-red-800"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSortedPayments.length === 0">
                  <td colspan="10" class="text-center py-4 text-gray-500">
                    No subscription payments found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Card List View (Mobile & Tablet) -->
          <div class="md:hidden grid gap-4">
            <div
              v-for="p in filteredAndSortedPayments"
              :key="p.id"
              class="border border-gray-200 rounded-lg shadow-sm p-4 bg-white"
            >
              <div class="flex justify-between mb-2">
                <span class="font-semibold text-gray-800"
                  >Transaction ID:</span
                >
                <span>{{ p.transaction_id }}</span>
              </div>
              <div class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Amount:</span> {{ p.amount }} ETB
              </div>
              <div class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Payment:</span> {{ p.payment_method }}
              </div>
              <div class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Created:</span>
                {{ p.created_at || "-" }}
              </div>
              <div class="text-sm text-gray-600 mb-1">
                <span class="font-medium">Plan:</span> {{ p.planName }}
              </div>
              <div class="text-sm text-gray-600 mb-2">
                <span class="font-medium">Status:</span>
                <span
                  class="px-2 py-1 rounded text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-700': p.status === 'paid',
                    'bg-yellow-100 text-yellow-700': p.status === 'pending',
                    'bg-red-100 text-red-700': p.status === 'canceled',
                  }"
                >
                  {{ p.status }}
                </span>
              </div>

              <div class="flex justify-between mt-3 text-sm">
                <button
                  @click="goToSubDetail(p.subscription_id)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Subscription Detail
                </button>
                <button
                  @click="goToUserDetail(p.user_id)"
                  class="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Owner Detail
                </button>
              </div>

              <div class="flex justify-end mt-3 space-x-3">
                <button
                  v-if="p.status === 'pending' || p.status === 'canceled'"
                  @click="approve(p)"
                  class="text-blue-600 hover:text-blue-800"
                >
                  Approve
                </button>
                <button
                  v-if="p.status === 'pending' || p.status === 'paid'"
                  @click="reject(p)"
                  class="text-red-600 hover:text-red-800"
                >
                  Reject
                </button>
              </div>
            </div>

            <div v-if="filteredAndSortedPayments.length === 0" class="text-center py-6 text-gray-500">
              No subscription payments found.
            </div>
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
            <span>Page {{ currentPage }} of {{ totalPages }}</span>
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

export default {
  name: "subscriptionPaymentView",
  components: { Toast },
  data() {
    return {
      payments: [],
      searchTerm: "",
      statusFilter: "",
      sortKey: "payment_method",
      sortAsc: true,
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      payment_method: "",
    };
  },
  computed: {
    filteredAndSortedPayments() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.payments.filter((p) =>
        Object.values(p).some((val) =>
          String(val || "").toLowerCase().includes(term)
        )
      );
      if (this.statusFilter) {
        filtered = filtered.filter((p) => p.status === this.statusFilter);
      }
      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });
      return filtered;
    },
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
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    goToSubDetail(id) {
      this.$router.push(`/sub-detail/${id}`);
    },
    async fetchPayments(page = 1) {
      try {
        let params;
        if (localStorage.getItem("is_superuser") === "true") {
          params = {
            page,
            page_size: this.perPage,
            payment_method: this.payment_method,
            subscription_id: this.$route.params.id,
          };
        } else {
          params = {
            user_id: localStorage.getItem("userId"),
            page,
            page_size: this.perPage,
            payment_method: this.payment_method,
            subscription_id: this.$route.params.id,
          };
        }

        const response = await this.$apiGet("/get_subscription_payment", params);
        this.payments = response.data || [];
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.next = response.next;
        this.previous = response.previous;

        await Promise.all(
          this.payments.map(async (payment) => {
            if (payment.user_id) {
              const ownerRes = await this.$apiGetById("get_user", payment.user_id);
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
        const response = await this.$apiGet(url);
        this.payments = response.data || [];
        this.currentPage = response.current_page;
        this.totalPages = response.total_pages;
        this.next = response.next;
        this.previous = response.previous;
      } catch (error) {
        console.error("Failed to fetch page:", error);
      }
    },
    async approve(payment) {
      const payload = { id: payment.id, status: "paid" };
      const res = await this.$apiPatch(`/update_subscription_payment`, payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast("Payment Approved Successfully", "success");
        const subPayload = { id: res.subscription_id, status: "active" };
        const resSub = await this.$apiPatch(`/update_subscription`, res.subscription_id, subPayload);
        if (resSub) {
          this.$root.$refs.toast.showToast("Subscription activated successfully!", "success");
          this.$reloadPage();
        }
      }
    },
    async reject(payment) {
      const payload = { id: payment.id, status: "canceled" };
      const res = await this.$apiPatch(`/update_subscription_payment`, payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast("Payment Disapproved Successfully", "success");
        const subPayload = { id: res.subscription_id, status: "pending" };
        const resSub = await this.$apiPatch(`/update_subscription`, res.subscription_id, subPayload);
        if (resSub) {
          this.$root.$refs.toast.showToast("Subscription status updated successfully!", "success");
          this.$reloadPage();
        }
      }
    },
  },
};
</script>
