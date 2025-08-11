<template>
  <div>
    <Toast ref="toast" />


    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center">
          Add Subscription
          <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="submitForm"
          class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label class="block text-gray-700 mb-1">User ID</label>
            <input v-model="form.user_id" type="number" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Plan Name</label>
            <input v-model="form.plan_name" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Billing Cycle</label>
            <select v-model="form.billing_cycle" class="custom-input">
              <option value="" disabled>Select billing cycle</option>
              <option value="daily">Daily</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Price</label>
            <input v-model="form.price" type="number" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Start Date</label>
            <input v-model="form.start_date" type="date" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">End Date</label>
            <input v-model="form.end_date" type="date" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Status</label>
            <select v-model="form.status" class="custom-input">
              <option value="" disabled>Select status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          <div class="md:col-span-2 text-right pt-2">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded focus:ring-orange-300 shadow"
            >
              Add Subscription
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";

export default {
  name: "AddSubscription",
  components: { Toast },
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        user_id: "",
        plan_name: "",
        billing_cycle: "",
        price: "",
        start_date: "",
        end_date: "",
        status: "",
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        await this.$apiPost("/post_subscription", this.form);
        this.$root.$refs.toast.showToast('Subscription Added successfully ', 'success');

        setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 3000);
      } catch (error) {
        console.error("Failed to add subscription:", error);
         this.$root.$refs.toast.showToast("Failed to add subscription", "error");
        
      }
    },
  },
};
</script>
