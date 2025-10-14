<template>
  <div class="bg-white shadow rounded-lg m-3">
    <Toast ref="toast" />

    <!-- Header -->
    <div
      class="bg-primary text-white px-6 py-3 text-lg font-bold flex justify-between items-center"
    >
      Rent Payments
    </div>

    <!-- Controls (hide in detail view) -->
    <div v-if="!rentId" class="flex justify-between items-center p-4">
      <!-- Search -->
      <input
        v-model="searchTerm"
        @input="fetchPayments(1)"
        type="search"
        placeholder="Search payments..."
        class="px-3 py-2 border rounded w-full max-w-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- Status -->
      <div class="flex items-center">
        <label class="mr-2 text-sm text-gray-600">Status</label>
        <select
          @change="fetchPayments(1)"
          v-model="statusFilter"
          class="px-2 py-1 border rounded-md text-sm"
        >
          <option value="all">All</option>
          <option value="complete">Completed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div class="flex items-center">
        <label class="mr-2 text-sm text-gray-600">Payment Method</label>
        <select
          @change="fetchPayments(1)"
          v-model="payment_method"
          class="px-2 py-1 border rounded-md text-sm"
        >
          <option value="">All</option>
          <option value="tellebirr">Tellebirr</option>
          <option value="cash">Cash</option>
        </select>
      </div>
      <!-- Show -->
      <div class="ml-4">
        <label class="mr-2 text-sm text-gray-600">Show</label>
        <select
          v-model.number="perPage"
          @change="fetchPayments(1)"
          class="px-2 py-1 border rounded"
        >
          <option v-for="n in [5, 10, 20, 50, 100, 1000]" :key="n" :value="n">
            {{ n }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="p-4 overflow-x-auto">
      <table class="min-w-full border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-3 py-2 text-left">#</th>
            <th class="px-3 py-2 text-left">Amount</th>
            <th class="px-3 py-2 text-left">Due Date</th>
            <th class="px-3 py-2 text-left">Payment Method</th>
            <th class="px-3 py-2 text-left">Transaction ID</th>
            <th class="px-3 py-2 text-left">Status</th>
            <th class="px-3 py-2 text-left">Created At</th>
            <th class="px-3 py-2 text-left">Updated At</th>
            <th class="px-3 py-2 text-left">Rent Info </th>
            <th class="px-3 py-2 text-left">User </th>
            <th class="px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(payment, index) in filteredPayments"
            :key="payment.id"
            class="border-t"
          >
            <td class="px-3 py-2">{{ index + 1 }}</td>
            <td class="px-3 py-2">{{ payment.amount }} ETB</td>
            <td class="px-3 py-2">{{ formatDate(payment.due_date) }}</td>
            <td class="px-3 py-2">{{ payment.payment_method }}</td>
            <td class="px-3 py-2">{{ payment.transaction_id }}</td>
            <td class="px-3 py-2">
              <span
                class="px-2 py-1 rounded text-xs font-semibold"
                :class="{
                  'bg-green-100 text-green-800': payment.status === 'paid',
                  'bg-red-100 text-red-800': payment.status === 'pending',
                }"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-3 py-2">{{ formatDate(payment.created_at) }}</td>
            <td class="px-3 py-2">
              {{ payment.updated_at ? formatDate(payment.updated_at) : "-" }}
            </td>
                 <td class="px-3 py-2"><button
                      @click="goToRentDetail(payment.rent_id)"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                      title="View Payment"
                    >
                      View Detail
                    </button></td>
                   <td class="px-3 py-2"><button
                      @click="goToUserDetail(payment.user_id)"
                      class="text-blue-600 hover:text-blue-800 focus:outline-none"
                      title="View Payment"
                    >
                      View Detail
                    </button> </td>


            <td class="px-3 py-2 text-center">
              <button
                v-if="payment.status == 'pending' || payment.status == 'cancelled'"
                @click="approve(payment)"
                class="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                Approve
              </button>

              <button
                v-if="payment.status == 'pending' || payment.status == 'complete'"
                @click="reject(payment)"
                class="ml-2 text-red-600 hover:text-red-800 focus:outline-none"
              >
                Cancel
              </button>
            </td>
          </tr>
          <tr v-if="filteredPayments.length === 0">
            <td colspan="11" class="px-3 py-4 text-center text-gray-500">
              No payments found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination (hide in detail view) -->
    <div
      v-if="!rentId"
      class="flex justify-between items-center p-4 text-sm text-gray-600"
    >
      <button
        @click="fetchUrl(previous)"
        :disabled="!previous"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="fetchUrl(next)"
        :disabled="!next"
        class="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "RentPayments",
  data() {
    return {
      payments: [],
      searchTerm: "",
      perPage: 10,
      currentPage: 1,
      totalPages: 1,
      next: null,
      previous: null,
      statusFilter: "all",
      payment_method:""
    };
  },
  computed: {
    
    rentId() {
      return this.$route.params.rent_id || null;
    },
    filteredPayments() {
      const term = this.searchTerm.toLowerCase();
      return this.payments.filter((p) =>
        Object.values(p).some((val) =>
          String(val || "").toLowerCase().includes(term)
        )
      );
    },
  },
  mounted() {
    this.fetchPayments(1);
  },
  watch: {
    "$route.params.id"() {
      this.fetchPayments(1);
    },
  },
  methods: {
     goToUserDetail(id) {
      this.$router.push(`/user_detail/${id}`);
    },
    goToRentDetail(id) {
      this.$router.push(`/rent-detail/${id}`);
    },
    // --- role-based filtering helper ---
    buildRoleParams(params = {}) {
      const isSuperUser =
        localStorage.getItem("is_superuser") === "1" ||
        localStorage.getItem("is_superuser") === "true";

      const groups = JSON.parse(localStorage.getItem("groups") || "[]");
      const email = localStorage.getItem("email");
      const id=localStorage.getItem("userId");

      if (!isSuperUser) {
        if (groups.includes("manager")) {
          params = {
            ...params,
            "rent_id__property_id__property_zone_id__manager_id__email": email,
            payment_method:this.payment_method
          };
        } else if (groups.includes("owner")) {
          params = {
            ...params,  
            "rent_id__property_id__property_zone_id__owner_id__email": email,
              payment_method:this.payment_method
          };
        } else if (groups.includes("staff")) {
          params = { ...params, "rent_id__property_id__property_zone_id__staff_id__id": id ,
              payment_method:this.payment_method
          };
        } else if (groups.includes("super_staff")) {
          params = { ...params }; // sees all payments
        }
      }else{
        params={
            payment_method:this.payment_method
        }
      }
      return params;
    },

    async fetchPayments(page = 1) {
      try {
        let params = this.buildRoleParams();

        if (this.rentId) {
          // Detail mode: only rent_id
          params = { ...params, rent_id__id: this.rentId };
        } else {
          // List mode
          params = { ...params, page, page_size: this.perPage };
          if (this.statusFilter !== "all") {
            params.status = this.statusFilter;
          }
        }


        console.log("params payments",params);

        const res = await this.$apiGet("/get_payments", params);

        console.log("res for payments",res)

        this.payments = Array.isArray(res.data) ? res.data : [];
        this.currentPage = res.current_page || 1;
        this.totalPages = res.total_pages || 1;
        this.next = res.next || null;
        this.previous = res.previous || null;
      } catch (error) {
        console.error(error);
        this.payments = [];
      }
    },

    async fetchUrl(url) {
      if (!url) return;
      try {
        const res = await this.$apiGet(url);
        this.payments = Array.isArray(res.data) ? res.data : [];
        this.currentPage = res.current_page || 1;
        this.totalPages = res.total_pages || 1;
        this.next = res.next || null;
        this.previous = res.previous || null;
      } catch (error) {
        console.error(error);
      }
    },

    async approve(payment) {
      const payload = { id: payment.id, status: "paid" };
      const res = await this.$apiPatch(`/update_payment`, payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast(
          "Payment Approved Successfully",
          "success"
        );
        this.fetchPayments(this.currentPage);
      }
    },

    async reject(payment) {
      const payload = { id: payment.id, status: "pending" };
      const res = await this.$apiPatch(`/update_payment`, payment.id, payload);
      if (res) {
        this.$root.$refs.toast.showToast(
          "Payment Disapproved Successfully",
          "success"
        );
        this.fetchPayments(this.currentPage);
      }
    },

    formatDate(dateString) {
      if (!dateString) return "-";
      return new Date(dateString).toLocaleDateString();
    },
  },
};
</script>
