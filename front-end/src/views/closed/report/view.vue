<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <h1 class="text-xl font-bold mb-6">Property Manager Dashboard</h1>

    <!-- Users Tabs + Chart -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row md:space-x-6">

      <div class="flex-1">
        <div class="flex space-x-2 mb-4">
          <button v-for="tab in userTabs" :key="tab.key" @click="activeUserTab = tab.key; fetchUsers()"
            :class="[activeUserTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300', 'px-3 py-1 rounded-full text-sm font-semibold transition']">
            {{ tab.label }}
          </button>
        </div>

        <!-- Date Filters for Users -->
        <div class="flex space-x-4 mb-4">
          <div class="flex flex-col">
            <label class="text-sm font-medium">From</label>
            <input type="date" v-model="userFilter.from" class="border rounded p-1 text-sm" />
          </div>
          <div class="flex flex-col">
            <label class="text-sm font-medium">To</label>
            <input type="date" v-model="userFilter.to" class="border rounded p-1 text-sm" />
          </div>
          <button @click="applyUserFilter"
            class="self-end px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">Apply</button>
        </div>

        <div>
          <h3 class="text-gray-600 font-semibold mb-2 capitalize">Total {{ activeUserTab }}</h3>
          <p class="text-xl font-bold">{{ filteredUsers.length }}</p>
          <button @click="downloadUsers"
            class="mt-2 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">⬇ Export</button>
        </div>
      </div>

      <!-- Users Sample Chart -->
      <div class="flex-1 mt-6 md:mt-0">
        <apexchart type="donut" height="300" :options="userChartOptions" :series="userSeries" />
      </div>
    </div>

    <!-- Payments Tabs + Chart -->
    <div class="bg-white rounded-lg shadow-md p-4 flex flex-col md:flex-row md:space-x-6">
      <div class="flex-1">
        <div class="flex space-x-2 mb-4">
          <button v-for="tab in paymentTabs" :key="tab.key" @click="activePaymentTab = tab.key"
            :class="[activePaymentTab === tab.key ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300', 'px-3 py-1 rounded-full text-sm font-semibold transition']">
            {{ tab.label }}
          </button>
        </div>

        <!-- Payment Content -->
        <div>
          <!-- Subscription Payments -->
          <div v-if="activePaymentTab === 'subscription'" class="mb-4">
            <h3 class="text-gray-600 font-semibold mb-2">Subscription Payments</h3>
            <div class="flex space-x-4 mb-2">
              <div class="flex flex-col">
                <label class="text-sm font-medium">From</label>
                <input type="date" v-model="subscriptionPaymentFilter.from" class="border rounded p-1 text-sm" />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-medium">To</label>
                <input type="date" v-model="subscriptionPaymentFilter.to" class="border rounded p-1 text-sm" />
              </div>
              <button @click="applySubscriptionFilter"
                class="self-end px-3 py-1 bg-teal-600 text-white rounded hover:bg-teal-700 text-sm">Apply</button>
            </div>
            <p class="text-xl font-bold mb-2">{{ filteredSubscriptionPayments.length }}</p>
            <button @click="downloadSubscriptionPayments"
              class="px-3 py-1 text-sm bg-teal-600 text-white rounded hover:bg-teal-700">⬇ Export</button>
          </div>

          <!-- Repeat same pattern for Sales, Rent, Rental -->
          <div v-if="activePaymentTab === 'sales'">
            <h3 class="text-gray-600 font-semibold mb-2">Sales Payments</h3>
            <div class="flex space-x-4 mb-2">
              <div class="flex flex-col">
                <label class="text-sm font-medium">From</label>
                <input type="date" v-model="salesPaymentFilter.from" class="border rounded p-1 text-sm" />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-medium">To</label>
                <input type="date" v-model="salesPaymentFilter.to" class="border rounded p-1 text-sm" />
              </div>
              <button @click="applySalesFilter"
                class="self-end px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 text-sm">Apply</button>
            </div>
            <p class="text-xl font-bold mb-2">{{ filteredSalesPayments.length }}</p>
            <button @click="downloadSalesPayments"
              class="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700">⬇ Export</button>
          </div>

          <div v-if="activePaymentTab === 'rent'">
            <h3 class="text-gray-600 font-semibold mb-2">Rent Payments</h3>
            <div class="flex space-x-4 mb-2">
              <div class="flex flex-col">
                <label class="text-sm font-medium">From</label>
                <input type="date" v-model="rentPaymentFilter.from" class="border rounded p-1 text-sm" />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-medium">To</label>
                <input type="date" v-model="rentPaymentFilter.to" class="border rounded p-1 text-sm" />
              </div>
              <button @click="applyRentFilter"
                class="self-end px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm">Apply</button>
            </div>
            <p class="text-xl font-bold mb-2">{{ filteredRentPayments.length }}</p>
            <button @click="downloadRentPayments"
              class="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-indigo-700">⬇ Export</button>
          </div>

          <div v-if="activePaymentTab === 'rental'">
            <h3 class="text-gray-600 font-semibold mb-2">Cowrk space Payments</h3>
            <div class="flex space-x-4 mb-2">


              <div class="flex flex-col">
                <label class="text-sm font-medium">From</label>
                <input type="date" v-model="rentalPaymentFilter.from" class="border rounded p-1 text-sm" />
              </div>
              <div class="flex flex-col">
                <label class="text-sm font-medium">To</label>
                <input type="date" v-model="rentalPaymentFilter.to" class="border rounded p-1 text-sm" />
              </div>
              <select v-model="cowrk_type" class="border rounded-lg p-2">
                <option value="rental__start_date">Agreement Start</option>
                <option value="paid_at">Paid at</option>
                <option value="cycle_start">Cycle Start</option>
                <option value="cycle_end">Cycle End</option>
                <option value="rental__next_due_date">Next Due Date</option>
              </select>
              <button @click="applyRentalFilter"
                class="self-end px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm">Apply</button>
            </div>
            <p class="text-xl font-bold mb-2">{{ filteredRentalPayments.length }}</p>
            <button @click="downloadRentalPayments"
              class="px-3 py-1 text-sm bg-primary text-white rounded hover:bg-purple-700">⬇ Export</button>
          </div>
        </div>
      </div>

      <!-- Payments Sample Chart -->
      <div class="flex-1 mt-6 md:mt-0">
        <apexchart type="donut" height="300" :options="paymentChartOptions" :series="paymentSeries" />
      </div>
    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import VueApexCharts from "vue3-apexcharts";

export default {
  components: { apexchart: VueApexCharts },
  data() {
    return {
      cowrk_type: "rental__start_date",
      activeUserTab: "owners",
      activePaymentTab: "subscription",
      userTabs: [
        { key: "owners", label: "Owners" },
        { key: "tenants", label: "Tenants" },
        { key: "staffs", label: "Staffs" },
        { key: "managers", label: "Managers" },
      ],
      paymentTabs: [
        { key: "subscription", label: "Subscription" },
        { key: "sales", label: "Sales" },
        { key: "rent", label: "Rent" },
        { key: "rental", label: "Co-work-space" },
      ],

      users: [],
      subscriptionPayments: [],
      salesPayments: [],
      rentPayments: [],
      rentalPayments: [],

      filteredUsers: [],
      filteredSubscriptionPayments: [],
      filteredSalesPayments: [],
      filteredRentPayments: [],
      filteredRentalPayments: [],

      userFilter: { from: "", to: "" },
      subscriptionPaymentFilter: { from: "", to: "" },
      salesPaymentFilter: { from: "", to: "" },
      rentPaymentFilter: { from: "", to: "" },
      rentalPaymentFilter: { from: "", to: "" },

      // Sample chart data
      userSeries: [1, 1, 1, 1], // Owners, Tenants, Staffs, Managers
      userChartOptions: { labels: ["Owners", "Tenants", "Staffs", "Managers"], legend: { position: "bottom" } },
      paymentSeries: [10, 20, 15, 5], // Subscription, Sales, Rent, Rental
      paymentChartOptions: { labels: ["Subscription", "Sales", "Rent", "Workspace"], legend: { position: "bottom" } },
    };
  },
  mounted() {
    this.fetchUsers();
    this.fetchAllPayments();
  },
  methods: {
    /** USERS */
    async fetchUsers() {
      try {
        const res = await this.$apiGet(`/get_${this.activeUserTab}`);
        this.users = res?.data || [];
        this.filteredUsers = [...this.users];
      } catch (err) {
        console.error(err);
      }
    },

    async applySalesFilter() {
      //alert("hi")
      try {
        // alert("hii")
        // If no dates are selected, fetch all sales payments
        if (!this.salesPaymentFilter.from || !this.salesPaymentFilter.to) {
          const res = await this.$apiGet("/get_sales_payments");
          console.log("res filter for sales payment", res);
          this.salesPayments = res?.data || [];
          this.filteredSalesPayments = [...this.salesPayments];
          return;
        }

        const params = {
          due_date__gte: this.salesPaymentFilter.from,
          due_date__lte: this.salesPaymentFilter.to,
        };
        // Use backend filters for due_date
        const res = await this.$apiGet("/get_sales_payments", params);

        console.log("sales filter by date", res);

        this.salesPayments = res?.data || [];
        this.filteredSalesPayments = [...this.salesPayments];
      } catch (error) {
        console.error("Error fetching filtered sales payments:", error);
      }
    },


    async applyRentFilter() {
      //alert("hu")
      try {
        // If no dates are selected, fetch all rental payments
        if (!this.rentPaymentFilter.from || !this.rentPaymentFilter.to) {
          const res = await this.$apiGet("/get_payments");
          this.rentPayments = res?.data || [];
          this.filteredRentPayments = [...this.rentPayments];
          return;
        }

        const params = {
          due_date__gte: this.rentPaymentFilter.from,
          due_date__lte: this.rentPaymentFilter.to,
        };
        // Use backend filters for rental__start_date
        const res = await this.$apiGet("/get_payments", params);

        console.log("res for rental apply filter", res)
        this.rentPayments = res?.data || [];
        this.filteredRentPayments = [...this.rentPayments];
      } catch (error) {
        console.error("Error fetching filtered rent payments:", error);
      }
    },

    async applyRentalFilter() {
      try {
        // If no dates are selected, fetch all rental payments
        if (!this.rentalPaymentFilter.from || !this.rentalPaymentFilter.to) {
          const res = await this.$apiGet("/get_rental_payments");
          this.rentalPayments = res?.data || [];
          this.filteredRentalPayments = [...this.rentalPayments];
          return;
        }

        // Build dynamic params based on cowrk_type
        const params = {
          [`${this.cowrk_type}__gte`]: this.rentalPaymentFilter.from,
          [`${this.cowrk_type}__lte`]: this.rentalPaymentFilter.to,
        };

        const res = await this.$apiGet("/get_rental_payments", params);

        console.log("Filter applied for:", this.cowrk_type, res);

        this.rentalPayments = res?.data || [];
        this.filteredRentalPayments = [...this.rentalPayments];
      } catch (error) {
        console.error("Error fetching filtered rental payments:", error);
      }
    },




    /** PAYMENTS */
    async fetchAllPayments() {
      await this.fetchSubscriptionPayments();
      await this.fetchSalesPayments();
      await this.fetchRentPayments();
      await this.fetchRentalPayments();
    },
    async fetchSubscriptionPayments() { 
      const res = await this.$apiGet("/get_subscription_payment"); 
      this.subscriptionPayments = res?.data || []; 
      console.log("subscriptions are",this.subscriptionPayments);
      this.filteredSubscriptionPayments = [...this.subscriptionPayments]; 

    },
    async fetchSalesPayments() {
      const res = await this.$apiGet("/get_sales_payments"); this.salesPayments = res?.data || []; this.filteredSalesPayments = [...this.salesPayments];
    },
    async fetchRentPayments() { const res = await this.$apiGet("/get_payments"); this.rentPayments = res?.data || []; this.filteredRentPayments = [...this.rentPayments]; },
    async fetchRentalPayments() { const res = await this.$apiGet("/get_rental_payments"); this.rentalPayments = res?.data || []; this.filteredRentalPayments = [...this.rentalPayments]; },

    async applySubscriptionFilter() {
      try {
        // If no dates are selected, fetch all subscription payments
        if (!this.subscriptionPaymentFilter.from || !this.subscriptionPaymentFilter.to) {
          const res = await this.$apiGet("/get_subscription_payment");
          this.subscriptionPayments = res?.data || [];
          this.filteredSubscriptionPayments = [...this.subscriptionPayments];
          return;
        }

        // Build filter params for created_at
        const params = {
          paid_at__gte: this.subscriptionPaymentFilter.from,
          paid_at__lte: this.subscriptionPaymentFilter.to,
        };
        console.log("params",params)

        const res = await this.$apiGet("/get_subscription_payment", params);

        console.log("Subscription filter applied:", res);

        this.subscriptionPayments = res?.data || [];
        this.filteredSubscriptionPayments = [...this.subscriptionPayments];
      } catch (error) {
        console.error("Error fetching filtered subscription payments:", error);
      }
    },


    applyDateFilter(data, filter, field) {
      if (!filter.from || !filter.to) return [...data];
      const from = new Date(filter.from), to = new Date(filter.to);
      return data.filter(item => new Date(item[field]) >= from && new Date(item[field]) <= to);
    },

    /** EXPORT */
    exportExcel(data, fileName, sheetName) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);
    },
    downloadUsers() { this.exportExcel(this.filteredUsers, `${this.activeUserTab}.xlsx`, "Users"); },
    downloadSubscriptionPayments() { this.exportExcel(this.filteredSubscriptionPayments, "SubscriptionPayments.xlsx", "Subscription"); },
    downloadSalesPayments() { this.exportExcel(this.filteredSalesPayments, "SalesPayments.xlsx", "Sales"); },
    downloadRentPayments() { this.exportExcel(this.filteredRentPayments, "RentPayments.xlsx", "Rent"); },
    downloadRentalPayments() { this.exportExcel(this.filteredRentalPayments, "RentalPayments.xlsx", "Rental"); },
  },
};
</script>
