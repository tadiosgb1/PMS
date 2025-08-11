<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-6">
      <div class="max-w-7xl mx-auto bg-white shadow rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Properties
          <button
            @click="visible = true"
            class="bg-white text-blue-700 font-semibold px-1 lg:px-4 py-2 rounded shadow hover:bg-gray-100 hover:shadow-md transition-all duration-200 border border-gray-300"
          >
            <span class="text-primary">+</span> Add
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Search -->
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search properties..."
            class="w-full max-w-md px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <!-- Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
              <thead>
                <tr class="bg-gray-200 text-gray-700 text-left">
                  <th
                    v-for="field in fields"
                    :key="field.key"
                    @click="sortBy(field.key)"
                    class="border border-gray-300 px-3 py-2 cursor-pointer whitespace-nowrap"
                  >
                    {{ field.label }}
                    <SortIcon :field="field.key" :sort-key="sortKey" :sort-asc="sortAsc" />
                  </th>
                  <th class="border border-gray-300 px-3 py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="property in filteredAndSorted" :key="property.id" class="hover:bg-gray-100">
                  <td
                    v-for="field in fields"
                    :key="field.key"
                    class="border border-gray-300 px-3 py-2 whitespace-nowrap"
                  >
                    <!-- Check if field is property_pictures -->
                    <template v-if="field.key === 'property_pictures'">
                      <button
                        @click="showPictures(property)"
                        class="text-blue-600 hover:text-blue-800 underline"
                        title="View Pictures"
                      >
                        View Pictures ({{ property.property_pictures.length }})
                      </button>
                    </template>
                    <template v-else>
                      {{ property[field.key] }}
                    </template>
                  </td>
                  <td class="border border-gray-300 px-3 py-2 text-center space-x-2">
                    <button @click="editProperty(property)" class="text-blue-600 hover:text-blue-800" title="Edit">
                      <i class="fas fa-edit"></i>
                    </button>
                    <button
                      @click="askDeleteConfirmation(property)"
                      class="text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      <i class="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="filteredAndSorted.length === 0">
                  <td :colspan="fields.length + 1" class="text-center py-6 text-gray-500">No properties found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <AddProperty v-if="visible" :visible="visible" @close="visible = false" @refresh="fetchProperties" />
      <UpdateProperty
        v-if="updateVisible"
        :visible="updateVisible"
        :property="propertyToEdit"
        @close="updateVisible = false"
        @refresh="fetchProperties"
      />
      <ConfirmModal
        v-if="confirmVisible"
        :visible="confirmVisible"
        title="Confirm Deletion"
        message="Are you sure you want to delete this property?"
        @confirm="confirmDelete"
        @cancel="confirmVisible = false"
      />

      <!-- Picture Modal -->
      <div v-if="picturesVisible" class="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-auto relative">
          <button @click="picturesVisible = false" class="absolute top-2 right-2 text-gray-700 hover:text-gray-900 text-xl font-bold">
            &times;
          </button>
          <h3 class="text-xl font-bold mb-4">Property Pictures</h3>
          <div class="grid grid-cols-3 gap-4">
            <div v-for="pic in selectedPictures" :key="pic.id" class="border rounded overflow-hidden">
              <img :src="pic.property_image" :alt="pic.description" class="object-cover w-full h-48" />
              <p class="text-sm p-2">{{ pic.description }}</p>
            </div>
            <div v-if="selectedPictures.length === 0" class="col-span-3 text-center text-gray-500">
              No pictures available.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// ... your imports ...
import AddProperty from '@/views/closed/proporty/add.vue';
import UpdateProperty from '@/views/closed/proporty/update.vue';
import ConfirmModal from '@/components/ConfirmModal.vue';
import Toast from "../../../components/Toast.vue";

const SortIcon = {
  props: ['field', 'sortKey', 'sortAsc'],
  template: `
    <span class="inline-block ml-1 text-gray-500">
      <svg v-if="sortKey !== field" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
      <svg v-else-if="sortAsc" xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 13l4 4 4-4m0-6l-4-4-4 4"/>
      </svg>
      <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
      </svg>
    </span>
  `
};

export default {
  name: 'PropertyView',
  components: { SortIcon, AddProperty, UpdateProperty, ConfirmModal, Toast },
  data() {
    return {
      properties: [],
      visible: false,
      updateVisible: false,
      confirmVisible: false,
      propertyToEdit: null,
      propertyToDelete: null,
      searchTerm: '',
      sortKey: 'name',
      sortAsc: true,
      fields: [
        { key: 'name', label: 'Name' },
        { key: 'property_type', label: 'Type' },
        { key: 'address', label: 'Address' },
        { key: 'city', label: 'City' },
        { key: 'state', label: 'State' },
        { key: 'zip_code', label: 'Zip Code' },
        { key: 'price', label: 'Price' },
        { key: 'bed_rooms', label: 'Bedrooms' },
        { key: 'bath_rooms', label: 'Bathrooms' },
        { key: 'rent', label: 'Rent' },
        { key: 'status', label: 'Status' },
        { key: 'created_at', label: 'Created' },
        { key: 'updated_at', label: 'Updated' },
        { key: 'property_pictures', label: 'Property Pictures' }
      ],
      picturesVisible: false,
      selectedPictures: []
    };
  },
  computed: {
    filteredAndSorted() {
      const term = this.searchTerm.toLowerCase();
      let filtered = this.properties.filter(p =>
        Object.values(p).some(val =>
          String(val).toLowerCase().includes(term)
        )
      );

      filtered.sort((a, b) => {
        let res = 0;
        if (a[this.sortKey] < b[this.sortKey]) res = -1;
        if (a[this.sortKey] > b[this.sortKey]) res = 1;
        return this.sortAsc ? res : -res;
      });

      return filtered;
    }
  },
  mounted() {
    this.fetchProperties();
  },
  methods: {
    async fetchProperties() {
      try {
        const res = await this.$apiGet('/get_properties');
        this.properties = res.data;
      } catch (err) {
        console.error('Failed to fetch properties', err);
        alert('Could not load properties.');
      }
    },
    sortBy(key) {
      if (this.sortKey === key) {
        this.sortAsc = !this.sortAsc;
      } else {
        this.sortKey = key;
        this.sortAsc = true;
      }
    },
    editProperty(property) {
      this.propertyToEdit = property;
      this.updateVisible = true;
    },
    askDeleteConfirmation(property) {
      this.propertyToDelete = property;
      this.confirmVisible = true;
    },
    async confirmDelete() {
      this.confirmVisible = false;
      try {
        const res = await this.$apiDelete(`/delete_property/${this.propertyToDelete.id}`);
        this.$refs.toast.showToast(res.message, 'success');
        this.fetchProperties();
      } catch (err) {
        console.error(err);
        alert('Failed to delete property.');
      }
      this.propertyToDelete = null;
    },
    showPictures(property) {
      this.selectedPictures = property.property_pictures || [];
      this.picturesVisible = true;
    }
  }
};
</script>

<style scoped>
/* Optional: style for modal images */
</style>
