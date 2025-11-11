<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <Loading :visible="loading" message="Loading Property..." />
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Property Details
          <!-- <button
            @click="goBack"
            class="bg-white text-blue-700 font-semibold px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            ← Back to Properties
          </button> -->
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Property Title -->
          <div v-if="property" class="flex items-center justify-between mb-4">
  <h1 class="text-2xl font-bold">
    Property Name: {{ property.name }}
  </h1>
  <button
    v-if="$hasPermission('pms.change_property')"
    @click="editProperty(property)"
    class="text-blue-600 hover:text-blue-800"
    title="Edit"
  >
    <i class="fas fa-edit"></i>Edit Property
  </button>
</div>
          <p v-else>Loading...</p>

          <!-- Property Details -->
          <div v-if="property" class="grid grid-cols-2 gap-4 mb-6">
            <div><strong>Name:</strong> {{ property.name }}</div>
            <div><strong>Type:</strong> {{ property.property_type }}</div>
            <div><strong>Address:</strong> {{ property.address }}</div>
            <div><strong>City:</strong> {{ property.city }}</div>
            <div><strong>State:</strong> {{ property.state }}</div>
            <div><strong>Zip Code:</strong> {{ property.zip_code }}</div>
            <div><strong>Price:</strong> {{ property.price }}</div>
            <div><strong>Bedrooms:</strong> {{ property.bed_rooms }}</div>
            <div><strong>Bathrooms:</strong> {{ property.bath_rooms }}</div>
            <div><strong>Rent:</strong> {{ property.rent }}</div>
            <div><strong>Status:</strong> {{ property.status }}</div>
            <div><strong>Created At:</strong> {{ property.created_at }}</div>
            <div><strong>Updated At:</strong> {{ property.updated_at || "N/A" }}</div>
          </div>

          <!-- Pictures -->
          <h2 class="text-xl font-semibold mb-2 flex items-center">
            Pictures
            <button
              @click="addPictureVisible = true"
              class="bg-primary text-white ml-14 px-4 py-1 rounded hover:bg-primary-dark"
            >
              + Add Picture
            </button>
          </h2>

          <div
            v-if="property?.property_pictures?.length"
            class="grid grid-cols-3 gap-4 mb-8"
          >
            <div
              v-for="pic in visiblePictures"
              :key="pic.id"
              class="border rounded overflow-hidden cursor-pointer hover:shadow-lg relative"
            >
              <img
                :src="pic.property_image"
                :alt="pic.description"
                class="object-cover w-full h-32"
                @click="previewImage(pic.property_image)"
              />
              <p class="text-sm p-2">{{ pic.description }}</p>

              <!-- Picture actions -->
              <div class="absolute top-2 right-2 flex space-x-1">
                <button
                  @click.stop="openUpdatePicture(pic)"
                  class="bg-blue-600 text-white px-2 py-1 text-xs rounded hover:bg-blue-700"
                  title="Update Picture"
                >
                  Update
                </button>
                <button
                  @click.stop="askDeletePicture(pic)"
                  class="bg-red-600 text-white px-2 py-1 text-xs rounded hover:bg-red-700"
                  title="Delete Picture"
                >
                  Delete
                </button>
              </div>
            </div>

            <!-- Show more -->
            <div
              v-if="remainingPicturesCount > 0 && !showAllPictures"
              @click="showAllPictures = true"
              class="flex items-center justify-center border border-primary text-primary rounded hover:bg-primary hover:text-white transition cursor-pointer h-32"
            >
              +{{ remainingPicturesCount }} More
            </div>
          </div>
          <div v-else class="mb-8 text-gray-500">No pictures available.</div>

          <!-- Maintenance Requests -->
          <div v-if="property" class="mt-10">
            <h2 class="text-xl font-semibold mb-4">Maintenance Requests</h2>
            <Maintenance
              :visible="true"
              :propertyId="property.id"
              @close="maintenanceView = false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddPictureModal
      v-if="addPictureVisible && property"
      :visible="addPictureVisible"
      :propertyId="property.id"
      :propertyName="property.name"
      @close="addPictureVisible = false"
      @refresh="fetchProperty"
    />
    <UpdatePictureModal
      v-if="updatePictureVisible && property"
      :visible="updatePictureVisible"
      :picture="pictureToUpdate"
      :propertyId="property.id"
      @close="updatePictureVisible = false"
      @refresh="fetchProperty"
    />
    <ConfirmModal
      v-if="confirmDeleteVisible"
      :visible="confirmDeleteVisible"
      title="Confirm Delete"
      message="Are you sure you want to delete this picture?"
      @confirm="confirmDeletePicture"
      @cancel="confirmDeleteVisible = false"
    />

     <!-- 🆕 Add Update Property Modal -->
    <UpdateProperty
      v-if="updateVisible"
      :visible="updateVisible"
      :property="propertyToEdit"
      @close="updateVisible = false"
      @refresh="fetchProperty"
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
import AddPictureModal from "@/views/closed/proporty/AddPropertyPicture.vue";
import UpdatePictureModal from "@/views/closed/proporty/UpdatePropertyPicture.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";
import UpdateProperty from "@/views/closed/proporty/update.vue"; // 🆕 added
import Toast from "../../../components/Toast.vue";
import Maintenance from "@/views/closed/maintenanceRequests/view1.vue";
import Loading from "@/components/Loading.vue"; // <-- Added Loading

export default {
  name: "PropertyDetail",
  components: {
    AddPictureModal,
    UpdatePictureModal,
    UpdateProperty, // 🆕 added
    ConfirmModal,
    Toast,
    Maintenance,
    Loading
  },
  data() {
    return {
      property: null,
      addPictureVisible: false,
      updatePictureVisible: false,
      pictureToUpdate: null,
      confirmDeleteVisible: false,
      pictureToDelete: null,
      showAllPictures: false,
      maintenanceView: false,
      imagePreviewVisible: false,
      imageToPreview: null,
       updateVisible: false, // 🆕 added
      propertyToEdit: null, // 🆕 added
      loading:false
    };
  },
  computed: {
    visiblePictures() {
      if (!this.property?.property_pictures) return [];
      if (this.showAllPictures) return this.property.property_pictures;
      return this.property.property_pictures.slice(0, 3);
    },
    remainingPicturesCount() {
      if (!this.property?.property_pictures) return 0;
      return Math.max(0, this.property.property_pictures.length - 3);
    },
  },
  mounted() {
    this.fetchProperty();
  },
  methods: {
     // 🆕 Open update modal
    editProperty(property) {
      this.propertyToEdit = property;
      this.updateVisible = true;
    },
    async fetchProperty() {
      this.loading=true
      try {
        const res = await this.$apiGet(
          `/get_property/${this.$route.params.id}`
        );
        this.property = res.data || res;
      } catch (err) {
        console.error("Failed to fetch property details", err);
        this.$refs.toast.showToast("Could not load property details.", "error");
      }

      finally  {
  this.loading=false
      }
    },
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
          `/delete_property_picture/${this.pictureToDelete.id}`
        );
        this.$root.$refs.toast.showToast(res.message || "Picture deleted successfully", "success");
        this.fetchProperty();
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
    goBack() {
      this.$router.push({ path: "/properties" });
    },
  },
};
</script>
