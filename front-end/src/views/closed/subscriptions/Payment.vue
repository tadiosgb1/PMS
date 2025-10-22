<template>
  <div>
    <Toast ref="toast" />
    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] sm:min-w-[400px] md:max-w-[850px] md:min-w-[500px] lg:max-w-[950px] xl:max-w-[1050px] xl:min-w-[700px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
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

        <!-- Mode Switch -->
        <div class="flex justify-center mt-4 space-x-4">
          <button
            class="px-4 py-2 rounded-t-lg font-semibold"
            :class="mode === 'manual' ? 'bg-primary text-white' : 'bg-gray-200'"
            @click="mode = 'manual'"
          >
            Manual Payment
          </button>
          <button
            class="px-4 py-2 rounded-t-lg font-semibold"
            :class="mode === 'online' ? 'bg-primary text-white' : 'bg-gray-200'"
            @click="mode = 'online'"
          >
            Online Payment
          </button>
        </div>

        <!-- Modal Body -->
  <!-- Modal Body -->
<div class="px-4 mt-4 space-y-4">
  <!-- Manual Payment -->
  <div v-if="mode === 'manual'">
    <!-- Info Section -->
    <div class="p-3 bg-gray-100 border-l-4 border-blue-500 rounded">
      <p class="text-sm text-gray-700 font-semibold">Payment Instructions</p>
      <ul class="mt-2 text-sm text-gray-600 space-y-1">
        <li><strong>CBE Account:</strong> 1000 2000 3000 </li>
        <li> <strong>TeleBirr:</strong> +2519-------</li>
        <li class="text-xs text-gray-500"> Please transfer to one of the above and provide the Transaction ID & Remark below.</li>
      </ul>
    </div>

    <!-- Fields -->
   <div>
  <label class="block font-semibold mb-1">Payment Method:</label>
  <select
    v-model="form.payment_method"
    class="w-full border rounded p-2 bg-white"
  >
    <option disabled value="">Select payment method</option>
    <option value="cash">Cash</option>
    <option value="telebirr">Telebirr</option>
    <option value="cbe">CBE</option>
    <option value="e-birr">E-Birr</option>
  </select>
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

    <div>
      <label class="block font-semibold mb-1">Remark:</label>
      <input
        v-model="form.remark"
        type="text"
        class="w-full border rounded p-2"
        placeholder="Remark"
      />
    </div>
  </div>

  <!-- Online Payment -->
  <div v-else>
    <p class="text-gray-600">Choose an online payment provider:</p>
    <div class="flex space-x-4 mt-4">
      <!-- ArifPay button -->
      <button
        @click="payOnline('arifpay')"
        class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 animate-pulse"
        :disabled="loading"
      >
        Pay with santimPay
      </button>

      <!-- TeleBirr button -->
      <button
        @click="payOnline('telebirr')"
        class="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 animate-pulse"
        :disabled="loading"
      >
        Pay with TeleBirr
      </button>
    </div>
  </div>
</div>


        <!-- Modal Actions -->
        <div class="px-4 pb-4 flex justify-end space-x-2 mt-6">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            v-if="mode === 'manual'"
            @click="submitPayment()"
            class="px-4 py-2 bg-primary text-white rounded hover:bg-orange-600 cursor-pointer"
          >
            {{ loading ? 'Processing...' : 'Submit' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from '../../../components/Toast.vue';
export default {
  name: 'PaymentModal',
  components: { Toast },
  props: {
    visible: Boolean,
    payload: Object,
  },
  data() {
    return {
      loading: false,
      mode: 'manual', // "manual" | "online"
      form: {
        user_id: 0,
        subscription_id: 0,
        amount: 0,
        payment_method: '',
        status: 'pending',
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
          this.form.payment_method = '';
          this.form.status = 'pending';
          this.form.transaction_id = '';
        }
      },
    },
  },
  methods: {
    async submitPayment() {
      if (
        !this.form.payment_method ||
        !this.form.transaction_id
      ) {
        this.$root.$refs.toast.showToast('Please fill in all payment fields', 'error');
        return;
      }
      this.loading = true;
      try {
        await this.$apiPost('post_subscription_ayment', this.form);
        this.$emit('paid', this.form);
        setTimeout(() => {
          this.$emit('close');
          this.$emit('refresh');
        }, 3000);
      } catch (err) {
        console.error('Payment failed:', err);
        this.$root.$refs.toast.showToast(err.message, 'error');
      } finally {
        this.loading = false;
      }
    },
    async payOnline(provider) {
      this.loading = true;
      try {
        this.$root.$refs.toast.showToast(`Redirecting to ${provider}...`, 'info');
      } catch (err) {
        console.error(`${provider} payment failed:`, err);
        this.$root.$refs.toast.showToast(err.message, 'error');
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
