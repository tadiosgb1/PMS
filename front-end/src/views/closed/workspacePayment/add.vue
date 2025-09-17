<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-bold text-gray-800">Add Rental Cycle</h2>
          <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Amount</label>
              <input
                type="number"
                v-model="form.amount"
                class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cycle Start</label>
              <input
                type="date"
                v-model="form.cycle_start"
                class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Cycle End</label>
              <input
                type="date"
                v-model="form.cycle_end"
                class="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              @click="$emit('close')"
              class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: "AddRental",
  props: {
    visible: { type: Boolean, default: false },
    rental: { type: [Number, String], required: true }, // rental ID from parent
  },
  data() {
    return {
      form: {
        amount: "",
        cycle_start: "",
        cycle_end: "",
        rental: this.rental,
      },
    };
  },
  watch: {
    rental(newVal) {
      this.form.rental = newVal;
    },
  },
  methods: {
   async submitForm() {
  try {
    await this.$apiPost("/post_rental_payment", this.form); // <-- correct endpoint
    this.$emit("success"); // tell parent to refresh list
    this.$emit("close");
    this.resetForm();
  } catch (err) {
    console.error("Failed to save rental payment:", err);
  }
}
,
    resetForm() {
      this.form.amount = "";
      this.form.cycle_start = "";
      this.form.cycle_end = "";
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
