<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
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
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search Subscriptions..."
            class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

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
                      class="text-green-600 hover:text-green-800"
                      title="Pay"
                    >
                      <i class="fas fa-credit-card"></i>
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
        </div>
      </div>

      <!-- Add & Update Modals -->
      <AddSubscription
        v-if="visible"
        :visible="visible"
        @close="visible = false"
        @refresh="fetch"
      />
      <UpdateSubscription
        v-if="updateVisible"
        :visible="updateVisible"
        :subscription="editing"
        @close="updateVisible = false"
        @refresh="fetch"
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
    this.fetch();
  },
  methods: {
    async fetch() {
      try {

        const params = {
         user_id__id: localStorage.getItem("userId"),
        };

       console.log("params",params);

        const res = await this.$apiGet("/get_subscription", params);
       
        this.subscriptions = res.data || [];

      } catch (e) {
        console.error("Error fetching subscriptions", e);
        this.subscriptions = [];
      }
    },
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
        this.fetch();
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
    handlePaymentSuccess() {
      this.$root.$refs.toast.showToast("Payment successful", "success");
      this.paymentVisible = false;
      this.fetch();
    },
  },
};
</script>
