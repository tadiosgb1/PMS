<template>
  <div>
    <Toast ref="toast" />
    <div class="max-w-7xl p-4 mx-auto bg-white shadow rounded-lg overflow-hidden">
      <button
        @click="$router.back()"
        class="mb-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
      >
        &larr; Back
      </button>

      <h1 v-if="property" class="text-2xl font-bold mb-4">
        Property Name: {{ property.name }}
      </h1>
      <p v-else>Loading...</p>

      <!-- Property Details -->
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
        v-if="property && property.property_pictures && property.property_pictures.length"
        class="grid grid-cols-3 gap-4 mb-8"
      >
        <div
          v-for="(pic, index) in visiblePictures"
          :key="pic.id"
          class="border rounded overflow-hidden cursor-pointer hover:shadow-lg relative"
        >
          <img :src="pic.property_image" :alt="pic.description" class="object-cover w-full h-32" />
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

      <!-- Actions -->
      <div v-if="property">
        <button @click="saleProperty()" class="bg-primary text-white ml-14 px-4 py-1 rounded hover:bg-primary-dark">
          Sale this property
        </button>
      </div>
      <div v-if="property">
        <button @click="rentProperty()" class="mt-5 bg-primary text-white ml-14 px-4 py-1 rounded hover:bg-primary-dark">
          Rent this property
        </button>
      </div>

      <!-- ================== EXTRA SECTIONS ================== -->
      <div v-if="property" class="mt-10 flex-4">
        <!-- Maintenance Requests -->
        <h2 class="text-xl font-semibold mb-4">Maintenance Requests</h2>
        <Maintenance
          :visible="true"
          :propertyId="property.id"
          @close="maintenanceView = false"
        />

        <!-- Rent Payments (sample table) -->
        <div class="mt-10">
          <h2 class="text-xl font-semibold mb-4">Rent Payments</h2>
          <RentPayments :propertyId="property.id" />
        </div>

        <!-- Sale Payment (single record) -->
        <div class="mt-10">
          <h2 class="text-xl font-semibold mb-4">Sale Payment</h2>
          <SalePayment :propertyId="property.id" />
        </div>
      </div>
      <!-- ==================================================== -->

      <!-- Modals -->
       <AddRent v-if="visible" :visible="visible" @close="visible = false" />
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
    </div>
  </div>
</template>

<script>
import AddRent from "@/views/closed/tenant/add.vue";
import AddPictureModal from '@/views/closed/proporty/AddPropertyPicture.vue';
import UpdatePictureModal from '@/views/closed/proporty/UpdatePropertyPicture.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import Toast from '../../../components/Toast.vue';
import Maintenance from '@/views/closed/maintenance/view.vue';
import RentPayments from '@/views/closed/rent/RentPayments.vue';
import SalePayment from '@/views/closed/sale/SalePayment.vue';

export default {
  name: 'PropertyDetail',
  components: {
    AddPictureModal,
    UpdatePictureModal,
    ConfirmModal,
    Toast,
    Maintenance,
    RentPayments,
    SalePayment,
    AddRent
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
      visible: false
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
    saleProperty() {},
    rentProperty() {
      this.visible=true
    },
    async fetchProperty() {
      try {
        const res = await this.$apiGet(`/get_property/${this.$route.params.id}`);
        this.property = res.data || res;
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
