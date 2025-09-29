<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Zone Details
          <!-- <button
            @click="goBack"
            class="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            ← Back to Zones
          </button> -->
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Zone Title -->
          <h1 v-if="zone" class="text-2xl font-bold mb-4">
            Zone: {{ zone.name }}
          </h1>
          <p v-else>Loading...</p>

          <!-- Zone Details -->
          <div v-if="zone" class="grid grid-cols-2 gap-4 mb-6">
            <div><strong>ID:</strong> {{ zone.id }}</div>
            <div><strong>Name:</strong> {{ zone.name }}</div>
            <div><strong>Address:</strong> {{ zone.address }}</div>
            <div><strong>City:</strong> {{ zone.city }}</div>
            <div><strong>State:</strong> {{ zone.state }}</div>
            <div><strong>Owner ID:</strong> {{ zone.owner_id }}</div>
            <div><strong>Manager ID:</strong> {{ zone.manager_id }}</div>
            <div><strong>Created At:</strong> {{ zone.created_at }}</div>
          </div>

          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "ZoneDetail",
  components: { Toast },
  data() {
    return {
      zone: null,
    };
  },
  mounted() {
    this.fetchZone();
  },
  methods: {
    async fetchZone() {
      try {
        const res = await this.$apiGet(
          `/get_property_zone/${this.$route.params.id}`
        );
        this.zone = res.data || res;
      } catch (err) {
        console.error("Failed to fetch zone details", err);
        this.$refs.toast.showToast("Could not load zone details.", "error");
      }
    },
    goBack() {
      this.$router.push({ path: "/zones" });
    },
  },
};
</script>
