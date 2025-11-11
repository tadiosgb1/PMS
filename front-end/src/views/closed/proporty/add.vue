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
          <div>
            <label class="block text-gray-700">Property manager</label>
            <select v-model="form.manager_id" class="custom-input">
              <option value="">Select Manager</option>
              <option
                class="text-black"
                v-for="manager in managers"
                :key="manager.manager.id"
                :value="manager.manager.id"
              >
                {{ manager.manager.first_name }}
                {{ manager.manager.middle_name }}
              </option>
            </select>
          </div>

          <!-- Property Zone -->
          <div>
            <label class="block text-gray-700">Property Zone</label>
            <select v-model="form.property_zone_id" class="custom-input">
              <option value="">Select Zone</option>
              <option
                class="text-black"
                v-for="zone in zones"
                :key="zone.id"
                :value="zone.id"
              >
                {{ zone.name }}
              </option>
            </select>
          </div>


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
        <label class="block text-gray-700">Property type</label>
        <select
          v-model="form.property_type"
          class="custom-input"
        >
          <option value="land">Land</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="room">Room</option>
        </select>
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
            <label class="block text-gray-700">Selling Price</label>
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
            <label class="block text-gray-700">Rent Price</label>
            <input
              v-model.number="form.rent"
              type="number"
              class="custom-input"
            />
          </div>
          <!-- <div>
            <label class="block text-gray-700">Status</label>
            <select v-model="form.status" class="custom-input">
              <option value="">Select</option>
              <option value="pending">Pending</option>
              <option value="available">Available</option>
            </select>
          </div> -->
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
      managers: [],
      users: [],
      zones: [],
      form: {
        property_zone_id: "",
        owner_id: localStorage.getItem("userId"),
        manager_id: "",
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
        status: "available",
      },
    };
  },
  async mounted() {
    // alert("hh")

    if (localStorage.getItem("is_superuser") == true) {
      const res = await this.$apiGet(`/get_managers`);
      console.log("res managers", res);
      this.managers = res.data || [];
    } else {
      console.log("managers for the owner");
      const params = {
        owner__id: localStorage.getItem("userId"),
      };
      console.log("params", params);

      const res = await this.$apiGet(`/get_owner_managers`, params);
      console.log("res managers", res);
      this.managers = res.data || [];
    }
    // this.fetchUser();
    //zones fetch

    // try {
    //   const isSuperUser =
    //     localStorage.getItem("is_superuser") == "1" ||
    //     localStorage.getItem("is_superuser") === "true";
    //   const params = isSuperUser
    //     ? {}
    //     : { manager_id__email: localStorage.getItem("email") };

    //   const response = await this.$apiGet(`/get_property_zones`, params);

    //   this.zones = response.data || [];

    //   console.log("zones",this.zones);

    // } catch (err) {
    //   console.error("Error fetching zones:", err);
    //   this.zones = [];
    // }

    const result = await this.$getZones();
    this.zones = result.zones;

    console.log("zones", this.zones);
  },

  methods: {
    async submitForm() {
      console.log("Payload proporty", this.form);

      try {
       const res = await this.$apiPost("/post_property", this.form);
       
       console.log("res properties fetch",res)
        this.$root.$refs.toast.showToast(
          "Property saved successfully ",
          "success"
        );
         this.$emit('refresh');
          this.$emit("close");

       //  this.$reloadPage();

        this.resetForm();
      
        
      } catch (err) {
        this.$root.$refs.toast.showToast(
          err.message.error || err.message.non_field_errors[0],
          "error"
        );
      }
    },
    // async fetchUser() {
    //   const response = await this.$apiGet("/get_users");
    //   this.users = response.data;
    // },
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
