<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Zone Details
          <button
            @click="addPictureVisible = true"
            class="bg-white text-blue-700 font-semibold px-3 py-2 rounded shadow hover:bg-gray-100 border border-gray-300"
          >
            + Add Picture
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
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

          <!-- Zone Pictures -->
          <div class="mt-6">
            <h3 class="text-lg font-bold mb-2">Pictures</h3>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div
                v-for="pic in pictures"
                :key="pic.id"
                class="border rounded overflow-hidden relative cursor-pointer hover:shadow-lg"
              >
                <img
                  :src="pic.property_image"
                  class="w-full h-32 object-cover"
                  @click="previewImage(pic.property_image)"
                />
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
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Picture Modal -->
    <AddPropertyZonePicture
      v-if="addPictureVisible"
      :visible="addPictureVisible"
      :zoneId="$route.params.id"
      @close="addPictureVisible = false"
      @refresh="fetchPictures"
    />

    <!-- Update Picture Modal -->
    <UpdatePropertyZonePicture
      v-if="updatePictureVisible"
      :visible="updatePictureVisible"
      :picture="pictureToUpdate"
      :zoneId="$route.params.id"
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
import Toast from "@/components/Toast.vue";
import AddPropertyZonePicture from "./addPropertyZonePicture.vue";
import UpdatePropertyZonePicture from "./updatePropertyZonePicture.vue";
import ConfirmModal from "@/components/ConfirmModal.vue";

export default {
  name: "ZoneDetail",
  components: { Toast, AddPropertyZonePicture, UpdatePropertyZonePicture, ConfirmModal },
  data() {
    return {
      zone: null,
      pictures: [],
      addPictureVisible: false,
      updatePictureVisible: false,
      confirmDeleteVisible: false,
      pictureToUpdate: null,
      pictureToDelete: null,
      imagePreviewVisible: false,
      imageToPreview: null,
    };
  },
  mounted() {
    this.fetchZone();
    this.fetchPictures();
  },
  methods: {
    async fetchZone() {
      try {
        const res = await this.$apiGet(`/get_property_zone/${this.$route.params.id}`);
        this.zone = res.data || res;
      } catch (err) {
        console.error("Failed to fetch zone details", err);
        this.$refs.toast.showToast("Could not load zone details.", "error");
      }
    },
    async fetchPictures() {
      try {
        const res = await this.$apiGet(`/get_property_zone_pictures`, { property_zone_id: this.$route.params.id });
        this.pictures = res.data || [];
      } catch (err) {
        console.error("Failed to fetch zone pictures", err);
        this.pictures = [];
      }
    },
    openUpdatePicture(pic) {
      this.pictureToUpdate = pic;
      this.updatePictureVisible = true;
    },
    askDeletePicture(pic) {
      this.pictureToDelete = pic;
      this.confirmDeleteVisible = true;
    },
    async confirmDeletePicture() {
      this.confirmDeleteVisible = false;
      if (!this.pictureToDelete) return;
      try {
        const res = await this.$apiDelete(`/delete_property_zone_picture/${this.pictureToDelete.id}`);
        this.$root.$refs.toast.showToast(res.message || "Picture deleted", "success");
        this.fetchPictures();
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to delete picture", "error");
      }
      this.pictureToDelete = null;
    },
    previewImage(img) {
      this.imageToPreview = img;
      this.imagePreviewVisible = true;
    },
  },
};
</script>
