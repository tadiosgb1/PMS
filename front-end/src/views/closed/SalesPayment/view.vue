<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 m-3">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Payments for Sale #{{ saleId }}
          <router-link
            to="/property_sales"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            Back
          </router-link>
        </div>

        <div class="p-6">
          <!-- Search + Show Dropdown -->
          <div class="flex justify-between items-center mb-4">
            <!-- Search -->
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search Payment..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              @input="fetchPayments(1)"
            />



            <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Status</label>
              <select
                @change="filterByStatus(statusFilter)"
                v-model="statusFilter"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="complete">Completed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

             <div class="flex items-center">
              <label class="mr-2 text-sm text-gray-600">Payment Method</label>
              <select
                @change="fetchPayments()"
                v-model="payment_method"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="Telle">Tellebirr</option>
                <option value="cbe">CBE</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            <!-- Show Dropdown -->
            <div class="ml-4">
              <label class="mr-2 text-sm text-gray-600">Show</label>
              <select
                v-model.number="perPage"
                @change="fetchPayments(1)"
                class="px-2 py-1 border rounded-md text-sm"
              >
                <option v-for="n in [5, 10, 20, 50, 100, 1000]" :key="n" :value="n">
                  {{ n }}
                </option>
              </select>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th class="border border-gray-300 px-4 py-2">Amount</th>
                  <th class="border border-gray-300 px-4 py-2">Method</th>
                  <th class="border border-gray-300 px-4 py-2">Transaction Id</th>
                  <!-- <th class="border border-gray-300 px-4 py-2">Due Date</th> -->
                  <th class="border border-gray-300 px-4 py-2">Status</th>
                  <th class="border border-gray-300 px-4 py-2">Created At</th>
                  <th class="border border-gray-300 px-4 py-2">Updated At</th>
                  <th class="border border-gray-300 px-4 py-2">Property Sale </th>
                  <th class="border border-gray-300 px-4 py-2">Buyer </th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="payment in filteredPayments"
                  :key="payment.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-4 py-2">{{ payment.amount | currency }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ payment.payment_method }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ payment.transaction_id }}</td>
                  <!-- <td class="border border-gray-300 px-4 py-2">{{ payment.due_date }}</td> -->
                  <td class="border border-gray-300 px-4 py-2 rounded-lg">
                    <span
                      :class="{
                        'bg-green-600 font-semibold text-white p-1 rounded-lg': payment.status === 'complete',
                        'bg-yellow-600 font-semibold text-white p-1 rounded-lg': payment.status === 'pending',
                        'bg-red-600 font-semibold text-white p-1 rounded-lg': payment.status === 'cancelled'
                      }"
                    >
                      {{ payment.status }}
                    </span>
                  </td>
                  <td class="border border-gray-300 px-4 py-2">{{ payment.created_at }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ payment.updated_at }}</td>
                  <td class="border border-gray-300 px-4 py-2">{{ payment.property_zone_sale_id }}  <button @click="goToSaleDetail(payment.property_zone_sale_id)" class="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                    <i class="fa fa-info-circle mr-2"></i> Detail
                  </button></td>
                                    <td class="border border-gray-300 px-4 py-2">{{ payment.buyer_id }} <button @click="goToUserDetail(payment.buyer_id)" class="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600">
                    <i class="fa fa-info-circle mr-2"></i> Detail
                  </button>
                </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
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
                  <td colspan="11" class="text-center py-6 text-gray-500">
                    No payments found for this sale.
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
      statusFilter:"all",
      payment_method:""
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

    async filterByStatus(status){

      let params={
        status:status,
      }
      if(status=='all'){
        params={}
      }
      
      const res = await this.$apiGet("/get_sales_payments", params);
       this.payments = res.data || [];
    },
    async fetchPayments(page = 1) {
      try {
        const params = { 
          page, page_size: this.perPage ,
          search:this.searchTerm,
          payment_method:this.payment_method
        };


        const id = this.$route.query.id;
        if (id) params.property_zone_sale_id__id = id;
        console.log("params for sale payments params",params);

        const res = await this.$apiGet("/get_sales_payments", params);
        this.payments = res.data || [];
        
        console.log("payments sale",this.payments);

        this.currentPage = res.current_page || 1;
        this.totalPages = res.total_pages || 1;
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
        this.payments = res.data || [];
        this.currentPage = res.current_page;
        this.totalPages = res.total_pages;
        this.next = res.next;
        this.previous = res.previous;
      } catch (err) {
        console.error(err);
      }
    },
    async approve(payment) {

     // alert("hii");

      const payload = { id: payment.id, status: "complete" };
      const res = await this.$apiPatch("/update_sales_payments", payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast(`Payment Approved Successfully`, "success");
        this.$reloadPage();
      }
    },
    async reject(payment) {
      const payload = { id: payment.id, status: "cancelled" };
      const res = await this.$apiPatch("/update_sales_payments", payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast(`Payment Disapproved Successfully`, "success");
        this.$reloadPage();
      }
    },
  },
  filters: {
    currency(value) {
      if (!value) return "";
      return new Intl.NumberFormat().format(value) + " USD";
    },
  },
};
</script>
