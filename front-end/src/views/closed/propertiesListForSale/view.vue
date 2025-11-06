<template>
  <div>
    <Toast ref="toast" />

    <button
      @click="$router.back()"
      class="mb-4 ml-5 mt-5 px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
    >
      &larr; Back
    </button>

    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Property Sale Listings
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add
          </button>
        </div>

        <div class="p-6">
          <!-- Search & Page Size -->
          <div class="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <input
              v-model="searchTerm"
              @input="onSearch"
              type="search"
              placeholder="Search property sale listing..."
              class="w-full sm:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div class="flex items-center space-x-2">
              <label for="pageSize" class="text-gray-700">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchListings()"
                class="border px-2 py-1 rounded"
              >
                <option v-for="size in pageSizes" :key="size" :value="size">
                  {{ size }}
                </option>
              </select>
              <span class="text-gray-700">per page</span>
            </div>
          </div>

          <!-- ✅ Table for Desktop -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr class="bg-gray-200 text-gray-700">
                  <th class="border border-gray-300 px-4 py-2">Property Zone</th>
                  <th class="border border-gray-300 px-4 py-2">Listing Price</th>
                  <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr
                  v-for="listing in listings"
                  :key="listing.id"
                  class="hover:bg-gray-100"
                >
                  <td
                    class="border border-gray-300 px-4 py-2 text-blue-600 hover:underline cursor-pointer"
                    @click="goToZoneDetail(listing.property_zone_id?.id)"
                  >
                    {{ listing.property_zone_id?.name || 'N/A' }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2">
                    {{ formatCurrency(listing.listing_price) }}
                  </td>
                  <td class="border border-gray-300 px-4 py-2 text-center">
                    <button
                      @click="viewDetail(listing.id)"
                      class="px-3 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                    >
                      View
                    </button>
                  </td>
                </tr>

                <tr v-if="listings.length === 0">
                  <td colspan="3" class="text-center py-6 text-gray-500">No listings found.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- ✅ List view for Mobile -->
          <div class="md:hidden space-y-4">
            <div
              v-for="listing in listings"
              :key="listing.id"
              class="bg-white border rounded-lg shadow-sm p-4 flex flex-col space-y-2"
            >
              <div class="flex justify-between items-center">
                <h3
                  class="font-semibold text-blue-600 hover:underline cursor-pointer"
                  @click="goToZoneDetail(listing.property_zone_id?.id)"
                >
                  {{ listing.property_zone_id?.name || 'N/A' }}
                </h3>
              </div>
              <p class="text-gray-600">
                <strong>Listing Price:</strong> {{ formatCurrency(listing.listing_price) }}
              </p>

              <div class="flex justify-end mt-3">
                <button
                  @click="viewDetail(listing.id)"
                  class="px-3 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                >
                  View
                </button>
              </div>
            </div>

            <p v-if="listings.length === 0" class="text-center text-gray-500">
              No listings found.
            </p>
          </div>

          <!-- Pagination -->
          <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
            <button
              :disabled="!previous"
              @click="fetchListings(previous)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              :disabled="!next"
              @click="fetchListings(next)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Add Modal -->
      <AddPropertySaleListing
        v-if="visible"
        :visible="visible"
        @close="visible = false"
        @refresh="fetchListings"
      />
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";
import AddPropertySaleListing from "@/views/closed/propertiesListForSale/add.vue";

export default {
  name: "PropertySaleListingView",
  components: { Toast, AddPropertySaleListing },
  data() {
    return {
      listings: [],
      visible: false,
      searchTerm: "",
      next: null,
      previous: null,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      currentPage: 1,
      totalPages: 1,
    };
  },
  mounted() {
    this.fetchListings();
  },
  methods: {
    async fetchListings(url = `/get_property_sale_listing?search=${this.searchTerm}&page_size=${this.pageSize}`) {
      try {
        const response = await this.$apiGet(url);
        console.log("response listings", response);

        if (response && response.data) {
          this.listings = response.data || [];
          this.next = response.next;
          this.previous = response.previous;
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
        }
      } catch (error) {
        console.error("Failed to fetch property sale listings:", error);
        this.listings = [];
      }
    },
    onSearch() {
      this.currentPage = 1;
      this.fetchListings();
    },
    goToZoneDetail(zoneId) {
      if (zoneId)
        this.$router.push({
          name: "PropertyZoneDetail",
          params: { id: zoneId },
        });
    },
    viewDetail(id) {
      this.$router.push({ name: "property-sale-detail", params: { id } });
    },
    formatCurrency(value) {
      if (!value) return "N/A";
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value);
    },
  },
};
</script>

<style scoped>
@media (max-width: 768px) {
  .card {
    transition: box-shadow 0.2s ease-in-out;
  }
  .card:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
}
</style>
