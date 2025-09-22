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
                  <th class="px-4 py-2 border">Owner</th>
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

                  <td class="px-4 py-2 border">{{ subscription.ownerName }}</td>

                 <td class="px-4 py-2 border text-center">
                  <div class="flex flex-wrap justify-center gap-2">
                    <!-- Pay Button -->
                    <button
                      v-if="subscription.status === 'pending'"
                      @click="pay(subscription)"
                      class="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg border border-green-700 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
                      title="Pay"
                    >
                      <i class="fas fa-credit-card mr-1"></i> Pay
                    </button>

                    <!-- Payments Info -->
                    <button
                      @click="payment(subscription.id)"
                      class="flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-200 transition"
                      title="Subscription payments"
                    >
                      <i class="fas fa-info-circle mr-1"></i> Payments
                    </button>

                    <!-- Edit -->
                

                    <!-- Upgrade/Downgrade -->
                    <button
                      @click="openUpgradeModal(subscription)"
                      class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-200 transition"
                    >
                      <i class="fas fa-exchange-alt mr-1"></i> Upgrade/Downgrade
                    </button>
                     <button
                      @click="edit(subscription)"
                      class="flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                      title="Edit"
                    >
                      <i class="fas fa-edit mr-1"></i> Edit
                    </button>

                    <!-- Delete -->
                    <button
                      @click="confirmDelete(subscription)"
                      class="flex items-center px-3 py-1.5 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-200 transition"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt mr-1"></i> Delete
                    </button>
                  </div>
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

<UpgradeSubscriptionModal
  v-if="showUpgradeModal"
  :visible="showUpgradeModal"
  :subscription-id="selectedSubscriptionId"  
  @close="showUpgradeModal = false;fetchSubscriptions()"
  @plan-upgraded="handlePlanUpgrade"
/>
    </div>

  </div>
</template>

<script>
import AddSubscription from "./add.vue";
import UpdateSubscription from "./update.vue";
import PaymentModal from "./Payment.vue";
import UpgradeSubscriptionModal from './upgradePlan.vue'
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
    UpgradeSubscriptionModal
  },
  data() {
    return {
      subscriptions: [],
      searchTerm: "",
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      showUpgradeModal: false,
      paymentVisible: false,
      paymentPayload: null,
      editing: null,
      deleting: null,
      selectedSubscriptionId: null,
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
    openUpgradeModal(subscription) {
    this.selectedSubscriptionId = subscription.id; // store the subscription ID
    this.showUpgradeModal = true;                  // open the modal
   },
    async fetchSubscriptions(url = null) {
      try {
        let params = {
          user_id: localStorage.getItem("userId"),
          ordering: "-id",
        };

        if (localStorage.getItem("is_superuser") === "true") {
          params = {
            ordering: "-id",
          };
        }

        const pageUrl =
          url || `/get_subscription?page=1&page_size=${this.pageSize}`;
        const res = await this.$apiGet(pageUrl, params);
        console.log("res", res);

        this.subscriptions = res.data || [];
        this.currentPage = res.currentPage || 1;
        this.totalPages = res.totalPages || 1;
        this.next = res.next || null;
        this.previous = res.previous || null;

        // Fetch owner for each subscription (handle missing IDs)
        await Promise.all(
          this.subscriptions.map(async (sub) => {
            if (sub.user_id) {
              try {
                const ownerRes = await this.$apiGetById(
                  "get_user",
                  sub.user_id
                );
                sub.ownerName = ownerRes.first_name || "Unknown";
              } catch (err) {
                console.warn(`Failed to fetch user ${sub.user_id}`, err);
                sub.ownerName = "Unknown";
              }
            } else {
              sub.ownerName = "Unknown"; // fallback if no user_id
            }
          })
        );

        console.log("subscriptions", this.subscriptions);
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
