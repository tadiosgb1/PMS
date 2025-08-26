<template>
  <div >
    <Toast ref="toast" />
    <div v-if="visible" class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto">
      <div class="bg-white w-full  sm:w-auto sm:max-w-[700px] sm:min-w-[400px] md:max-w-[850px] md:min-w-[500px] lg:max-w-[950px] lg:mix-w-[600px] xl:max-w-[1050px] xl:min-w-[700px] rounded-lg shadow-lg overflow-hidden relative mx-auto">
        <!-- Modal Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center rounded-t"
        >
          Payment
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="px-4 mt-4 space-y-4">
          <div>
            <label class="block font-semibold mb-1">Payment Method:</label>
            <input
              v-model="form.payment_method"
              type="text"
              class="w-full border rounded p-2"
              placeholder="e.g. credit_card, paypal"
            />
          </div>

        
          <div>
            <label class="block font-semibold mb-1">Status:</label>
            <input
              v-model="form.status"
              type="text"
              class="w-full border rounded p-2"
              placeholder="e.g. completed, pending"
            />
          </div>

          <div>
            <label class="block font-semibold mb-1">Transaction ID:</label>
            <input
              v-model="form.transaction_id"
              type="text"
              class="w-full border rounded p-2"
              placeholder="Unique transaction reference"
            />
          </div>
        </div>

        <!-- Modal Actions -->
        <div class=" px-4 pb-4 flex justify-end space-x-2 mt-6">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            @click="submitPayment"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600"
            :disabled="loading || !form.payment_method || !form.status || !form.transaction_id"
          >
            {{ loading ? 'Processing...' : 'Submit' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
export default {
  name: 'PaymentModal',
  components: { Toast },
  props: {
    visible: Boolean,
    payload: Object,
    subscriptionId:Number
  },
  data() {
    return {
      loading: false,
      form: {
        user_id: 0,
        subscription_id: 0,
        amount: 0,
        payment_method: '',
        status: '',
        transaction_id: '',
      },
    };
  },
  watch: {
    payload: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form.user_id = newVal.user_id || 0;
          this.form.subscription_id = newVal.subscription_id || 0;
          this.form.amount = newVal.amount || 0;
          // Reset payment fields on new payload
          this.form.payment_method = '';
          this.form.status = '';
          this.form.transaction_id = '';
        }
      },
    },
  },
  methods: {
    async submitPayment() {
      if (
        !this.form.payment_method ||
        !this.form.status ||
        !this.form.transaction_id
      ) {
        this.$root.$refs.toast.showToast('Please fill in all payment fields', 'error');
        return;
      }

      this.loading = true;
      try {
        await this.$apiPost('post_subscription_ayment', this.form);
       //  this.$root.$refs.toast.showToast('Payment  successfully ', 'success');
        this.$emit('paid', this.form);
         setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 3000);
      } catch (err) {
        console.error('Payment failed:', err);
        this.$root.$refs.toast.showToast('Payment failed. Please try again.', 'error');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
