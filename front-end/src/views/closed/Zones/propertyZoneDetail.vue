<template>
  <div>
    <Toast ref="toast" />
    <div
      class="max-w-5xl p-4 mx-auto bg-white shadow rounded-lg overflow-hidden"
    >
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        &larr; Back
      </button>

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

      <!-- Placeholder for future sections -->
      <div v-if="zone" class="mt-10">
        <h2 class="text-xl font-semibold mb-2">Related Properties</h2>
        <p class="text-gray-500">
          Future enhancement: show all properties under this zone here.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "PropertyZoneDetail",
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
  },
};
</script>
