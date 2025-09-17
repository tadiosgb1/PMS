<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
  >
    <div
      class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
    >
      <!-- Close Button -->
      <div
        class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
      >
        Add New Co-Working Space
        <button
          @click="$emit('close')"
          class="text-white hover:text-gray-200 text-lg font-bold"
        >
          ✕
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="space-y-4 px-4 py-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Location</label>
            <input
              v-model="form.location"
              type="text"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="2"
            class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Capacity</label>
            <input
              v-model.number="form.capacity"
              type="number"
              min="1"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Zone</label>
            <input
              v-model.number="form.zone"
              type="number"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Daily Price</label>
            <input
              v-model="form.price_daily"
              type="number"
              step="0.01"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Monthly Price</label>
            <input
              v-model="form.price_monthly"
              type="number"
              step="0.01"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium mb-1">Quarterly Price</label>
            <input
              v-model="form.price_quarterly"
              type="number"
              step="0.01"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Yearly Price</label>
            <input
              v-model="form.price_yearly"
              type="number"
              step="0.01"
              required
              class="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t mt-4">
          <button
            type="submit"
            class="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Save Space
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "AddSpaceModal",
  props: {
    visible: Boolean,
  },
  data() {
    return {
      form: {
        name: "",
        location: "",
        description: "",
        capacity: 1,
        price_daily: "",
        price_monthly: "",
        price_quarterly: "",
        price_yearly: "",
        zone: null,
      },
    };
  },
  methods: {
    async submitForm() {
      try {
        const payload = { ...this.form };
        const res = await this.$apiPost("/post_coworking_space", payload);
        console.log("Space added:", res);
        this.$emit("success");
        this.resetForm();
        this.$emit("close");
      } catch (err) {
        console.error("Failed to add space:", err);
        alert("Failed to add co-working space.");
      }
    },
    resetForm() {
      this.form = {
        name: "",
        location: "",
        description: "",
        capacity: 1,
        price_daily: "",
        price_monthly: "",
        price_quarterly: "",
        price_yearly: "",
        zone: null,
      };
    },
  },
};
</script>
