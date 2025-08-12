<template>
  <div>
    <Toast ref="toast" />
    <div class="p-6 max-w-4xl mx-auto">
      <button
        @click="$router.back()"
        class="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        &larr; Back
      </button>

      <h1 v-if="property" class="text-2xl font-bold mb-4">Property Name: {{ property.name }}</h1>
      <p v-else>Loading...</p>

      <div v-if="property" class="grid grid-cols-2 gap-4 mb-6">
        <div class="mb-2"><strong>Name:</strong> {{ property.name }}</div>
        <div class="mb-2"><strong>Type:</strong> {{ property.property_type }}</div>
        <div class="mb-2"><strong>Address:</strong> {{ property.address }}</div>
        <div class="mb-2"><strong>City:</strong> {{ property.city }}</div>
        <div class="mb-2"><strong>State:</strong> {{ property.state }}</div>
        <div class="mb-2"><strong>Zip Code:</strong> {{ property.zip_code }}</div>
        <div class="mb-2"><strong>Price:</strong> {{ property.price }}</div>
        <div class="mb-2"><strong>Bedrooms:</strong> {{ property.bed_rooms }}</div>
        <div class="mb-2"><strong>Bathrooms:</strong> {{ property.bath_rooms }}</div>
        <div class="mb-2"><strong>Rent:</strong> {{ property.rent }}</div>
        <div class="mb-2"><strong>Status:</strong> {{ property.status }}</div>
        <div class="mb-2"><strong>Created At:</strong> {{ property.created_at }}</div>
        <div class="mb-2"><strong>Updated At:</strong> {{ property.updated_at || 'N/A' }}</div>
      </div>

      <h2 class="text-xl font-semibold mb-2 flex items-center justify-between">
        Pictures
        <button
          @click="addPictureVisible = true"
          class="bg-primary text-white px-4 py-1 rounded hover:bg-primary-dark"
        >
          + Add Picture
        </button>
      </h2>

      <div v-if="property && property.property_pictures && property.property_pictures.length" class="flex space-x-4 mb-8">
        <div
          v-for="(pic, index) in visiblePictures"
          :key="pic.id"
          class="border rounded overflow-hidden w-48 cursor-pointer hover:shadow-lg relative"
        >
          <img :src="pic.property_image" :alt="pic.description" class="object-cover w-full h-32" />
          <p class="text-sm p-2">{{ pic.description }}</p>

          <!-- Buttons container -->
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

        <button
          v-if="remainingPicturesCount > 0"
          @click="showAllPictures = true"
          class="flex items-center justify-center border border-primary text-primary rounded w-48 h-32 hover:bg-primary hover:text-white transition"
        >
          +{{ remainingPicturesCount }} More
        </button>
      </div>
      <div v-else class="mb-8 text-gray-500">No pictures available.</div>

      <!-- Modals -->
      <AddPictureModal
        v-if="addPictureVisible"
        :visible="addPictureVisible"
        :propertyId="property.id"
        :propertyName="property.name"
        @close="addPictureVisible = false"
        @refresh="fetchProperty"
      />
      <UpdatePictureModal
        v-if="updatePictureVisible"
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
    </div>
  </div>
</template>

<script>
import AddPictureModal from '@/views/closed/proporty/AddPropertyPicture.vue';
import UpdatePictureModal from '@/views/closed/proporty/UpdatePropertyPicture.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import Toast from '../../../components/Toast.vue';

export default {
  name: 'PropertyDetail',
  components: {
    AddPictureModal,
    UpdatePictureModal,
    ConfirmModal,
    Toast,
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
    };
  },
  computed: {
    visiblePictures() {
      if (!this.property?.property_pictures) return [];
      if (this.showAllPictures) return this.property.property_pictures;
      return this.property.property_pictures.slice(0, 4);
    },
    remainingPicturesCount() {
      if (!this.property?.property_pictures) return 0;
      return Math.max(0, this.property.property_pictures.length - 4);
    },
  },
  mounted() {
    this.fetchProperty();
  },
  methods: {
    async fetchProperty() {
      try {
        const res = await this.$apiGet(`/get_property/${this.$route.params.id}`);
        this.property = res.data || res; // adapt if API wraps in data
      } catch (err) {
        console.error('Failed to fetch property details', err);
        alert('Could not load property details.');
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
        const res = await this.$apiDelete(`/delete_property_picture/${this.pictureToDelete.id}`);
        this.$root.$refs.toast.showToast(res.message || 'Picture deleted successfully', 'success');
        this.fetchProperty();
      } catch (err) {
        console.error(err);
        alert('Failed to delete picture.');
      }
      this.pictureToDelete = null;
    },
  },
};
</script>
