<template>
  <div class="m-3">
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Payments for Sale #{{ saleId }}
          <router-link
            to="/property_sales"
            class="bg-white text-blue-700 font-semibold px-3 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            Back
          </router-link>
        </div>

        <div class="p-6">
          <!-- Filters -->
          <div
            class="flex flex-wrap justify-between items-center mb-6 gap-4"
          >
            <!-- Search -->
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search Payment..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="fetchPayments(1)"
            />

            <!-- Status -->
            <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Status</label>
              <select
                v-model="statusFilter"
                @change="filterByStatus(statusFilter)"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="complete">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <!-- Payment Method -->
            <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Payment Method</label>
              <select
                v-model="payment_method"
                @change="fetchPayments(1)"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="Telle">Tellebirr</option>
                <option value="cbe">CBE</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <!-- Per Page -->
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

          <!-- TABLE VIEW (Desktop) -->
          <div class="hidden md:block overflow-x-auto">
            <table
              class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
            >
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th class="border border-gray-300 px-4 py-2">Amount</th>
                  <th class="border border-gray-300 px-4 py-2">Method</th>
                  <th class="border border-gray-300 px-4 py-2">Transaction ID</th>
                  <th class="border border-gray-300 px-4 py-2">Status</th>
                  <th class="border border-gray-300 px-4 py-2">Created At</th>
                  <th class="border border-gray-300 px-4 py-2">Updated At</th>
                  <th class="border border-gray-300 px-4 py-2">Property Sale</th>
                  <th class="border border-gray-300 px-4 py-2">Buyer</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="p in filteredPayments"
                  :key="p.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">{{ p.amount | currency }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ p.payment_method }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ p.transaction_id }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <span
                      :class="{
                        'bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold': p.status === 'complete',
                        'bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold': p.status === 'pending',
                        'bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold': p.status === 'cancelled'
                      }"
                    >
                      {{ p.status }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">{{ p.created_at }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ p.updated_at }}</td>
                  <td class="border border-gray-300 px-4 py-2">
                    <button
                      @click="goToSaleDetail(p.property_zone_sale_id)"
                      class="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
                    >
                      <i class="fa fa-info-circle mr-1"></i> Detail
                    </button>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    <button
                      @click="goToUserDetail(p.buyer_id)"
                      class="px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 text-xs"
                    >
                      <i class="fa fa-info-circle mr-1"></i> Detail
                    </button>
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <button
                      v-if="p.status=='pending' || p.status=='cancelled'"
                      @click="approve(p)"
                      class="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                    >
                      Approve
                    </button>
                    <button
                      v-if="p.status=='pending' || p.status=='complete'"
                      @click="reject(p)"
                      class="ml-2 text-red-600 hover:text-red-800 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredPayments.length === 0">
                  <td colspan="9" class="text-center py-6 text-gray-500">
                    No payments found for this sale.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- CARD VIEW (Mobile/Tablet) -->
          <div class="md:hidden space-y-4">
            <div
              v-for="p in filteredPayments"
              :key="p.id"
              class="bg-white border rounded-lg shadow-sm p-4"
            >
              <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Amount:</span>
                <span>{{ p.amount | currency }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Method:</span>
                <span>{{ p.payment_method }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Transaction:</span>
                <span>{{ p.transaction_id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="font-semibold text-gray-700">Status:</span>
                <span
                  :class="{
                    'bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold': p.status === 'complete',
                    'bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold': p.status === 'pending',
                    'bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold': p.status === 'cancelled'
                  }"
                >
                  {{ p.status }}
                </span>
              </div>
              <div class="text-sm text-gray-600 mt-2">
                Created: {{ p.created_at }}
              </div>

              <div class="flex justify-end mt-3 space-x-2">
                <button
                  @click="goToSaleDetail(p.property_zone_sale_id)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  Sale
                </button>
                <button
                  @click="goToUserDetail(p.buyer_id)"
                  class="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                >
                  Buyer
                </button>
                <button
                  v-if="p.status=='pending' || p.status=='cancelled'"
                  @click="approve(p)"
                  class="px-3 py-1 bg-green-600 text-white rounded text-xs"
                >
                  Approve
                </button>
                <button
                  v-if="p.status=='pending' || p.status=='complete'"
                  @click="reject(p)"
                  class="px-3 py-1 bg-red-600 text-white rounded text-xs"
                >
                  Cancel
                </button>
              </div>
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
  name: "salePaymentsView",
  components: { Toast },
  data() {
    return {
      payments: [],
      saleId: this.$route.params.saleId,
      searchTerm: "",
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      statusFilter: "",
      payment_method: "",
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
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    goToSaleDetail(id) {
      this.$router.push(`/property-sale/${id}`);
    },

    // ✅ unified fetch function that respects all filters
    async fetchPayments(page = 1) {
      try {
        const params = {
          page,
          page_size: this.perPage,
          search: this.searchTerm,
        };

        // ✅ add optional filters dynamically
        if (this.statusFilter && this.statusFilter !== "all") {
          params.status = this.statusFilter;
        }

        if (this.payment_method) {
          params.payment_method = this.payment_method;
        }

        // ✅ include sale ID filter if available
        const id = this.$route.query.id;
        if (id) {
          params.property_zone_sale_id__id = id;
        }

        console.log("Params for /get_sales_payments:", params);

        const res = await this.$apiGet("/get_sales_payments", params);
        this.payments = res.data || [];
        this.currentPage = res.current_page || 1;
        this.totalPages = res.total_pages || 1;
        this.next = res.next;
        this.previous = res.previous;
      } catch (err) {
        console.error("Error fetching payments:", err);
        this.payments = [];
      }
    },

    async fetchUrl(url) {
      if (!url) return;
      const res = await this.$apiGet(url);
      this.payments = res.data || [];
      this.currentPage = res.current_page;
      this.totalPages = res.total_pages;
      this.next = res.next;
      this.previous = res.previous;
    },

    // ✅ simplified — reuses fetchPayments() with filters
    async filterByStatus() {
      await this.fetchPayments(1);
    },

    async approve(payment) {
      const payload = { id: payment.id, status: "complete" };
      const res = await this.$apiPatch("/update_sales_payments", payment.id, payload);
      if (res) {
       // this.$root.$refs.toast.showToast("Payment Approved Successfully", "success");
        const salePayload={
         id:payment.property_zone_sale_id,
         status:"active"
        }

        console.log("payment",payment);
          const res = await this.$apiPatch("/update_property_zone_sale", payment.property_zone_sale_id, salePayload);
          console.log("res update the sale property",res);
        //this.fetchPayments(this.currentPage);
      }
    },

    async reject(payment) {
      const payload = { id: payment.id, status: "cancelled" };
      const res = await this.$apiPatch("/update_sales_payments", payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast("Payment Disapproved Successfully", "success");
        this.fetchPayments(this.currentPage);
      }
    },
  },
  filters: {
    currency(v) {
      return v ? new Intl.NumberFormat().format(v) + " USD" : "";
    },
  },
};
</script>
