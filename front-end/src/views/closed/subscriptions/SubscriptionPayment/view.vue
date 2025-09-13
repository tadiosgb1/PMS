<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Subscription Payments
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add
          </button>
        </div>

        <div class="p-6">
          <!-- Search -->
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Payment..."
            class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
                    @click="sortBy('status')"
                  >
                    Status
                    <SortIcon
                      :field="'status'"
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
                  <th class="border border-gray-300 px-4 py-2">End Date</th>
                  <th class="border border-gray-300 px-4 py-2">User ID</th>
                  <th class="border border-gray-300 px-4 py-2">
                    Subscription ID
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
                    {{ p.status }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.transaction_id }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.created_at || "-" }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.end_date || "-" }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.ownerName }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ p.planName }}
                  </td>
                  <td
                    class="border border-gray-300 px-4 py-2 text-center space-x-2"
                  >
                    <button v-if="p.status!='paid'"
                      @click="approve(p)"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                      title="Edit"
                    >
                     Approve
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
        </div>
      </div>

      <!-- Modals -->
      <!-- <AddSubscriptionPayment
        v-if="visible"
        :visible="visible"
        :subscriptionId="this.$route.params.id"
        @close="visible = false"
        @refresh="fetchPayments"
      />  -->
      <!-- <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this payment?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
      <UpdateSubscriptionPayment
        v-if="updateVisible"
        :visible="updateVisible"
        :payment="paymentToEdit"
        @close="updateVisible = false"
        @refresh="fetchPayments"
      /> -->
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
// import ConfirmModal from "@/components/ConfirmModal.vue";
//import AddSubscriptionPayment from "@/views/closed/subscriptions/SubscriptionPayment/add.vue";
// import UpdateSubscriptionPayment from "@/views/closed/subscriptions/SubscriptionPayment/update.vue";

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
  components: {
    Toast,
    // ConfirmModal,
    //AddSubscriptionPayment,
    // UpdateSubscriptionPayment,
    SortIcon,
  },
  data() {
    return {
      payments: [],
      searchTerm: "",
      visible: false,

      confirmVisible: false,
      paymentToDelete: null,

      updateVisible: false,
      paymentToEdit: null,

      sortKey: "payment_method",
      sortAsc: true,
    };
  },
  computed: {
    filteredAndSortedPayments() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.payments.filter((p) =>
        Object.values(p).some((val) =>
          String(val || "")
            .toLowerCase()
            .includes(term)
        )
      );

      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });

      return filtered;
    },
  },
  mounted() {
    this.fetchPayments();
  },
  methods: {
  async approve(payment){
    console.log("Payment",payment);
    const payload={
      id:payment.id,
      status:"paid",
    }
    const res=await this.$apiPatch(`/update_subscription_payment`,payment.id,payload);
    console.log("res",res);
    if(res){
      alert("approved")
      console.log("subscription id",res.subscription_id);
      const subPayload={
        id:res.subscription_id,
        status:"active",
      }
      const resSub=await this.$apiPatch(`/update_subscription`,res.subscription_id,subPayload);
      if(resSub){
        alert("Subscription activated");
      }
    }
   
  },
   async fetchPayments() {
  try {
    let params = {};

    if (this.$route.params.id) {
      params = { subscription_id: this.$route.params.id };
    } else {
      params = { user_id: localStorage.getItem("userId") };
    }

    if (localStorage.getItem("is_superuser") === "true") {
      params = {};
    }

    console.log("params", params);
    const response = await this.$apiGet(`/get_subscription_payment`, params);

    if (Array.isArray(response.data)) {
      this.payments = response.data;

      // Fetch owner and plan name for each payment
      await Promise.all(
        this.payments.map(async (payment) => {
          // Fetch owner
          if (payment.user_id) {
            const ownerRes = await this.$apiGetById('get_user', payment.user_id);
            payment.ownerName = ownerRes.first_name || 'Unknown';
          }

          // Fetch plan name
          if (payment.subscription_id) {
            const planRes = await this.$apiGetById('get_subscription', payment.subscription_id);
            payment.planName = planRes.plan_name || 'Unknown Plan';
          }
        })
      );

    } else {
      this.payments = [];
      console.warn("Unexpected response:", response);
    }

  } catch (error) {
    console.error("Failed to fetch subscription payments:", error);
    this.payments = [];
    alert("Failed to load subscription payments.");
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
    editPayment(payment) {
      this.paymentToEdit = payment;
      this.updateVisible = true;
    },
    askDeleteConfirmation(payment) {
      this.paymentToDelete = payment;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const response = await this.$apiDelete(
          `/delete_subscription_payment/${this.paymentToDelete.id}`
        );
        this.$root.$refs.toast.showToast(response.message, "success");
        this.fetchPayments();
      } catch (error) {
        alert("Failed to delete subscription payment.");
        console.error(error);
      }
      this.paymentToDelete = null;
    },
  },
};
</script>
