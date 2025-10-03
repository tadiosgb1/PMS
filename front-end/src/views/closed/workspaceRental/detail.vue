<template>
  <div class="p-6 ">
    <h1 class="text-md font-bold mb-6 text-gray-800">Workspace Rental Details</h1>

    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 text-center py-10">Loading rental details...</div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 text-center py-10">{{ error }}</div>

    <!-- Rental Info -->
    <div v-else-if="rental" class="bg-white shadow-lg rounded-lg p-6 space-y-6">

      <!-- Basic Rental Info -->
      <div class="border-b pb-4">
        <h2 class="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Rental Information</h2>
        <p><strong>Guest Name:</strong> {{ rental.guest_name }}</p>
        <p><strong>Guest Email:</strong> {{ rental.guest_email }}</p>
        <p><strong>Guest Phone:</strong> {{ rental.guest_phone }}</p>
        <p><strong>Rental Cycle:</strong> {{ capitalize(rental.cycle) }}</p>
        <p><strong>Start Date:</strong> {{ formatDate(rental.start_date) }}</p>
        <p><strong>Next Due Date:</strong> {{ formatDate(rental.next_due_date) }}</p>
        <p>
          <strong>Status:</strong>
          <span
            class="px-3 py-1 rounded-full text-white text-xs font-semibold"
            :class="{
              'bg-green-600': rental.is_active,
              'bg-red-600': !rental.is_active
            }"
          >
            {{ rental.is_active ? 'Active' : 'Inactive' }}
          </span>
        </p>
        <p><strong>Created At:</strong> {{ formatDate(rental.created_at) }}</p>
      </div>

      <!-- Links -->
      <div>
        <h2 class="text-xl font-semibold text-gray-700 mb-3 border-b pb-2">Related Links</h2>

        <div class="space-y-2">
          <!-- User Link -->
          <p>
            <strong>User:</strong>
            <button
              @click="goToUserDetail(rental.user.id)"
              class="ml-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <i class="fa fa-user mr-2"></i> View User
            </button>
          </p>

          <!-- Space Link -->
          <p>
            <strong>Workspace:</strong>
            <button
              @click="goToSpaceDetail(rental.space.id)"
              class="ml-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <i class="fa fa-building mr-2"></i> View Space
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rental: null,
      loading: true,
      error: null,
    };
  },
  mounted() {
    this.fetchRental();
  },
  methods: {
    async fetchRental() {
      try {
        const id = this.$route.params.id;
        const res = await this.$apiGetById(`/get_workspace_rental`, id);
        this.rental = res; // res directly contains the object
      } catch (err) {
        console.error(err);
        this.error = "Failed to load workspace rental details.";
      } finally {
        this.loading = false;
      }
    },
    formatDate(dateStr) {
      return dateStr ? new Date(dateStr).toLocaleString() : "N/A";
    },
    capitalize(str) {
      if (!str) return "";
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    goToSpaceDetail(id) {
      this.$router.push(`/co-work-detail/${id}`);
    },
  },
};
</script>
