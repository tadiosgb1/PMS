<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 m-3">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Contact Messages
        </div>

        <!-- Search & Page Size -->
        <div class="p-6 flex justify-between items-center mb-6">
          <input
            v-model="contactSearch"
            @input="fetchContactUs"
            type="search"
            placeholder="Search messages..."
            class="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="ml-4 flex items-center">
            <label for="contactPageSize" class="mr-2 text-gray-700">Show</label>
            <select
              id="contactPageSize"
              v-model="contactPageSize"
              @change="fetchContactUs"
              class="border px-2 py-1 rounded"
            >
              <option
                v-for="size in contactPageSizes"
                :key="size"
                :value="size"
              >
                {{ size }}
              </option>
            </select>
            <span class="ml-1 text-gray-700">per page</span>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto p-6">
          <table
            class="min-w-full table-auto border-collapse border border-gray-300 text-sm"
          >
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="border border-gray-300 px-4 py-2">Full Name</th>
                <th class="border border-gray-300 px-4 py-2">Email</th>
                <th class="border border-gray-300 px-4 py-2">Subject</th>
                <th class="border border-gray-300 px-4 py-2">Message</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="msg in contactMessages"
                :key="msg.id"
                class="hover:bg-gray-100"
              >
                <td class="border border-gray-300 px-4 py-2">
                  {{ msg.full_name }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ msg.email }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ msg.subject }}
                </td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ msg.message }}
                </td>
              </tr>
              <tr v-if="contactMessages.length === 0">
                <td
                  colspan="4"
                  class="text-center py-6 text-gray-500"
                >
                  No messages found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-6">
          <button
            :disabled="!contactPrev"
            @click="fetchContactUs(contactPrev)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span class="text-gray-600">
            Page {{ contactCurrentPage }} of {{ contactTotalPages }}
          </span>
          <button
            :disabled="!contactNext"
            @click="fetchContactUs(contactNext)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "ContactView",
  components: { Toast },
  data() {
    return {
      contactMessages: [],
      contactSearch: "",
      contactPageSize: 10,
      contactPageSizes: [5, 10, 20, 50, 100],
      contactCurrentPage: 1,
      contactTotalPages: 1,
      contactNext: null,
      contactPrev: null,
    };
  },
  mounted() {
    this.fetchContactUs();
  },
  methods: {
    async fetchContactUs(url = null) {
      try {
        const params = {
          page_size: this.contactPageSize,
          search: this.contactSearch || "",
          ordering: "-id",
        };
        const res = url
          ? await this.$apiGet(url)
          : await this.$apiGet("/contact_us", params);

        const data = res.data?.results || res.data || [];
        this.contactMessages = Array.isArray(data) ? data : [];

        this.contactNext = res.next || null;
        this.contactPrev = res.previous || null;
        this.contactCurrentPage =
          res.current_page ||
          (this.contactNext || this.contactPrev
            ? this.contactCurrentPage
            : 1);
        this.contactTotalPages = res.total_pages || 1;
      } catch (error) {
        console.error("Failed to fetch contact messages:", error);
        this.contactMessages = [];
        this.$refs.toast?.showToast("Failed to fetch messages", "error");
      }
    },
  },
};
</script>
