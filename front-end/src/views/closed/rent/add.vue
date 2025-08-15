<template>
  <div>
    <!-- ✅ Toast Component -->
    <Toast ref="toast" />

    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto">
        
        <!-- Header -->
        <div class="bg-primary hover:bg-primary text-white px-6 py-4 text-xl font-semibold flex justify-between items-center">
          Add New Rent
          <button @click="$emit('close')" class="text-white hover:text-gray-200 text-lg font-bold">✕</button>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="submitForm"
          class="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[80vh] overflow-y-auto"
        >
          <div>
            <label class="block text-gray-700 mb-1">Property ID</label>
            <input v-model="form.property_id" type="number" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">User ID</label>
            <input v-model="form.user_id" type="number" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Rent Type</label>
            <input v-model="form.rent_type" type="text" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Start Date</label>
            <input v-model="form.start_date" type="date" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">End Date</label>
            <input v-model="form.end_date" type="date" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Payment Cycle</label>
            <input v-model="form.payment_cycle" type="text" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Rent Amount</label>
            <input v-model="form.rent_amount" type="number" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Deposit Amount</label>
            <input v-model="form.deposit_amount" type="number" class="custom-input" required />
          </div>

          <div>
            <label class="block text-gray-700 mb-1">Status</label>
            <input v-model="form.status" type="text" class="custom-input" required />
          </div>

          <!-- Actions -->
          <div class="md:col-span-2 text-right pt-2">
            <button
              type="submit"
              class="bg-primary hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded border-orange-100 focus:ring-orange-300 shadow"
            >
              Save Rent
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
  name: "AddRent",
  components: { Toast },
  props: {
    visible: Boolean,
    propertyId: [String, Number] // passed from parent if adding for specific property
  },
  data() {
    return {
      form: {
        property_id: this.propertyId || "",
        user_id: "",
        rent_type: "",
        start_date: "",
        end_date: "",
        payment_cycle: "",
        rent_amount: "",
        deposit_amount: "",
        status: ""
      }
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await this.$apiPost("/post_rent", this.form);
        this.$root.$refs.toast.showToast(response.message || "Rent added successfully", "success");

        // Reset form (keep property_id if provided from route)
        this.form = {
          property_id: this.propertyId || "",
          user_id: "",
          rent_type: "",
          start_date: "",
          end_date: "",
          payment_cycle: "",
          rent_amount: "",
          deposit_amount: "",
          status: ""
        };

        // Close modal after short delay
        setTimeout(() => {
          this.$emit("close");
          this.$emit("refresh");
        }, 2000);
      } catch (error) {
        console.error(error);
        alert("Failed to add rent.");
      }
    }
  }
};
</script>
