<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-8">Configurations</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Configure Plan Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-white text-black px-6 py-4 font-semibold text-lg">
          Configure Plan
        </div>
        <div class="p-6">
          <p class="text-gray-700 mb-4">
            Manage subscription plans and pricing for your users.
          </p>
          <router-link
            to="/plans_view"
            class="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Go to Plan
          </router-link>
        </div>
      </div>

      <!-- Configure Commissions Card -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="bg-white text-black px-6 py-4 font-semibold text-lg">
          Configure Commissions
        </div>
        <div class="p-6">
          <p class="text-gray-700 mb-4">
            Set SaaS, broker, and total commissions for property sales.
          </p>
          <router-link
            to="/commissions"
            class="inline-block px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
          >
            Go to Commissions
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Configurations",
};
</script>

<style scoped>
.bg-primary {
  background-color: #f97316; /* Tailwind orange-500 */
}
.bg-primary-dark {
  background-color: #ea580c; /* Tailwind orange-600 */
}
</style>
