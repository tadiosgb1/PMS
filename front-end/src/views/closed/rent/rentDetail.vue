<template>
  <div>
    <Toast ref="toast" />

    <!-- Back Button -->
    <button
      @click="$router.back()"
      class="mb-4 ml-5 mt-5 px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
    >
      &larr; Back
    </button>

    <!-- Rent Detail Card -->
    <div v-if="rent" class="min-h-screen bg-gray-100 p-6">
      <Loading :visible="loading" message="Loading rent details..." />
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-orange-500 text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Rent Detail
          <button
            @click="addPictureVisible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add Picture
          </button>
        </div>

        <!-- Rent Details -->
        <div class="p-6">
          <ul class="space-y-3">
            <li class="flex">
              <span class="w-40 font-semibold">Property:</span>
              <span>{{ rent.property_id?.name }}</span>
            </li>
            <li class="flex">
              <span class="w-40 font-semibold">Tenant:</span>
              <span>{{ rent.user_id?.first_name }} {{ rent.user_id?.last_name }}</span>
            </li>
            <li class="flex">
              <span class="w-40 font-semibold">Rent Type:</span>
              <span>{{ rent.rent_type }}</span>
            </li>
            <li class="flex">
              <span class="w-40 font-semibold">Start Date:</span>
              <span>{{ rent.start_date }}</span>
            </li>
            <li class="flex">
              <span class="w-40 font-semibold">End Date:</span>
              <span>{{ rent.end_date }}</span>
            </li>
            <li class="flex">
              <span class="w-40 font-semibold">Payment Cycle:</span>
              <span>{{ rent.payment_cycle }}</span>
            </li>
            <li class="flex">
              <span class="w-40 font-semibold">Rent Amount:</span>
              <span>{{ rent.rent_amount }}</span>
            </li>
            <li class="flex">
              <span class="w-40 font-semibold">Deposit Amount:</span>
              <span>{{ rent.deposit_amount }}</span>
            </li>
            <li class="flex">
              <span class="w-40 font-semibold">Status:</span>
              <span>{{ rent.status }}</span>
            </li>
          </ul>

          <!-- Buttons -->
          <div class="mt-6 space-x-3">
            <button
              @click="viewPayments(rent.id)"
              class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              View Payments
            </button>
            <button
              @click="editRent(rent)"
              class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
            >
              Edit
            </button>
          </div>

          <!-- 🆕 UPDATED: Pictures section now matches PropertyDetail.vue -->
          <div class="mt-8">
            <h3 class="text-lg font-bold mb-2 flex items-center">
              Pictures
            </h3>

            <!-- 🆕 Picture grid with limited display and “+X More” -->
            <div
              v-if="pictures?.length"
              class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            >
              <div
                v-for="pic in visiblePictures"
                :key="pic.id"
                class="border rounded overflow-hidden cursor-pointer hover:shadow-lg relative"
              >
                <img
                  :src="pic.rent_image"
                  :alt="'Rent picture ' + pic.id"
                  class="w-full h-32 object-cover"
                  @click="previewImage(pic.rent_image)"
                />

                <!-- 🆕 Added description -->
                <p class="text-sm p-2">{{ pic.description }}</p>

                <!-- Picture Actions -->
                <div class="absolute top-2 right-2 flex space-x-1">
                  <button
                    @click.stop="openUpdatePicture(pic)"
                    class="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
                  >
                    Update
                  </button>
                  <button
                    @click.stop="askDeletePicture(pic)"
                    class="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <!-- 🆕 “+X More” Button -->
              <div
                v-if="remainingPicturesCount > 0 && !showAllPictures"
                @click="showAllPictures = true"
                class="flex items-center justify-center border border-primary text-primary rounded hover:bg-primary hover:text-white transition cursor-pointer h-32"
              >
                +{{ remainingPicturesCount }} More
              </div>
            </div>

            <div v-else class="mb-8 text-gray-500">No pictures available.</div>
          </div>
        </div>
      </div>
    </div>

    <!-- If no rent found -->
    <div v-else class="p-6 text-center text-gray-500">
      No rent found.
    </div>

    <!-- Add Picture Modal -->
    <AddPictureModal
      v-if="addPictureVisible"
      :visible="addPictureVisible"
      :rentId="rentId"
      @close="addPictureVisible = false"
      @refresh="fetchPictures"
    />

    <!-- Update Picture Modal -->
    <UpdatePictureModal
      v-if="updatePictureVisible"
      :visible="updatePictureVisible"
      :picture="pictureToUpdate"
      :rentId="rentId"
      @close="updatePictureVisible = false"
      @refresh="fetchPictures"
    />

    <!-- Confirm Delete -->
    <ConfirmModal
      v-if="confirmDeleteVisible"
      :visible="confirmDeleteVisible"
      title="Confirm Delete"
      message="Are you sure you want to delete this picture?"
      @confirm="confirmDeletePicture"
      @cancel="confirmDeleteVisible = false"
    />

    <!-- Image Preview Modal -->
    <div
      v-if="imagePreviewVisible"
      class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      @click="imagePreviewVisible = false"
    >
      <img
        :src="imageToPreview"
        alt="Preview"
        class="max-h-[90%] max-w-[90%] rounded shadow-lg"
        @click.stop
      />
      <button
        @click="imagePreviewVisible = false"
        class="absolute top-4 right-4 bg-white text-black px-3 py-1 rounded hover:bg-gray-200"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script>
import AddPictureModal from "@/views/closed/rent/addRentPicture.vue";
import UpdatePictureModal from "@/views/closed/rent/updateRentPicture.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import Toast from "@/components/Toast.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

export default {
  name: "RentDetailView",
  components: { AddPictureModal, UpdatePictureModal, ConfirmModal, Toast,Loading },
  data() {
    return {
      rent: null,
      pictures: [],
      rentId: "",
      addPictureVisible: false,
      updatePictureVisible: false,
      confirmDeleteVisible: false,
      pictureToUpdate: null,
      pictureToDelete: null,
      imagePreviewVisible: false,
      imageToPreview: null,
      showAllPictures: false,
      loading:false
    };
  },
   computed: {
    // 🆕 ADDED Computed Properties for picture display
    visiblePictures() {
      if (!this.pictures) return [];
      return this.showAllPictures ? this.pictures : this.pictures.slice(0, 3);
    },
    remainingPicturesCount() {
      if (!this.pictures) return 0;
      return Math.max(0, this.pictures.length - 3);
    },
  },
  mounted() {
    this.rentId = this.$route.params.id;
    this.fetchRent();
    this.fetchPictures();
  },
  methods: {
    async fetchRent() {
      this.loading=true
      try {
        const response = await this.$apiGetById(`/get_rent`, this.rentId);
        this.rent = response;
      } catch (error) {
        console.error("Failed to fetch rent:", error);
        this.rent = null;
      }
      finally {
        this.loading=false
      }
    },
    async fetchPictures() {
      if (!this.rentId) return;
      try {
        const response = await this.$apiGet(`/get_rent_pictures`, {
          rent_id: this.rentId,
        });
        this.pictures = response?.data || [];
      } catch (error) {
        console.error("Failed to fetch pictures:", error);
        this.pictures = [];
      }
    },

    // Picture actions
    openUpdatePicture(picture) {
      this.pictureToUpdate = picture;
      this.updatePictureVisible = true;
    },
    askDeletePicture(picture) {
      this.pictureToDelete = picture;
      this.confirmDeleteVisible = true;
    },
    async confirmDeletePicture() {
      this.confirmDeleteVisible = false;
      if (!this.pictureToDelete) return;
      try {
        const res = await this.$apiDelete(
          `/delete_rent_picture/${this.pictureToDelete.id}`
        );
        this.$root.$refs.toast.showToast(res.message || "Picture deleted", "success");
        this.fetchPictures();
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to delete picture.", "error");
      }
      this.pictureToDelete = null;
    },

    previewImage(imageUrl) {
      this.imageToPreview = imageUrl;
      this.imagePreviewVisible = true;
    },

    // Other actions
    viewPayments(rentId) {
      this.$router.push({
          name: "rents_payment_detail",
          params: { id: rentId },
        });
    },
    editRent(rent) {
      console.log("Edit rent:", rent);
    },
  },
};
</script>
