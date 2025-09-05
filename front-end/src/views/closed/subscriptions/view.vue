<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Subscriptions
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add
          </button>
        </div>

        <div class="p-6">
          <!-- ✅ Search & Page Size -->
          <div class="flex justify-between items-center mb-6">
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Search subscriptions..."
              class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div class="ml-4">
              <label for="pageSize" class="mr-2 text-gray-700">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchSubscriptions()"
                class="border px-2 py-1 rounded"
              >
                <option v-for="size in pageSizes" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
              <span class="ml-1 text-gray-700">per page</span>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-x-auto">
            <table
              class="min-w-full table-auto border-collapse border border-gray-300"
            >
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th class="px-4 py-2 border">Plan Name</th>
                  <th class="px-4 py-2 border">Price</th>
                  <th class="px-4 py-2 border">Start Date</th>
                  <th class="px-4 py-2 border">End Date</th>
                  <th class="px-4 py-2 border">Status</th>
                  <th class="px-4 py-2 border">User ID</th>
                  <th class="px-4 py-2 border text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="subscription in filteredSubscriptions"
                  :key="subscription.id"
                  class="hover:bg-gray-100"
                >
                  <td class="px-4 py-2 border">{{ subscription.plan_name }}</td>
                  <td class="px-4 py-2 border">{{ subscription.price }}</td>
                  <td class="px-4 py-2 border">
                    {{ formatDate(subscription.start_date) }}
                  </td>
                  <td class="px-4 py-2 border">
                    {{ formatDate(subscription.end_date) }}
                  </td>
                  <td class="px-4 py-2 border">{{ subscription.status }}</td>
                  <td class="px-4 py-2 border">{{ subscription.user_id }}</td>
                  <td class="px-4 py-2 border text-center space-x-2">
                   
                   
                <button
  @click="pay(subscription)"
  class="relative px-4 py-2 text-green-600 border border-green-600 rounded-lg
         hover:text-white hover:bg-green-600
         transition duration-300 ease-in-out
         animate-glow"
  title="Pay"
>
  <i class="fas fa-credit-card mr-2"></i> Pay
</button>

                    <button
                      @click="payment(subscription.id)"
                      class="text-green-600 hover:text-green-800"
                      title="Subscription payments"
                    >
                      <i class="fas fa-info-circle"></i>Payments
                    </button>
                    <button
                      @click="edit(subscription)"
                      class="text-blue-600 hover:text-blue-800"
                      title="Edit"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="confirmDelete(subscription)"
                      class="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredSubscriptions.length === 0">
                  <td colspan="7" class="text-center text-gray-500 py-6">
                    No subscriptions found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ✅ Pagination -->
          <div class="flex justify-between items-center mt-4">
            <button
              :disabled="!previous"
              @click="fetchSubscriptions(previous)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-600"
              >Page {{ currentPage }} of {{ totalPages }}</span
            >
            <button
              :disabled="!next"
              @click="fetchSubscriptions(next)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Add & Update Modals -->
      <AddSubscription
        v-if="visible"
        :visible="visible"
        @close="visible = false"
        @refresh="fetchSubscriptions"
      />
      <UpdateSubscription
        v-if="updateVisible"
        :visible="updateVisible"
        :subscription="editing"
        @close="updateVisible = false"
        @refresh="fetchSubscriptions"
      />

      <!-- Payment Modal -->
      <PaymentModal
        v-if="paymentVisible"
        :visible="paymentVisible"
        :payload="paymentPayload"
        @close="paymentVisible = false"
        @paid="handlePaymentSuccess"
      />

      <!-- Confirm Delete Modal -->
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Delete Subscription"
        message="Are you sure you want to delete this subscription?"
        @confirm="deleteSubscription"
        @cancel="confirmVisible = false"
      />
    </div>
  </div>
</template>

<script>
import AddSubscription from "./add.vue";
import UpdateSubscription from "./update.vue";
import PaymentModal from "./Payment.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";

export default {
  name: "subscriptionView",
  components: {
    AddSubscription,
    UpdateSubscription,
    ConfirmModal,
    Toast,
    PaymentModal,
  },
  data() {
    return {
      subscriptions: [],
      searchTerm: "",
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      paymentVisible: false,
      paymentPayload: null,
      editing: null,
      deleting: null,

      // ✅ Pagination state
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
    };
  },
  computed: {
    filteredSubscriptions() {
      const term = this.searchTerm.toLowerCase();
      return this.subscriptions.filter((sub) =>
        Object.values(sub).some((val) =>
          String(val).toLowerCase().includes(term)
        )
      );
    },
  },
  mounted() {
    this.fetchSubscriptions();
  },
  methods: {
    async fetchSubscriptions(url = null) {
    try {
  let params = {
    user_id: localStorage.getItem("userId"),
  };

  // Make sure to compare properly (localStorage stores strings!)
  if (localStorage.getItem("is_superuser") === "true") {
    params = {}; // empty object instead of []
  }

  const pageUrl =
    url || `/get_subscription?page=1&page_size=${this.pageSize}`;

  const res = await this.$apiGet(pageUrl, params);

  this.subscriptions = res.data || [];
  this.currentPage = res.currentPage || 1;
  this.totalPages = res.totalPages || 1;
  this.next = res.next || null;
  this.previous = res.previous || null;
} catch (e) {
  console.error("Error fetching subscriptions", e);
  this.subscriptions = [];
  this.currentPage = 1;
  this.totalPages = 1;
  this.next = null;
  this.previous = null;
}

    },
//   async fetch() {
//   let params = {};

//   try {
//     const isSuperuser = localStorage.getItem("is_superuser") === "true"; 
//     // convert to boolean
//     if (!isSuperuser) {
//       params = {
//         user_id__id: localStorage.getItem("userId"),
//       };
//     }

//     console.log("params", params);

//     const res = await this.$apiGet("/get_subscription", params);

//     this.subscriptions = res.data || [];
//   } catch (e) {
//     console.error("Error fetching subscriptions", e);
//     this.subscriptions = [];
//   }
// },

    formatDate(dateStr) {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      return date.toLocaleDateString();
    },
    edit(subscription) {
      this.editing = subscription;
      this.updateVisible = true;
    },
    pay(subscription) {
      this.paymentPayload = {
        user_id: subscription.user_id,
        subscription_id: subscription.id,
        amount: subscription.price,
      };
      this.paymentVisible = true;
    },
    confirmDelete(subscription) {
      this.deleting = subscription;
      this.confirmVisible = true;
    },
    async deleteSubscription() {
      try {
        await this.$apiDelete(`/delete_subscription/${this.deleting.id}`);
        this.$root.$refs.toast.showToast(
          "Subscription deleted successfully",
          "success"
        );
        this.fetchSubscriptions();
      } catch (e) {
        this.$root.$refs.toast.showToast(
          "Failed to delete subscription",
          "error"
        );
      } finally {
        this.confirmVisible = false;
        this.deleting = null;
      }
    },
    payment(subscriptionId) {
      if (subscriptionId)
        this.$router.push({
          name: "subscriptionsPayment_view",
          params: { id: subscriptionId },
        });
    },
    handlePaymentSuccess() {
      this.$root.$refs.toast.showToast("Payment successful", "success");
      this.paymentVisible = false;
      this.fetchSubscriptions();
    },
  },
};
</script>
