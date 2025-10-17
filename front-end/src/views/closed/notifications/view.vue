<template>
  <div>
    <Toast ref="toast" />

    <div class="min-h-screen bg-gray-100 m-3">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div class="bg-primary text-white px-6 py-4 text-xl font-bold flex justify-between items-center">
          Notifications
        </div>

        <!-- Search & Page Size -->
        <div class="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <input
            v-model="searchTerm"
            type="search"
            placeholder="Search notifications..."
            class="w-full md:max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div class="flex items-center gap-2">
            <label for="pageSize" class="text-gray-700">Show</label>
            <select
              id="pageSize"
              v-model="pageSize"
              @change="fetchNotifications()"
              class="border px-2 py-1 rounded"
            >
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
            </select>
            <span class="text-gray-700">per page</span>
          </div>
        </div>

        <!-- Desktop Table -->
        <div class="hidden md:block overflow-x-auto p-4">
          <table class="min-w-full table-auto border-collapse border border-gray-300 text-sm">
            <thead>
              <tr class="bg-gray-200 text-gray-700">
                <th class="border border-gray-300 px-4 py-2">Message</th>
                <th class="border border-gray-300 px-4 py-2">Type</th>
                <th class="border border-gray-300 px-4 py-2">User</th>
                <th class="border border-gray-300 px-4 py-2">Maintenance detail</th>
                <th class="border border-gray-300 px-4 py-2">Payment detail</th>
                <th class="border border-gray-300 px-4 py-2">Rent detail</th>
                <th class="border border-gray-300 px-4 py-2">Created At</th>
                <th class="border border-gray-300 px-4 py-2">Status</th>
                <th class="border border-gray-300 px-4 py-2">Read At</th>
                <th class="border border-gray-300 px-4 py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="notif in filteredNotifications" :key="notif.id" class="hover:bg-gray-100">
                <td class="border border-gray-300 px-4 py-2">{{ notif.message }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ notif.notification_type }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  {{ notif.user_id.first_name }} {{ notif.user_id.middle_name }} {{ notif.user_id.last_name }}
                </td>
                <td class="border border-gray-300 px-4 py-2">{{ notif.maintenance_request_id }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ notif.payment_id }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ notif.rent_id }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ formatDate(notif.created_at) }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ notif.is_read ? "Read" : "Unread" }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ notif.read_at }}</td>
                <td class="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <button
                    v-if="!notif.is_read"
                    @click="markAsRead(notif.id)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >Mark as Read</button>

                  <button
                    @click="goToNotification(notif.id)"
                    class="text-blue-600 hover:text-blue-800 text-sm"
                  >Detail</button>

                  <router-link
                    v-if="notif.user_id"
                    :to="`/users/${notif.user_id}`"
                    class="text-green-600 hover:text-green-800 text-sm"
                  ><i class="fas fa-user"></i></router-link>

                  <router-link
                    v-if="notif.maintenance_request_id"
                    :to="`/maintenance/${notif.maintenance_request_id}`"
                    class="text-yellow-600 hover:text-yellow-800 text-sm"
                  ><i class="fas fa-tools"></i></router-link>

                  <router-link
                    v-if="notif.payment_id"
                    :to="`/payments/${notif.payment_id}`"
                    class="text-purple-600 hover:text-purple-800 text-sm"
                  ><i class="fas fa-credit-card"></i></router-link>

                  <router-link
                    v-if="notif.rent_id"
                    :to="`/rents/${notif.rent_id}`"
                    class="text-orange-600 hover:text-orange-800 text-sm"
                  ><i class="fas fa-home"></i></router-link>
                </td>
              </tr>
              <tr v-if="filteredNotifications.length === 0">
                <td colspan="10" class="text-center py-6 text-gray-500">No notifications found.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Card View -->
        <div class="md:hidden grid gap-4 p-4">
          <div v-for="notif in filteredNotifications" :key="notif.id" class="border rounded-lg bg-white shadow-sm p-4 space-y-2">
            <p class="font-semibold text-gray-800">{{ notif.message }}</p>
            <p class="text-sm text-gray-600"><strong>Type:</strong> {{ notif.notification_type }}</p>
            <p class="text-sm text-gray-600">
              <strong>User:</strong> {{ notif.user_id.first_name }} {{ notif.user_id.middle_name }} {{ notif.user_id.last_name }}
            </p>
            <p class="text-sm text-gray-600"><strong>Maintenance:</strong> {{ notif.maintenance_request_id }}</p>
            <p class="text-sm text-gray-600"><strong>Payment:</strong> {{ notif.payment_id }}</p>
            <p class="text-sm text-gray-600"><strong>Rent:</strong> {{ notif.rent_id }}</p>
            <p class="text-sm text-gray-600"><strong>Created At:</strong> {{ formatDate(notif.created_at) }}</p>
            <p class="text-sm text-gray-600"><strong>Status:</strong> {{ notif.is_read ? "Read" : "Unread" }}</p>
            <p class="text-sm text-gray-600"><strong>Read At:</strong> {{ notif.read_at }}</p>
            <div class="flex flex-wrap justify-end gap-2 pt-2">
              <button v-if="!notif.is_read" @click="markAsRead(notif.id)" class="text-blue-600 hover:text-blue-800 text-sm">Mark as Read</button>
              <button @click="goToNotification(notif.id)" class="text-blue-600 hover:text-blue-800 text-sm">Detail</button>
              <router-link
                v-if="notif.user_id"
                :to="`/users/${notif.user_id}`"
                class="text-green-600 hover:text-green-800 text-sm"
              ><i class="fas fa-user"></i></router-link>
              <router-link
                v-if="notif.maintenance_request_id"
                :to="`/maintenance/${notif.maintenance_request_id}`"
                class="text-yellow-600 hover:text-yellow-800 text-sm"
              ><i class="fas fa-tools"></i></router-link>
              <router-link
                v-if="notif.payment_id"
                :to="`/payments/${notif.payment_id}`"
                class="text-purple-600 hover:text-purple-800 text-sm"
              ><i class="fas fa-credit-card"></i></router-link>
              <router-link
                v-if="notif.rent_id"
                :to="`/rents/${notif.rent_id}`"
                class="text-orange-600 hover:text-orange-800 text-sm"
              ><i class="fas fa-home"></i></router-link>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center p-4 md:p-6">
          <button
            :disabled="!previous"
            @click="fetchNotifications(previous)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >Previous</button>
          <span class="text-gray-600 text-sm">Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            :disabled="!next"
            @click="fetchNotifications(next)"
            class="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          >Next</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Toast from "@/components/Toast.vue";

export default {
  name: "NotificationsView",
  components: { Toast },
  data() {
    return {
      notifications: [],
      searchTerm: "",
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      pageSize: 1000,
      pageSizes: [5, 10, 20, 50, 100],
    };
  },
  computed: {
    filteredNotifications() {
      const term = this.searchTerm.toLowerCase();
      return this.notifications.filter(
        (n) =>
          n.message.toLowerCase().includes(term) ||
          n.notification_type.toLowerCase().includes(term) ||
          (n.is_read ? "read" : "unread").includes(term)
      );
    },
  },
  mounted() {
    this.fetchNotifications();
  },
  methods: {
    goToNotification(id) {
    this.$router.push({ name: 'notificationDetail', params: { id } });
   },
    async fetchNotifications(customUrl = null) {
      try {
        let params = {
          user_id__email:localStorage.getItem('email'),
          page_size: this.pageSize,
          page: this.currentPage };
          if(localStorage.getItem('is_superuser'=='true')){
         params = {
          page_size: this.pageSize,
          page: this.currentPage };
          }
        const url = customUrl || "get_notifications";
        console.log("params for notif",params);

        const res = await this.$apiGet(`/get_notifications`, params);

        this.notifications = res.data || [];
        this.currentPage = res.current_page || 1;
        this.totalPages = res.total_pages || 1;
        this.next = res.next;
        this.previous = res.previous;
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
        this.notifications = [];
      }
    },
   async markAsRead(id) {

    console.log("id",id);

      try {
        const payload = { is_read: true };
        const res = await this.$apiPatch(`/update_notification`, id, payload);
       
        this.$root.$refs.toast.showToast("Successfully marked as red", "success");
        
      } catch (err) {
        console.error("Failed to mark as read:", err);
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleString();
    },
  },
};
</script>
