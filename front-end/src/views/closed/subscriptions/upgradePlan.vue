<template>
  <Toast ref="toast" />
  <Teleport to="body">
    <div
      v-if="visible"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4 py-8"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md sm:max-w-3xl p-4 sm:p-6 relative overflow-y-auto max-h-[90vh]"
      >
        <!-- Close Button -->
        <button
          @click="$emit('close')"
          class="absolute top-3 right-3 text-gray-400 hover:text-orange-600 text-2xl font-bold focus:outline-none"
        >
          &times;
        </button>

        <!-- Title -->
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-6 text-orange-700">
          Upgrade Subscription Plan
        </h2>

        <!-- Plans -->
        <div v-if="loading" class="text-center py-8">
          <svg class="animate-spin h-10 w-10 mx-auto text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <p class="mt-4 text-gray-600">Loading plans...</p>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="border rounded-xl p-4 flex flex-col justify-between hover:shadow-lg transition cursor-pointer"
          >
            <div>
              <h3 class="text-lg sm:text-xl font-bold text-orange-700 mb-2">{{ plan.name }}</h3>
              <p class="text-gray-700 mb-1 text-sm sm:text-base">Price: {{ formatPrice(plan.price) }} / {{ plan.billing_cycle }}</p>
              <p class="text-gray-600 text-xs sm:text-sm mb-1">Max Locations: {{ plan.max_locations }}</p>
              <p class="text-gray-600 text-xs sm:text-sm mb-1">Max Staff: {{ plan.max_staff }}</p>
              <p class="text-gray-600 text-xs sm:text-sm mb-1">Max Users: {{ plan.max_users }}</p>
              <p class="text-gray-600 text-xs sm:text-sm mb-1">Max KDS: {{ plan.max_kds }}</p>
              <p class="text-gray-600 text-xs sm:text-sm">KDS Enabled: {{ plan.kds_enabled ? "Yes" : "No" }}</p>
            </div>
            <button
              @click="selectPlan(plan)"
              :disabled="updating"
              class="mt-4 bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md transition flex items-center justify-center text-sm sm:text-base"
            >
              <span v-if="!updating || selectedPlan?.id !== plan.id">Change Plan</span>
              <span v-else class="flex items-center">
                <svg class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Updating...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "UpgradeSubscriptionModal",
  components: { Toast },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    subscriptionId: {
      type: Number,
      required: true, // <-- get from parent
    },
  },
  data() {
    return {
      plans: [],
      loading: false,
      updating: false,
      selectedPlan: null,
    };
  },
  mounted() {
    this.fetchPlans();
  },
  watch: {
    visible(newVal) {
      if (newVal) this.fetchPlans();
    },
  },
  methods: {
    async fetchPlans() {
      this.loading = true;
      try {
        const response = await this.$apiGet("/get_plans");
        this.plans = response.data;
      } catch (error) {
        console.error("Failed to fetch plans", error);
        this.$refs.toast?.showErrorToastMessage("Failed to load plans.");
      } finally {
        this.loading = false;
      }
    },
    formatPrice(amount) {
      return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
    },
    async selectPlan(plan) {
      this.selectedPlan = plan;
      this.updating = true;
      try {
        // Use subscriptionId from parent instead of plan.id
        await this.$apiPost("/update_subscription_plan", {
          subscription_id: this.subscriptionId,
          status: "pending",
          plan_name: plan.name,
        });
      //  this.$refs.toast?.showSuccessToastMessage(`Upgraded to ${plan.name} successfully!`);

         this.$root.$refs.toast.showToast(`Upgraded to ${plan.name} successfully!`, 'success');

        this.$emit("plan-upgraded", plan);
        setTimeout(() => this.$emit("close"), 3000);
      } catch (error) {
        console.error("Upgrade failed", error);
       this.$root.$refs.toast.showToast(error.message,'error');
      } finally {
        this.updating = false;
      }
    },
  },
};
</script>
