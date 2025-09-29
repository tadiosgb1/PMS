<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Broker Details
          <!-- <button
            @click="goBack"
            class="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            ← Back to Brokers
          </button> -->
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Broker Title -->
          <h1 v-if="broker" class="text-2xl font-bold mb-4">
            {{ broker.name }}
          </h1>
          <p v-else>Loading...</p>

          <!-- Broker Details -->
          <div v-if="broker" class="grid grid-cols-2 gap-4 mb-6">
            <div><strong>ID:</strong> {{ broker.id }}</div>
            <div><strong>Name:</strong> {{ broker.name }}</div>
            <div><strong>Email:</strong> {{ broker.email }}</div>
            <div><strong>Phone:</strong> {{ broker.phone }}</div>
            <div><strong>Company:</strong> {{ broker.company }}</div>
            <div><strong>Created At:</strong> {{ broker.created_at }}</div>
          </div>

          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "BrokerDetail",
  components: { Toast },
  data() {
    return {
      broker: null,
    };
  },
  mounted() {
    this.fetchBroker();
  },
  methods: {
    async fetchBroker() {
      try {
        const res = await this.$apiGet(
          `/get_broker/${this.$route.params.id}`
        );
        this.broker = res.data || res;
      } catch (err) {
        console.error("Failed to fetch broker details", err);
        this.$refs.toast.showToast("Could not load broker details.", "error");
      }
    },
    goBack() {
      this.$router.push({ path: "/brokers" });
    },
  },
};
</script>
