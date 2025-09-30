<template>
  <div>
    <Toast ref="toast" />
    <div
      v-if="visible"
      class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-auto"
    >
      <div
        class="bg-white w-full sm:w-auto sm:max-w-[700px] md:max-w-[850px] rounded-lg shadow-lg overflow-hidden relative mx-auto"
      >
        <div
          class="bg-orange-500 text-white px-6 py-4 text-2xl font-semibold flex justify-between items-center"
        >
          Update Rent Picture
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
          <!-- Description -->
          <div class="md:col-span-2">
            <label class="block mb-2 font-medium text-gray-700">Description</label>
            <textarea
              v-model="form.description"
              maxlength="200"
              class="w-full px-4 py-2 border rounded-md"
            />
            <p class="text-xs text-gray-400 mt-1">
              {{ (form.description || '').length }}/200
            </p>
          </div>

          <!-- Current image -->
          <div v-if="form.rent_image" class="md:col-span-2">
            <p class="text-sm text-gray-500 mb-1">Current Image:</p>
            <img
              :src="form.rent_image"
              class="rounded-lg max-h-48 object-cover"
            />
          </div>

          <!-- Replace image -->
          <div>
            <label class="block mb-2 font-medium text-gray-700">Replace Image</label>
            <input type="file" @change="onFileChange" accept="image/*" />
            <div v-if="form.preview" class="mt-3">
              <img :src="form.preview" class="rounded-lg max-h-48 object-cover" />
            </div>
          </div>

          <div class="md:col-span-2 text-right">
            <button
              type="submit"
              class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded shadow"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "UpdateRentPicture",
  components: { Toast },
  props: {
    visible: Boolean,
    picture: Object,
    rentId: Number,
  },
  data() {
    return {
      form: {
        id: null,
        description: "",
        rent_image: "",
        rent_id: this.rentId,
        file: null,
        preview: null,
      },
    };
  },
  watch: {
    picture: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.form = {
            ...newVal,
            description: newVal.description || "",
            rent_id: this.rentId,
            file: null,
            preview: null,
          };
        }
      },
    },
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files[0];
      if (!file) return;
      this.form.file = file;
      this.form.preview = URL.createObjectURL(file);
    },
    async submitForm() {
      try {
        const fd = new FormData();
        fd.append("description", this.form.description);
        fd.append("rent_id", this.form.rent_id);
        if (this.form.file) fd.append("rent_image", this.form.file);

        const res = await this.$apiPut(
          "/update_rent_picture",
          this.form.id,
          fd,
          { "Content-Type": "multipart/form-data" }
        );
        const msg = res?.message || "Rent picture updated";
        this.$root.$refs.toast.showToast(msg, "success");
        this.$emit("refresh");
        setTimeout(() => this.$emit("close"), 1000);
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast.showToast("Failed to update rent picture", "error");
      }
    },
  },
};
</script>

<style scoped>
.custom-input {
  @apply w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500;
}
</style>
