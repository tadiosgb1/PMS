<template>
  <div>
    <div
      v-if="visible"
      class="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <div
          class="bg-primary text-white px-6 py-4 flex justify-between items-center text-xl font-semibold"
        >
          Add Property Zone
          <button @click="$emit('close')" class="text-white font-bold">✕</button>
        </div>

        <form
          @submit.prevent="submitForm"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label class="block text-gray-700">Zone manager</label>
            <select v-model="form.manager_id" class="custom-input">
              <option value="">Select Manager</option>
              <option
                v-for="manager in managers"
                :key="manager.id"
                :value="manager.manager.id"
              >
                {{ manager.manager.first_name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-gray-700">Name</label>
            <input v-model="form.name" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Address</label>
            <input v-model="form.address" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">City</label>
            <input v-model="form.city" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">State</label>
            <input v-model="form.state" class="custom-input" />
          </div>

          <div class="md:col-span-2 text-right">
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary hover:bg-primary text-white px-6 py-2 rounded"
            >
              {{ loading ? "Saving..." : "Save" }}
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
  props: { visible: Boolean },
  components: { Toast },
  data() {
    return {
      managers: [],
      loading: false,
      form: {
        owner_id: localStorage.getItem("userId"),
        name: "",
        address: "",
        city: "",
        state: "",
        manager_id: "",
      },
    };
  },
  async mounted() {
    try {
      if (localStorage.getItem("is_superuser") == "true") {
        const res = await this.$apiGet(`/get_managers`);
        this.managers = res.data || [];
      } else {
        const params = { owner__id: localStorage.getItem("userId") };
        const res = await this.$apiGet(`/get_owner_managers`, params);
        this.managers = res.data || [];
      }
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  },
  methods: {
    async submitForm() {
      this.loading = true;
      try {
        const response = await this.$apiPost("post_property_zone", this.form);

        if (response && response.error) {
          this.$root.$refs.toast.showToast(
            response.error || "Failed to add property zone",
            "error"
          );
        } else {
          this.$root.$refs.toast.showToast(
            "Property zone saved successfully",
            "success"
          );
          this.$reloadPage();
          this.$emit("close"); // Close modal after success
        }
      } catch (err) {
        console.error("Failed to add zone:", err);
        this.$root.$refs.toast.showToast(err.message.error, "error");
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary;
}
</style>
