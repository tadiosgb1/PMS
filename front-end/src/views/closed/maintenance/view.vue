<template>
  <div>
    <Toast ref="toast" />
    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] lg:max-w-[950px] xl:max-w-[1050px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <div
          class="bg-primary text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
        >
          Maintenance Detail
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

         <!-- Table -->
          <div class="overflow-x-auto">
            <table
              class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
            >
              <thead>
                <tr class="bg-gray-200 text-gray-700 text-left">
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('description')"
                  >
                    Description
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('status')"
                  >
                    Status
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('requested_at')"
                  >
                    Requested at
                  </th>
                  <th
                    class="border border-gray-300 px-3 py-2 cursor-pointer"
                    @click="sortBy('resolved_at')"
                  >
                    Resolved at
                  </th>

                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="maint in maitenance"
                  :key="maint.id"
                  class="hover:bg-gray-100"
                >
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ maint.description }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ maint.status }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ maint.requested_at }}
                  </td>
                  <td class="border border-gray-300 px-3 py-2 whitespace-nowrap">
                    {{ maint.resolved_at }}
                  </td>
                  
                </tr>
                <!-- <tr v-if="filteredAndSorted.length === 0">
                  <td colspan="6" class="text-center py-6 text-gray-500">
                    No properties found.
                  </td>
                </tr> -->
              </tbody>
            </table>
          </div>

       {{ this.propertyId }}
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "../../../components/Toast.vue";
export default {
  name: "AddProperty",
  components: { Toast },
  props: {
    visible: Boolean,
    propertyId:Number
  },
  data() {
    return {
      maitenance:null,
      users: [],
      zones:[],
      form: {
        property_zone_id:12,
        owner_id: localStorage.getItem("userId"),
        manager_id:"",
        name: "",
        property_type: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        price: "",
        bed_rooms: "",
        bath_rooms: "",
        rent: "",
        status: "",
      },
    };
  },
  async mounted() {
    this.fetchMaitenance();
    
     

  },
  methods: {
    async fetchMaitenance() {
  try {
    const response = await this.$apiGet("get_maintenance_requests", {
      property_id: this.propertyId
    });

    this.maitenance = response.data || [];
  } catch (err) {
    console.error("Failed to fetch maintenance", err);
  }
}
,
    resetForm() {
      this.form = {
        owner_id: "",
        name: "",
        property_type: "",
        address: "",
        city: "",
        state: "",
        zip_code: "",
        price: "",
        bed_rooms: "",
        bath_rooms: "",
        rent: "",
        status: "",
      };
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500;
}
</style>
