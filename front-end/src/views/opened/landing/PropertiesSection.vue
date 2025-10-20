<template>
  <section class="py-10 bg-gray-50">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-3xl font-bold text-gray-800">Our Properties</h2>
        <p class="text-gray-500 mt-2">Find your perfect space for rent, sale, or work in Ethiopia</p>
      </div>

      <!-- Tabs -->
      <div class="flex justify-center space-x-4 mb-6">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="changeTab(tab.key)"
          :class="[
            'px-5 py-2 rounded-full font-medium transition-all duration-300',
            currentTab === tab.key
              ? 'bg-primary text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Search -->
      <div class="flex justify-center mb-8">
        <div class="relative w-full sm:w-1/2">
          <input
            v-model="searchQuery"
            @input="filterByLocation"
            type="text"
            placeholder="Search by city or location..."
            class="w-full border border-gray-300 rounded-full px-5 py-2 focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            list="cityList"
          />
          <datalist id="cityList">
            <option v-for="city in cities" :key="city" :value="city" />
          </datalist>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-10">
        <span class="text-gray-500">Loading {{ currentTabLabel }}...</span>
      </div>

      <!-- Property Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in paginatedItems"
          :key="item.id"
          class="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
        >
          <!-- Image Section -->
          <div class="relative w-full h-52 rounded-t-2xl overflow-hidden" v-if="currentTab !== 'cowork'">
            <img
              :src="item.property_pictures && item.property_pictures.length > 0
                ? item.property_pictures[item.imageIndex].property_image
                : placeholder"
              class="w-full h-52 object-cover cursor-pointer"
              @click="openZoom(item.property_pictures ? item.imageIndex : null, item.property_pictures)"
            />

            <!-- Carousel arrows -->
            <div
              v-if="getImageCount(item) > 1"
              class="absolute inset-0 flex justify-between items-center px-2"
            >
              <button
                @click.stop="prevImage(item)"
                class="bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-primary hover:text-white transition"
              >
                ‹
              </button>
              <button
                @click.stop="nextImage(item)"
                class="bg-white/80 text-gray-800 p-2 rounded-full shadow hover:bg-primary hover:text-white transition"
              >
                ›
              </button>
            </div>

            <!-- Image counter -->
            <div
              v-if="getImageCount(item) > 0"
              class="absolute bottom-2 right-2 bg-white/80 text-xs text-gray-800 px-2 py-1 rounded-full"
            >
              {{ item.imageIndex + 1 }} / {{ getImageCount(item) }}
            </div>
          </div>

          <!-- Cowork placeholder -->
          <div
            class="w-full h-52 flex items-center justify-center bg-gray-100 text-gray-400 text-lg font-semibold"
            v-else
          >
            Coworking Space
          </div>

          <!-- Info -->
          <div class="p-5">
            <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ item.name }}</h3>
            <p class="text-gray-500 text-sm mb-2">{{ item.address || item.location }}, {{ item.city }}</p>

            <div class="text-gray-600 text-sm mb-3" v-if="currentTab !== 'cowork'">
              <p>Bedrooms {{ item.bed_rooms }} | Bathrooms {{ item.bath_rooms }}</p>
              <p>💰 ${{ item.price }}</p>
            </div>

            <div class="text-gray-600 text-sm mb-3" v-else>
              <p>Capacity: {{ item.capacity }}</p>
              <p>Daily: ${{ item.price_daily }}</p>
              <p>Monthly: ${{ item.price_monthly }}</p>
            </div>

            <button
              @click="item.showDownload = true"
              class="bg-primary text-white px-4 py-2 rounded-full w-full hover:opacity-90 transition"
            >
              {{ currentTab === "rent" ? "Rent Now" : currentTab === "sale" ? "Buy Now" : "Book Now" }}
            </button>

            <button
              v-if="item.showDownload"
              class="mt-3 bg-primary text-white px-4 py-2 rounded-full w-full hover:opacity-90 transition"
            >
              Download App
            </button>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div
        v-if="!loading && filteredItems.length === 0"
        class="text-center text-gray-500 py-10"
      >
        No {{ currentTabLabel }} found in {{ searchQuery || "Ethiopia" }}.
      </div>

      <!-- Pagination -->
      <div
        v-if="filteredItems.length > itemsPerPage"
        class="flex justify-center items-center mt-10 space-x-2"
      >
        <button
          @click="prevPage"
          :disabled="currentPage === 0"
          class="p-2 bg-white border border-gray-300 rounded-full hover:bg-primary hover:text-white disabled:opacity-50"
        >
          ‹
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="goToPage(page - 1)"
          :class="[
            'px-4 py-1 rounded-full text-sm font-medium transition',
            currentPage === page - 1
              ? 'bg-primary text-white'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
          ]"
        >
          {{ page }}
        </button>

        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages - 1"
          class="p-2 bg-white border border-gray-300 rounded-full hover:bg-primary hover:text-white disabled:opacity-50"
        >
          ›
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="zoomImage"
      class="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
      @click="closeZoom"
    >
      <img
        :src="zoomImage"
        class="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
        @click.stop
      />
      <button
        @click="closeZoom"
        class="absolute top-5 right-5 text-white text-2xl font-bold"
      >
        &times;
      </button>
    </div>
  </section>
</template>

<script>
export default {
  name: "PropertiesSection",
  data() {
    return {
      tabs: [
        { key: "rent", label: "For Rent" },
        { key: "sale", label: "For Sale" },
        { key: "cowork", label: "Co-working Spaces" },
      ],
      currentTab: "rent",
      items: [],
      filteredItems: [],
      loading: false,
      currentPage: 0,
      itemsPerPage: 3,
      searchQuery: "",
      zoomImage: null,
      placeholder: "https://via.placeholder.com/400x250?text=No+Image",
      cities: [
        "Addis Ababa",
        "Adama",
        "Bahir Dar",
        "Dire Dawa",
        "Hawassa",
        "Mekelle",
        "Jimma",
        "Gondar",
        "Harar",
        "Dessie",
      ],
    };
  },
  computed: {
    currentTabLabel() {
      return this.tabs.find((t) => t.key === this.currentTab)?.label.toLowerCase() || "";
    },
    totalPages() {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage);
    },
    paginatedItems() {
      const start = this.currentPage * this.itemsPerPage;
      return this.filteredItems.slice(start, start + this.itemsPerPage);
    },
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    async changeTab(tabKey) {
      if (this.currentTab !== tabKey) {
        this.currentTab = tabKey;
        this.currentPage = 0;
        this.searchQuery = "";
        this.fetchData();
      }
    },
    async fetchData() {
      try {
        this.loading = true;
        const url = this.currentTab === "cowork" ? "/get_coworking_spaces" : "/get_properties";
        const res = await this.$apiGet(url);
        this.items = (res.data || []).map((item) => ({
          ...item,
          imageIndex: 0,
          showDownload: false,
        }));
        this.filteredItems = [...this.items];
      } catch (error) {
        console.error(error);
        this.items = [];
        this.filteredItems = [];
      } finally {
        this.loading = false;
      }
    },
    filterByLocation() {
      const query = this.searchQuery.toLowerCase();
      this.filteredItems = this.items.filter(
        (item) =>
          item.city?.toLowerCase().includes(query) ||
          item.address?.toLowerCase().includes(query) ||
          item.location?.toLowerCase().includes(query)
      );
      this.currentPage = 0;
    },
    nextPage() {
      if (this.currentPage < this.totalPages - 1) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 0) this.currentPage--;
    },
    goToPage(page) {
      this.currentPage = page;
    },
    getImageCount(item) {
      return item.property_pictures?.length || 0;
    },
    nextImage(item) {
      const pictures = item.property_pictures || [];
      if (pictures.length > 1) item.imageIndex = (item.imageIndex + 1) % pictures.length;
    },
    prevImage(item) {
      const pictures = item.property_pictures || [];
      if (pictures.length > 1) item.imageIndex = (item.imageIndex - 1 + pictures.length) % pictures.length;
    },
    openZoom(index, pictures) {
      if (!pictures || pictures.length === 0) return;
      this.zoomImage = pictures[index].property_image;
    },
    closeZoom() {
      this.zoomImage = null;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
