<template>
  <div>
    <div
      v-if="visible"
      class="fixed inset-0 z-10 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 flex justify-between items-center text-xl font-semibold"
        >
          Add Property Zone
          <button @click="$emit('close')" class="text-white font-bold">
            ✕
          </button>
        </div>

        <!-- Form -->
        <form
          @submit.prevent="submitForm"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <!-- Manager -->
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
                {{ manager.manager.first_name }}
                {{ manager.manager.last_name || "" }}
              </li>
            </ul>
          </div>

          <!-- Name -->
          <div>
            <label class="block text-gray-700">Name</label>
            <input v-model="form.name" class="custom-input" placeholder="Enter name" />
          </div>

          <!-- Address -->
          <div>
            <label class="block text-gray-700">Address</label>
            <input v-model="form.address" class="custom-input" placeholder="Enter address" />
          </div>

          <!-- City -->
          <div>
            <label class="block text-gray-700">City</label>
            <input v-model="form.city" class="custom-input" placeholder="Enter city" />
          </div>

          <!-- State -->
          <div>
            <label class="block text-gray-700">State</label>
            <input v-model="form.state" class="custom-input" placeholder="Enter state" />
          </div>


          <div class="p-3 bg-yellow-200">
            

         NB. When registering your zone To fill correct location ,make sure to be in the zone you are registering,but if you are away from it and want to register it right now,kindly contact the owner of the system.
       
          </div>
          <!-- Latitude -->
          <div>
            <label class="block text-gray-700">Latitude</label>
            <input
              v-model="form.latitude"
              class="custom-input bg-gray-100 cursor-not-allowed"
              placeholder="Fetching latitude..."
              readonly
            />
          </div>
   <!-- Longitude -->
          <div>
            <label class="block text-gray-700">Longitude</label>
            <input
              v-model="form.longitude"
              class="custom-input bg-gray-100 cursor-not-allowed"
              placeholder="Fetching longitude..."
              readonly
            />
          </div>

          <!-- Submit -->
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
        latitude: "",
        longitude: "",
      },
    };
  },

  // Call location as soon as modal appears or on mount if visible
  watch: {
    visible(newVal) {
      if (newVal) {
        this.checkAndRequestLocation();
      }
    },
  },

  async mounted() {
    try {
      const result = await this.$getManagers();
      this.managers = result.managers;
    } catch (err) {
      console.error("Error fetching managers:", err);
    }

    // Also handle the case when modal is open by default
    if (this.visible) {
      this.checkAndRequestLocation();
    }
  },

  created() {
    // Optional: pre-warm permissions check before modal opens
    if (navigator.permissions) {
      navigator.permissions.query({ name: "geolocation" }).catch(() => {});
    }
  },

  methods: {
    searchManagers() {
      if (!this.managerSearch) {
        this.fetchManagers();
      } else {
        this.managers = this.managers.filter((m) =>
          `${m.manager.first_name} ${m.manager.last_name || ""}`
            .toLowerCase()
            .includes(this.managerSearch.toLowerCase())
        );
      }
    },

    selectManager(manager) {
      this.form.manager_id = manager.manager.id;
      this.managerSearch = `${manager.manager.first_name} ${manager.manager.last_name || ""}`;
      this.managerDropdown = false;
    },

    hideDropdown(type) {
      setTimeout(() => {
        if (type === "manager") this.managerDropdown = false;
      }, 200);
    },

    async checkAndRequestLocation() {
      if (!navigator.geolocation) {
        this.$root.$refs.toast.showToast(
          "Geolocation is not supported by your browser.",
          "error"
        );
        return;
      }

      try {
        // Check permission first
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: "geolocation" });
          if (permission.state === "granted") {
            this.getCurrentLocation();
            return;
          } else if (permission.state === "denied") {
            this.$root.$refs.toast.showToast(
              "Location permission denied. Enable it in browser settings.",
              "error"
            );
            return;
          }
        }

        // Request permission (triggers browser prompt)
        this.getCurrentLocation();
      } catch (e) {
        this.getCurrentLocation(); // fallback
      }
    },

    getCurrentLocation() {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          this.form.latitude = pos.coords.latitude.toFixed(6);
          this.form.longitude = pos.coords.longitude.toFixed(6);
          //this.$root.$refs.toast.showToast("Location detected successfully.", "success");
        },
        (err) => {
          console.error("Error fetching location:", err);
          this.$root.$refs.toast.showToast(
            "Unable to access your location. Please allow permission.",
            "error"
          );
        }
      );
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
          this.$emit("close");
        }
      } catch (err) {
        console.error("Failed to add zone:", err);
        this.$root.$refs.toast.showToast(err.message?.error || err.message, "error");
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
