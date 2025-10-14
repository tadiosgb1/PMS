<template>
  <div>
    <Toast ref="toast" />
    <div
      v-if="visible"
      class="fixed inset-0 w-full z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <div
          class="bg-orange-500 text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
        >
          Edit Plan
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form
          @submit.prevent="submitForm"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label class="block text-gray-700">Name</label>
            <input v-model="form.name" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Max Locations</label>
            <input
              v-model="form.max_locations"
              type="number"
              class="custom-input"
            />
          </div>

          <div>
            <label class="block text-gray-700">Max Staff</label>
            <input
              v-model="form.max_staff"
              type="number"
              class="custom-input"
            />
          </div>

          <div>
            <label class="block text-gray-700">Max Users</label>
            <input
              v-model="form.max_users"
              type="number"
              class="custom-input"
            />
          </div>

          <!-- <div>
            <label class="block text-gray-700">Max KDS</label>
            <input
              v-model="form.max_kds"
              type="number"
              class="custom-input"
            />
          </div>

          <div class="flex items-center space-x-3">
            <input
              id="kdsEnabled"
              v-model="form.kds_enabled"
              type="checkbox"
              class="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label for="kdsEnabled" class="block text-gray-700"
              >KDS Enabled</label
            >
          </div> -->

          <div>
            <label class="block text-gray-700">Price</label>
            <input v-model="form.price" type="number" class="custom-input" />
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

          <!-- <div>
            <label class="block text-gray-700">Created At</label>
            <input v-model="form.created_at" type="date" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Updated At</label>
            <input v-model="form.updated_at" type="date" class="custom-input" />
          </div> -->

          <div class="md:col-span-2 text-right">
            <button
              type="submit"
              class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded shadow"
            >
              Update Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from '@/components/Toast.vue';

export default {
  name: 'UpdatePlan',
  components: { Toast },
  props: {
    visible: Boolean,
    plan: Object,
  },
  data() {
    return {
      form: {
        id: null,
        name: '',
        max_locations: '',
        max_staff: '',
        max_users: '',
        max_kds: '27',
        kds_enabled: false,
        price: null,
        billing_cycle: '',
        updated_at: new Date().toISOString(),
      },
    };
  },
  watch: {
    plan: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = {
            ...val,
            created_at: val.created_at ? val.created_at.split('T')[0] : '',
            updated_at: val.updated_at ? val.updated_at.split('T')[0] : '',
          };
        }
      },
    },
  },
  methods: {
    async submitForm() {
      try {
        await this.$apiPut(`/update_plan`, this.form.id, this.form);
        this.$root.$refs.toast.showToast('Plan updated successfully', 'success');

        setTimeout(() => {
          this.$emit('close');
        }, 3000);

        this.$emit('refresh');
      } catch (err) {
        console.error('Update failed:', err);
         this.$root.$refs.toast.showToast(err.message,"error")
        //alert('Failed to update plan.');
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500;
}
</style>
