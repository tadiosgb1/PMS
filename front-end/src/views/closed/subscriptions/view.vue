<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-4 md:p-6">
      <Loading :visible="loading" message="Loading subscriptions..." />
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Subscriptions
          <button
            v-if="addSubsc"
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-2 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add
          </button>
        </div>

        <!-- Filters & Search -->
        <div class="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4">
          <!-- Search input -->
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search subscriptions..."
            class="w-full md:w-1/3 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <!-- Filters -->
          <div class="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <!-- Status Filter -->
            <div class="flex items-center w-full md:w-auto" v-if="is_super_user=='true'">
              <label class="mr-2 text-sm text-gray-600">Status</label>
              <select
                @change="fetchSubscriptions()"
                v-model="status"
                class="w-full md:w-auto px-2 py-1 border rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            <!-- Show per page -->
            <div class="flex items-center w-full md:w-auto">
              <label for="pageSize" class="mr-2 text-gray-700">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchSubscriptions()"
                class="w-full md:w-auto border px-2 py-1 rounded"
              >
                <option v-for="size in pageSizes" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
              <span class="ml-1 text-gray-700 hidden md:inline">per page</span>
            </div>
          </div>
        </div>

        <!-- Table for Desktop -->
<div class="hidden lg:block overflow-x-auto p-4">
  <table
    class="min-w-full table-auto border-collapse text-[12px] font-medium text-gray-700"
  >
    <thead>
      <tr class="bg-gray-100 text-gray-800 uppercase tracking-wide text-[12px]">
        <th class="border-b border-gray-300 px-3 py-2 text-left">Plan Name</th>
        <th class="border-b border-gray-300 px-3 py-2 text-left">Price</th>
        <th class="border-b border-gray-300 px-3 py-2 text-left">Start Date</th>
        <th class="border-b border-gray-300 px-3 py-2 text-left">End Date</th>
        <th class="border-b border-gray-300 px-3 py-2 text-left">Owner</th>
        <th class="border-b border-gray-300 px-3 py-2 text-left">Status</th>
        <th class="border-b border-gray-300 px-3 py-2 text-center">Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="subscription in filteredSubscriptions"
        :key="subscription.id"
        class="hover:bg-gray-50 even:bg-gray-50/40 transition-colors"
      >
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">
          {{ subscription.plan_name }}
        </td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">
          {{ subscription.price }}
        </td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">
          {{ formatDate(subscription.start_date) }}
        </td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">
          {{ formatDate(subscription.end_date) }}
        </td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">
          {{ subscription.ownerName || 'Unknown' }}
        </td>
        <td
          class="border-b border-gray-200 px-3 py-1.5 text-white font-bold text-center"
          :class="{
            'bg-yellow-500': subscription.status == 'pending',
            'bg-red-500': subscription.status == 'expired',
            'bg-green-500': subscription.status == 'active'
          }"
        >
          {{ subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) }}
        </td>
        <td class="border-b border-gray-200 px-3 py-1.5 text-center">
          <div class="flex flex-wrap justify-center gap-2">
            <button
              v-if="is_super_user != 'true' && subscription.status === 'pending'"
              @click="pay(subscription)"
              class="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg border border-green-700 hover:bg-green-700 transition"
            >
              <i class="fas fa-credit-card mr-1"></i> Pay
            </button>

            <button 
              @click="askDeactivateConfirmation(subscription)"
              class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
            >
              <i class="fas fa-exchange-alt mr-1"></i> Deactivate
            </button>

            <button
              @click="payment(subscription.id)"
              class="flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
            >
              <i class="fas fa-info-circle mr-1"></i> Payments
            </button>

            <button
              v-if="is_super_user != 'true'"
              @click="openUpgradeModal(subscription)"
              class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
            >
              <i class="fas fa-exchange-alt mr-1"></i> Upgrade/Downgrade
            </button>
          </div>
        </td>
      </tr>

      <tr v-if="!filteredSubscriptions.length">
        <td colspan="7" class="text-center py-4 text-gray-500 text-[13px]">
          No subscriptions found.
        </td>
      </tr>
    </tbody>
  </table>
</div>

        <!-- Card/List for mobile/tablet -->
        <div class="md:hidden flex flex-col gap-4">
          <div
            v-for="subscription in filteredSubscriptions"
            :key="subscription.id"
            class="bg-gray-50 rounded-lg shadow p-4 flex flex-col gap-2"
          >
            <div class="flex justify-between items-center">
              <h3 class="font-semibold text-lg">{{ subscription.plan_name }}</h3>
              <span
                class="px-2 py-1 rounded text-white font-bold text-sm"
                :class="{
                  'bg-yellow-500': subscription.status =='pending',
                  'bg-red-500': subscription.status =='expired',
                  'bg-green-500': subscription.status =='active'
                }"
              >
                {{ subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <div><span class="font-semibold">Price:</span> {{ subscription.price }}</div>
              <div><span class="font-semibold">Owner:</span> {{ subscription.ownerName || 'Unknown' }}</div>
              <div><span class="font-semibold">Start Date:</span> {{ formatDate(subscription.start_date) }}</div>
              <div><span class="font-semibold">End Date:</span> {{ formatDate(subscription.end_date) }}</div>
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
              <button
                v-if="is_super_user != 'true' && subscription.status === 'pending'"
                @click="pay(subscription)"
                class="flex items-center px-3 py-1.5 bg-green-600 text-white text-sm font-medium rounded-lg border border-green-700 hover:bg-green-700 transition"
              >
                <i class="fas fa-credit-card mr-1"></i> Pay
              </button>
              <button
                @click="payment(subscription.id)"
                class="flex items-center px-3 py-1.5 bg-green-50 text-green-700 text-sm font-medium rounded-lg border border-green-200 hover:bg-green-100 transition"
              >
                <i class="fas fa-info-circle mr-1"></i> Paymentsgdfgcf
              </button>
              <button 
                @click="askDeactivateConfirmation(subscription)"
                class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
              >
                <i class="fas fa-exchange-alt mr-1"></i> Deactivate
              </button>
              <button v-if="is_super_user!='true'"
                @click="openUpgradeModal(subscription)"
                class="flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 text-sm font-medium rounded-lg border border-orange-200 hover:bg-orange-100 transition"
              >
                <i class="fas fa-exchange-alt mr-1"></i> Upgrade/Downgrade
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex flex-col md:flex-row justify-between items-center mt-4 gap-2 md:gap-4">
          <button
            :disabled="!previous"
            @click="fetchSubscriptions(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            :disabled="!next"
            @click="fetchSubscriptions(next)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Modals here (unchanged) -->
       <!-- ✅ Payment Modal -->
<PaymentModal
  v-if="paymentVisible"
  :visible="paymentVisible"
  :payload="paymentPayload"
  @close="paymentVisible = false"
  @paid="handlePaymentSuccess"
/>

<!-- ✅ Upgrade Subscription Modal -->
<UpgradeSubscriptionModal
  v-if="showUpgradeModal"
  :visible="showUpgradeModal"
  :subscriptionId="selectedSubscriptionId"
  @close="showUpgradeModal = false"
  @plan-upgraded="fetchSubscriptions"
/>
 <!-- Modals -->
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deactivate"
        message="Are you sure you want to deactivate this subscription?"
        @confirm="Deactivate"
        @cancel="confirmVisible = false"
      />
    </div>
  </div>
</template>



<script>
import AddSubscription from "./add.vue";
import UpdateSubscription from "./update.vue";
import PaymentModal from "./Payment.vue";
import UpgradeSubscriptionModal from "./upgradePlan.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

export default {
  name: "subscriptionView",
  components: {
    AddSubscription,
    UpdateSubscription,
    ConfirmModal,
    Toast,
    PaymentModal,
    UpgradeSubscriptionModal,
    Loading
    
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
      is_super_user:false,
      selectedSubscriptionId: null,
      // ✅ Pagination state
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      status:"",
      ordering: "-id",
      subscriptionToAD:null,
      loading:false
     
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

    this.is_super_user=localStorage.getItem('is_superuser');
    console.log("is super user",this.is_super_user)

    this.fetchSubscriptions();

  },
  methods: {
    openUpgradeModal(subscription) {
      this.selectedSubscriptionId = subscription.id; // store the subscription ID
      this.showUpgradeModal = true; // open the modal
    },
    async fetchSubscriptions(url = null) {
      this.loading=true
      try {
        let params = {
          user_id__id: localStorage.getItem("userId"),
          ordering: "-id",
          status:this.status
        };

        if (localStorage.getItem("is_superuser") == "true") {
          params = {
            ordering: "-id",
            status:this.status
          };
        }

        console.log("params for subscription",params)

        const pageUrl =
          url || `/get_subscription?page=1&page_size=${this.pageSize}&search=${this.searchTerm}&ordering=${this.ordering}`;
        const res = await this.$apiGet(pageUrl, params);
        console.log("res", res);

        this.subscriptions = res.data || [];
        this.currentPage = res.current_page || 1;
        this.totalPages = res.total_pages || 1;
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
      finally {
        this.loading=false
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
     askDeactivateConfirmation(subscription) {
      this.subscriptionToAD=subscription
      this.confirmVisible = true;
    },
    async Deactivate(){
      this.confirmVisible=false
       try{
       console.log("subscription id",this.subscriptionToAD.id)
await this.$apiPatch(`/update_subscription`,{status:"terminated"},this.subscriptionToAD.id);
        this.$root.$refs.toast.showToast(
          "Subscription Deactivated successfully",
          "success"
        );
       }catch (e){
this.$root.$refs.toast.showToast(
          "Failed to Deactivate subscription",
          "error"
        );
       }
    },
    handlePaymentSuccess() {
      this.$root.$refs.toast.showToast("Payment successful", "success");
      this.paymentVisible = false;
      this.fetchSubscriptions();
    },
  },
};
</script>
