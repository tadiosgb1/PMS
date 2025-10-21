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
          <div class="relative">
  <label class="block text-gray-700 mb-1">Zone Manager</label>
  <input
    v-model="managerSearch"
    type="text"
    class="custom-input"
    placeholder="Search Manager..."
    @input="searchManagers"
    @focus="managerDropdown = true"
    @blur="hideDropdown('manager')"
    required
  />
  <ul
    v-if="managers.length > 0 && managerDropdown"
    class="absolute z-50 w-full max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow mt-1"
  >
    <li
      v-for="manager in managers"
      :key="manager.manager.id"
      class="p-2 hover:bg-gray-100 cursor-pointer"
      @mousedown.prevent="selectManager(manager)"
    >
      {{ manager.manager.first_name }} {{ manager.manager.last_name || '' }}
    </li>
  </ul>
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
       managerSearch: "",
    managerDropdown: false,
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
        const result = await this.$getManagers(); // Global function handles URL & params
        console.log("result", result);
        this.managers = result.managers;
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  },
  methods: {
     searchManagers() {
    if (!this.managerSearch) {
      this.fetchManagers();
    } else {
      this.managers = this.managers.filter(m =>
        `${m.manager.first_name} ${m.manager.last_name || ''}`
          .toLowerCase()
          .includes(this.managerSearch.toLowerCase())
      );
    }
  },

  selectManager(manager) {
    this.form.manager_id = manager.manager.id;
    this.managerSearch = `${manager.manager.first_name} ${manager.manager.last_name || ''}`;
    this.managerDropdown = false;
  },

  hideDropdown(type) {
    setTimeout(() => {
      if (type === "manager") this.managerDropdown = false;
    }, 200);
  },
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
