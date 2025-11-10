<template>
  <div
    v-if="visible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="flex flex-col items-center justify-center">
      <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      <p class="text-white mt-3 font-medium text-lg">{{ message }}</p>
    </div>
  </div>
</template>
<script>
export default {
  name: "Loading",
  props: {
    visible: { type: Boolean, default: false },
    message: { type: String, default: "Loading..." },
  },
};
</script>
<style scoped>
/* Optional: you can customize animation speed or colors here */
</style>
