<template>
  <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white p-6 rounded shadow-lg w-full max-w-lg">
      <h2 class="text-xl font-bold mb-4">Update Rent</h2>
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <label class="block mb-1">Property ID</label>
          <input v-model="form.property_id" type="number" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1">User ID</label>
          <input v-model="form.user_id" type="number" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Rent Type</label>
          <input v-model="form.rent_type" type="text" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Start Date</label>
          <input v-model="form.start_date" type="date" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1">End Date</label>
          <input v-model="form.end_date" type="date" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Payment Cycle</label>
          <input v-model="form.payment_cycle" type="text" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Rent Amount</label>
          <input v-model="form.rent_amount" type="number" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Deposit Amount</label>
          <input v-model="form.deposit_amount" type="number" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Status</label>
          <input v-model="form.status" type="text" class="w-full border px-3 py-2 rounded" required />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" @click="$emit('close')" class="px-4 py-2 rounded border">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Update</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "UpdateRent",
  props: ['visible', 'rent'],
  data() {
    return {
      form: { ...this.rent } // populate with existing rent data
    }
  },
  watch: {
    rent(newVal) {
      this.form = { ...newVal }; // update form when prop changes
    }
  },
  methods: {
    async submitForm() {
      try {
        const response = await this.$apiPut(`/update_rent/${this.form.id}`, this.form);
        this.$root.$refs.toast.showToast(response.message || 'Rent updated successfully', 'success');
        this.$emit('close');
        this.$emit('refresh'); // refresh list after update
      } catch (error) {
        console.error(error);
        alert("Failed to update rent.");
      }
    }
  }
}
</script>
