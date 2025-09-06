<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
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

        <!-- Table -->
        <div class="p-6 overflow-x-auto">
          <table
            class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
          >
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="border border-gray-300 px-4 py-2">Amount</th>
                <th class="border border-gray-300 px-4 py-2">Method</th>
                <th class="border border-gray-300 px-4 py-2">Transaction ID</th>
                <th class="border border-gray-300 px-4 py-2">Due Date</th>
                <th class="border border-gray-300 px-4 py-2">Status</th>
                <th class="border border-gray-300 px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="payment in payments"
                :key="payment.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.amount | currency }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.payment_method }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.transaction_id }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.due_date }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  <span
                    :class="{
                      'text-green-600 font-semibold':
                        payment.status === 'completed',
                      'text-yellow-600 font-semibold':
                        payment.status === 'pending',
                      'text-red-600 font-semibold': payment.status === 'failed',
                    }"
                  >
                    {{ payment.status }}
                  </span>
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ payment.created_at }}
                </td>
              </tr>
              <tr v-if="payments.length === 0">
                <td colspan="6" class="text-center py-6 text-gray-500">
                  No payments found for this sale.
                </td>
              </tr>
            </tbody>
          </table>
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
      saleId: this.$route.params.saleId, // from router
    };
  },
  mounted() {
    this.fetchPayments();
  },
  methods: {
    async fetchPayments() {
      try {
        let params={};
        const id = this.$route.query.id;
        if(id){
          params={
          property_sale_id__id:id
          }
        }
        console.log("params",params);
        const res = await this.$apiGet(`/get_sales_payments`,params);
        console.log("res", res);
        this.payments = res.data || [];
      } catch (err) {
        console.error(err);
        // this.$refs.toast.showToast("Failed to load payments", "error");
        this.payments = [];
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
