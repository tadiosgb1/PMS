<template>
  <div>
    <Toast ref="toast" />
    <div
      v-if="visible"
      class="fixed inset-0 w-full z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[800px] md:max-w-[900px] lg:max-w-[1000px] xl:max-w-[1100px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
        >
          Edit Co-Working Space
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="submitForm"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label class="block text-gray-700">Name</label>
            <input v-model="form.name" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Location</label>
            <input v-model="form.location" type="text" class="custom-input" />
          </div>

          <div class="md:col-span-2">
            <label class="block text-gray-700">Description</label>
            <textarea v-model="form.description" class="custom-input"></textarea>
          </div>

          <div>
            <label class="block text-gray-700">Capacity</label>
            <input v-model="form.capacity" type="number" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Daily Price</label>
            <input v-model="form.price_daily" type="number" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Monthly Price</label>
            <input v-model="form.price_monthly" type="number" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Quarterly Price</label>
            <input v-model="form.price_quarterly" type="number" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Yearly Price</label>
            <input v-model="form.price_yearly" type="number" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Zone</label>
            <input v-model="form.zone" type="number" class="custom-input" />
          </div>

          <!-- Submit -->
          <div class="md:col-span-2 text-right">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded shadow"
            >
              Update Space
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "UpdateCoworkspace",
  components: { Toast },
  props: {
    visible: Boolean,
    space: Object,
  },
  data() {
    return {
      form: {
        id: null,
        name: "",
        location: "",
        description: "",
        capacity: null,
        price_daily: "",
        price_monthly: "",
        price_quarterly: "",
        price_yearly: "",
        zone: null,
      },
    };
  },
  watch: {
    space: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = { ...val };
        }
      },
    },
  },
  methods: {
    async submitForm() {
      try {
        await this.$apiPut(`/update_coworking_space`, this.form.id, this.form);
        this.$root.$refs.toast.showToast(
          "Co-Working Space updated successfully",
          "success"
        );

        this.$emit("refresh");
        this.$emit("close");
      } catch (err) {
        console.error("Update failed:", err);
        alert("Failed to update co-working space.");
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500;
}
</style>
