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
      <Loading :visible="loading" message="Loading rents..." />
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Rents
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
              placeholder="Search Rent..."
              class="w-full sm:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div class="flex items-center space-x-2">
              <label for="pageSize" class="text-gray-700">Show</label>
              <select
                id="pageSize"
                v-model="pageSize"
                @change="fetchRents()"
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
<div class="hidden lg:block overflow-x-auto p-4">
  <table class="min-w-full table-auto border-collapse text-[13px] font-medium text-gray-700">
    <thead>
      <tr class="bg-gray-100 text-gray-800 uppercase tracking-wide text-[12px]">
        <th class="border-b border-gray-200 px-3 py-2 text-left">Property</th>
        <th class="border-b border-gray-200 px-3 py-2 text-left">Tenant</th>
        <th class="border-b border-gray-200 px-3 py-2 text-left">Rent Type</th>
        <th class="border-b border-gray-200 px-3 py-2 text-left">Payment Cycle</th>
        <th class="border-b border-gray-200 px-3 py-2 text-left">Start Date</th>
        <th class="border-b border-gray-200 px-3 py-2 text-left">End Date</th>
        <th class="border-b border-gray-200 px-3 py-2 text-left">Rent Amount</th>
        <th class="border-b border-gray-200 px-3 py-2 text-left">Deposit</th>
        <th class="border-b border-gray-200 px-3 py-2 text-left">Status</th>
        <th class="border-b border-gray-200 px-3 py-2 text-center">Actions</th>
      </tr>
    </thead>

    <tbody>
      <tr
        v-for="rent in rents"
        :key="rent.id"
        class="hover:bg-gray-50 even:bg-gray-50/40 transition-colors"
      >
        <!-- Property -->
        <td
          class="border-b border-gray-200 px-3 py-1.5 text-blue-600 hover:underline cursor-pointer truncate"
          @click="goToPropertyDetail(rent.property_id.id)"
        >
          {{ rent.property_id?.name || 'N/A' }}
        </td>

        <!-- Tenant -->
        <td
          class="border-b border-gray-200 px-3 py-1.5 text-blue-600 hover:underline cursor-pointer truncate"
          @click="goToUserDetail(rent.user_id.id)"
        >
          {{ rent.user_id?.first_name }} {{ rent.user_id?.last_name }}
        </td>

        <td class="border-b border-gray-200 px-3 py-1.5 truncate">{{ rent.rent_type }}</td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">{{ rent.payment_cycle }}</td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">
          {{ new Date(rent.start_date).toLocaleDateString() }}
        </td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">
          {{ new Date(rent.end_date).toLocaleDateString() }}
        </td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">{{ rent.rent_amount }}</td>
        <td class="border-b border-gray-200 px-3 py-1.5 truncate">{{ rent.deposit_amount }}</td>

        <!-- Status -->
        <td class="border-b border-gray-200 px-3 py-1.5 text-center">
          <span
            class="px-2 py-1 rounded text-xs font-semibold"
            :class="{
              'bg-green-100 text-green-700': rent.status === 'active',
              'bg-red-100 text-red-700': rent.status !== 'active'
            }"
          >
            {{ rent.status }}
          </span>
        </td>

        <!-- Actions -->
        <td class="border-b border-gray-200 px-3 py-1.5 text-center space-x-2">
          <button
            @click="selectedRentId = rent.id; showModal = true"
            class="relative px-3 py-1.5 text-green-600 border border-green-600 rounded-lg hover:text-white hover:bg-green-600 transition duration-300 ease-in-out"
            title="Pay Rent"
          >
            <i class="fas fa-credit-card mr-2"></i> Pay
          </button>

          <button
            @click="rentDetail(rent.id)"
            class="text-blue-600 hover:text-blue-800"
            title="Details"
          >
            <i class="fas fa-eye"></i>
          </button>

          <button
            @click="goToPayments(rent.id)"
            class="text-orange-600 hover:text-orange-800"
            title="Payments"
          >
            Payments
          </button>
        </td>
      </tr>

      <tr v-if="rents.length === 0">
        <td colspan="10" class="text-center py-6 text-gray-500 text-[13px]">
          No rents found.
        </td>
      </tr>
    </tbody>
  </table>
</div>

          <!-- ✅ List view for Mobile -->
          <div class="md:hidden space-y-4">
            <div
              v-for="rent in rents"
              :key="rent.id"
              class="bg-white border rounded-lg shadow-sm p-4 flex flex-col space-y-2"
            >
              <div class="flex justify-between items-center">
                <h3
                  class="font-semibold text-blue-600 hover:underline cursor-pointer"
                  @click="$router.push({ path: `/property-detail/${rent.property_id?.id}` })"
                >
                  {{ rent.property_id?.name || 'N/A' }}
                </h3>
                <span
                  class="text-sm font-medium px-2 py-1 rounded-full"
                  :class="{
                    'bg-green-100 text-green-700': rent.status === 'active',
                    'bg-red-100 text-red-700': rent.status !== 'active'
                  }"
                >
                  {{ rent.status }}
                </span>
              </div>
              <p
                class="text-blue-600 hover:underline cursor-pointer"
                @click="$router.push({ path: `/user-detail/${rent.user_id?.id}` })"
              >
                <strong>Tenant:</strong> {{ rent.user_id?.first_name }} {{ rent.user_id?.last_name }}
              </p>
              <p class="text-gray-600"><strong>Type:</strong> {{ rent.rent_type }}</p>
              <p class="text-gray-600"><strong>Payment Cycle:</strong> {{ rent.payment_cycle }}</p>
              <p class="text-gray-600"><strong>Rent Amount:</strong> {{ rent.rent_amount }}</p>
              <p class="text-gray-600"><strong>Deposit:</strong> {{ rent.deposit_amount }}</p>

              <div class="flex justify-end gap-2 mt-3">
                <button
                  @click="selectedRentId = rent.id; showModal = true"
                  class="px-3 py-1 text-xs text-green-600 border border-green-600 rounded hover:bg-green-600 hover:text-white transition"
                >
                  Pay
                </button>
                <button
                  @click="rentDetail(rent.id)"
                  class="px-3 py-1 text-xs text-blue-600 border border-blue-600 rounded hover:bg-blue-600 hover:text-white transition"
                >
                  Detail
                </button>
                <button
                  @click="goToPayments(rent.id)"
                  class="px-3 py-1 text-xs text-orange-600 border border-orange-600 rounded hover:bg-orange-600 hover:text-white transition"
                >
                  Payments
                </button>
              </div>
            </div>

            <p v-if="rents.length === 0" class="text-center text-gray-500">
              No rents found.
            </p>
          </div>

          <!-- Pagination -->
          <div class="flex flex-col sm:flex-row justify-between items-center mt-6 gap-3">
            <button
              :disabled="!previous"
              @click="fetchRents(previous)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Previous
            </button>
            <span class="text-gray-600">Page {{ currentPage }} of {{ totalPages }}</span>
            <button
              :disabled="!next"
              @click="fetchRents(next)"
              class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <AddPictureModal
        v-if="addPictureVisible"
        :visible="addPictureVisible"
        :rentId="selectedRentId"
        @close="addPictureVisible = false"
        @refresh="fetchRents"
      />
      <MakePaymentModal
        v-if="showModal"
        :visible="showModal"
        :rentId="selectedRentId"
        @close="showModal = false"
        @success="handlePaymentSuccess"
      />
      <AddRent
        v-if="visible"
        :propertyId="$route.params.id"
        :visible="visible"
        @close="visible = false"
        @refresh="fetchRents"
      />
      <UpdateRent
        v-if="updateVisible"
        :visible="updateVisible"
        :rent="rentToEdit"
        @close="updateVisible = false"
        @refresh="fetchRents"
      />
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this rent?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />
    </div>
  </div>
</template>

<script>
import AddRent from "@/views/closed/rent/add.vue";
import UpdateRent from "@/views/closed/rent/update.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import AddPictureModal from "@/views/closed/rent/addRentPicture.vue";
import MakePaymentModal from "@/views/closed/rent/addRentPayment.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

export default {
  name: "RentsView",
  components: {
    AddRent,
    UpdateRent,
    ConfirmModal,
    Toast,
    AddPictureModal,
    MakePaymentModal,
    Loading
  },
  data() {
    return {
      selectedRentId: "",
      addPictureVisible: false,
      searchTerm: "",
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      rentToEdit: null,
      rentToDelete: null,
      sortKey: "property_id",
      sortAsc: true,
      rents: [],
      showModal: false,
      pageSize: 10,
      pageSizes: [5, 10, 20, 50, 100],
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
     loading:false
    };
  },
  computed: {
    filteredAndSortedRents() {
      let sorted = [...this.rents];
      sorted.sort((a, b) => {
        let valA = a[this.sortKey];
        let valB = b[this.sortKey];
        if (this.sortKey === "property_id") {
          valA = a.property_id?.name || "";
          valB = b.property_id?.name || "";
        }
        if (this.sortKey === "user_id") {
          valA = a.user_id?.first_name || "";
          valB = b.user_id?.first_name || "";
        }
        if (valA < valB) return this.sortAsc ? -1 : 1;
        if (valA > valB) return this.sortAsc ? 1 : -1;
        return 0;
      });
      return sorted;
    },
  },
  mounted() {
    this.fetchRents();
  },
  methods: {
    goToPayments(rentId) {
      this.$router.push({ name: "rents_payment_detail", params: { id: rentId } });
    },
    rentDetail(rentId) {
      this.$router.push({ name: "rent-detail", params: { id: rentId } });
    },
    buildRoleParams(params = {}) {
      const isSuperUser =
        localStorage.getItem("is_superuser") === "1" ||
        localStorage.getItem("is_superuser") === "true";
      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const email = localStorage.getItem("email");

      if (!isSuperUser) {
        if (groups.includes("manager")) {
          params["property_id__property_zone_id__manager_id__email"] = email;
         
        } else if (groups.includes("owner")) {
          params["property_id__property_zone_id__owner_id__email"] = email;
             
        } else if (groups.includes("staff")) {
          params["property_id__property_zone_id__staff_id__email"] = email;
            
        }
      }
      return params;
    },
    async fetchRents(url = `/get_rents?search=${this.searchTerm}&page_size=${this.pageSize}`) {
      this.loading=true
      try {
        const params = this.buildRoleParams();
        const response = await this.$apiGet(url, params);
       console.log("response rents",response);

        if (response && response.data) {
          this.rents = response.data || [];
          this.next = response.next;
          this.previous = response.previous;
          this.currentPage = response.current_page;
          this.totalPages = response.total_pages;
        }
      } catch (error) {
        console.error("Failed to fetch rents:", error);
        this.rents = [];
      }
      finally {
        this.loading=false
      }
    },
    goToPropertyDetail(propertyId) {
      if (propertyId)
        this.$router.push({
          name: "PropertyDetail",
          params: { id: propertyId },
        });
    },
    goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    onSearch() {
      this.currentPage = 1;
      this.fetchRents();
    },
    sortBy(key) {
      if (this.sortKey === key) this.sortAsc = !this.sortAsc;
      else {
        this.sortKey = key;
        this.sortAsc = true;
      }
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
