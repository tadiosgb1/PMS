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
          Add Property
          <button
            @click="$emit('close')"
            class="text-white hover:text-gray-200 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form
          @submit.prevent="submitForm"
          class="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto"
        >
          <!-- Owner -->

          <div>
            <label class="block text-gray-700">Name</label>
            <input
              v-model="form.name"
              type="text"
              class="custom-input"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700">Property Zone</label>
            <input
              v-model="form.property_zone_id"
              type="text"
              class="custom-input"
              required
            />
          </div>

          <div>
            <label class="block text-gray-700">Property Type</label>
            <input
              v-model="form.property_type"
              type="text"
              class="custom-input"
            />
          </div>

          <div>
            <label class="block text-gray-700">Address</label>
            <input v-model="form.address" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">City</label>
            <input v-model="form.city" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">State</label>
            <input v-model="form.state" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">ZIP Code</label>
            <input v-model="form.zip_code" type="text" class="custom-input" />
          </div>

          <div>
            <label class="block text-gray-700">Price</label>
            <input
              v-model.number="form.price"
              type="number"
              class="custom-input"
            />
          </div>

          <div>
            <label class="block text-gray-700">Bedrooms</label>
            <input
              v-model.number="form.bed_rooms"
              type="number"
              class="custom-input"
            />
          </div>

          <div>
            <label class="block text-gray-700">Bathrooms</label>
            <input
              v-model.number="form.bath_rooms"
              type="number"
              class="custom-input"
            />
          </div>

          <div>
            <label class="block text-gray-700">Rent</label>
            <input
              v-model.number="form.rent"
              type="number"
              class="custom-input"
            />
          </div>

          <div>
            <label class="block text-gray-700">Status</label>
            <select v-model="form.status" class="custom-input">
              <option value="">Select</option>
              <option value="available">Available</option>
              <option value="rented">Rented</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div class="md:col-span-2 text-right">
            <button
              type="submit"
              class="bg-primary text-white font-semibold px-6 py-3 rounded shadow"
            >
              Save
            </button>
          </div>
        </form>
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
  },
  data() {
    return {
      users: [],
      form: {
        property_zone_id: "12",
        owner_id: localStorage.getItem("userId"),
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
  mounted() {
    this.fetchUser();
  },
  methods: {
    async submitForm() {
      console.log("Payload proporty", this.form);

      try {
        await this.$apiPost("/post_property", this.form);
        this.$root.$refs.toast.showToast(
          "Property saved successfully ",
          "success"
        );
        this.$emit("refresh");
        setTimeout(() => {
          this.$emit("close");
        }, 3000); // 3000 milliseconds = 3 seconds
        this.resetForm();
      } catch (err) {
        alert("Failed to save property");
      }
    },
    async fetchUser() {
      const response = await this.$apiGet("/get_users");
      this.users = response.data;
    },
    resetForm() {
      this.form = {
        property_zone_id: "12",
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
