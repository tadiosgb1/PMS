<template>
  <div class="bg-white shadow rounded-lg">
    <Toast ref="toast" />

    <!-- Header -->
    <div class="bg-primary text-white px-6 py-3 text-lg font-bold flex justify-between items-center">
      Rent Payments
    </div>

    <!-- Controls -->
    <div class="flex justify-between items-center p-4">
      <!-- Search -->
      <input
        v-model="searchTerm"
        @input="fetchPayments(1)"
        type="search"
        placeholder="Search payments..."
        class="px-3 py-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

             <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Status</label>
              <select
                @change="filterByStatus(statusFilter)"
                v-model="statusFilter"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option value="all">All</option>
                <option value="complete">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

      <!-- Show -->
      <div class="ml-4">
        <label class="mr-2 text-sm text-gray-600">Show</label>
        <select v-model.number="perPage" @change="fetchPayments(1)" class="px-2 py-1 border rounded">
          <option v-for="n in [5, 10, 20, 50, 100, 1000]" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="p-4 overflow-x-auto">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left">#</th>
            <th class="px-3 py-2 text-left">Amount</th>
            <th class="px-3 py-2 text-left">Due Date</th>
            <th class="px-3 py-2 text-left">Payment Method</th>
            <th class="px-3 py-2 text-left">Transaction ID</th>
            <th class="px-3 py-2 text-left">Status</th>
            <th class="px-3 py-2 text-left">Created At</th>
            <th class="px-3 py-2 text-left">Updated At</th>
            <th class="px-3 py-2 text-left">Rent ID</th>
            <th class="px-3 py-2 text-left">User ID</th>
            <th class="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(payment, index) in filteredPayments" :key="payment.id" class="border-t">
            <td class="px-3 py-2">{{ index + 1 }}</td>
            <td class="px-3 py-2">{{ payment.amount }} ETB</td>
            <td class="px-3 py-2">{{ formatDate(payment.due_date) }}</td>
            <td class="px-3 py-2">{{ payment.payment_method }}</td>
            <td class="px-3 py-2">{{ payment.transaction_id }}</td>
            <td class="px-3 py-2">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="{
                  'bg-green-100 text-green-800': payment.status === 'paid',
                  'bg-red-100 text-red-800': payment.status === 'pending',
                }"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-3 py-2">{{ formatDate(payment.created_at) }}</td>
            <td class="px-3 py-2">{{ payment.updated_at ? formatDate(payment.updated_at) : "-" }}</td>
            <td class="px-3 py-2">{{ payment.rent_id }}</td>
            <td class="px-3 py-2">{{ payment.user_id }}</td>
            <td class="px-3 py-2 text-center">
            

                 <button
                       v-if="payment.status=='pending'  || payment.status=='cancelled'"
                      @click="approve(payment)"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                      Approve
                    </button>

                    <button
                      v-if="payment.status=='pending'  || payment.status=='complete'"
                      @click="reject(payment)"
                      class="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
                    >
                      Cancel
                    </button>
            </td>

            
          </tr>
          <tr v-if="filteredPayments.length === 0">
            <td colspan="11" class="px-3 py-4 text-center text-gray-500">No payments found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center p-4 text-sm text-gray-600">
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
</template>

<script>
export default {
  name: "RentPayments",
  data() {
    return {
      payments: [],
      searchTerm: "",
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      statusFilter:'all'
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

    async filterByStatus(status){
      let params={
       status:status,
      }
      if(status=='all'){
        params={}
      }

      const res = await this.$apiGet("/get_payments", params);
      this.payments = Array.isArray(res.data) ? res.data : [];
    },
    async fetchPayments(page = 1) {
      try {
        const params = { page, page_size: this.perPage };
        const res = await this.$apiGet("/get_payments", params);
        this.payments = Array.isArray(res.data) ? res.data : [];

        this.currentPage = res.current_page;
        this.totalPages = res.total_pages;
        this.next = res.next;
        this.previous = res.previous;
      } catch (error) {
        console.error(error);
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
      } catch (error) {
        console.error(error);
      }
    },
    async approve(payment) {
      const payload = { id: payment.id, status: "paid" };
      const res = await this.$apiPatch(`/update_payments`, payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast("Payment Approved Successfully", "success");
        this.fetchPayments(this.currentPage);
      }
    },
    async reject(payment) {
      const payload = { id: payment.id, status: "pending" };
      const res = await this.$apiPatch(`/update_payments`, payment.id, payload);
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
