<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-lg font-bold text-gray-800">Dashboard Overview and analytics</h1>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(value, key) in stats"
        :key="key"
        class="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-all"
      >
        <div>
          <h2 class="text-gray-500 text-sm capitalize">
            {{ key.replace("total", "").trim() }}
          </h2>
          <p class="text-3xl font-bold text-gray-800 mt-2">{{ value }}</p>
        </div>
        <div class="mt-2 border-t pt-2">
          <span class="text-xs text-gray-400">Updated just now</span>
        </div>
      </div>
    </div>

    <!-- Pricing Analytics (only for superuser) -->
<div v-if="is_superuser=='true'"
  class="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg border border-gray-200 mb-10 p-5"
>
  <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
    <h2 class="text-lg font-bold text-purple-700 tracking-wide mb-4 md:mb-0">
      PRICING PLAN ANALYTICS
    </h2>

    <div class="flex flex-wrap gap-3">
      <div class="flex flex-row space-x-2">
         <input
        type="date"
        v-model="start_date"
        class="border-2 border-blue-300 rounded-lg px-1 py-1 text-gray-800 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
      />
      <input
        type="date"
        v-model="end_date"
        class="border-2 border-purple-300 rounded-lg px-1 py-1 text-gray-800 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition"
      />
      </div>
     
      <button
        @click="refreshAllReports"
        class="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
      >
        FETCH REPORT
      </button>
    </div>
  </div>

  <!-- Pricing Line Chart -->
  <apexchart
    type="line"
    height="350"
    :options="pricingChartOptions"
    :series="pricingSeries"
  />
  </div>


   <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6 space-y-6">
    <!-- ======================= HEADER WITH DATE FILTERS ======================= -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <h2 class="text-xl font-semibold text-gray-800">Income / Expense Overview</h2>

      <div class="flex flex-row items-center gap-3">
        <!-- Start Date -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-600">Start Date</label>
          <input
            type="date"
            v-model="revenue_start_date"
            @change="fetchIncomeData"
            class="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 text-sm"
          />
        </div>

        <!-- End Date -->
        <div class="flex flex-col">
          <label class="text-sm text-gray-600">End Date</label>
          <input
            type="date"
            v-model="revenue_end_date"
            @change="fetchIncomeData"
            class="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 text-sm"
          />
        </div>
      </div>
    </div>

    <!-- Divider -->
    <div class="border-t border-gray-200"></div>

    <!-- ======================= ALL INCOME GRAPHS ======================= -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <!-- Subscription -->
      <div class="p-4 rounded-xl border border-gray-100 bg-gray-50" >
        <h3 class="text-md font-semibold text-gray-700 mb-3"> Subscription Overview(Expense)</h3>
        <apexchart
          type="bar"
          height="280"
          :options="chartOptions('Subscription', incomeData.months)"
          :series="[{ name: 'Subscription', data: incomeData.subscription }]"
        />
      </div>
      <!-- Rent -->
      <div class="p-4 rounded-xl border border-gray-100 bg-gray-50">
        <h3 class="text-md font-semibold text-gray-700 mb-3">Rent Overview(Income)</h3>
        <apexchart
          type="bar"
          height="280"
          :options="chartOptions('Rent', incomeData.months)"
          :series="[{ name: 'Rent', data: incomeData.rent }]"
        />
      </div>

      <!-- Sale -->
      <div class="p-4 rounded-xl border border-gray-100 bg-gray-50">
        <h3 class="text-md font-semibold text-gray-700 mb-3">Sales Overview(Income)</h3>
        <apexchart
          type="bar"
          height="280"
          :options="chartOptions('Sale', incomeData.months)"
          :series="[{ name: 'Sale', data: incomeData.sale }]"
        />
      </div>

   

      <!-- Workspace -->
      <div class="p-4 rounded-xl border border-gray-100 bg-gray-50">
        <h3 class="text-md font-semibold text-gray-700 mb-3">Workspace Overview(Income)</h3>
        <apexchart
          type="bar"
          height="280"
          :options="chartOptions('Workspace', incomeData.months)"
          :series="[{ name: 'Workspace', data: incomeData.workspace }]"
        />
      </div>
    </div>
    <!-- User Distribution -->
      <div v-if="is_superuser=='true'" class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          User Distribution by Group
        </h2>
        <apexchart
          type="donut"
          height="300"
          :options="userChartOptions"
          :series="userSeries"
        />
      </div>
  </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      is_superuser: false,
      stats: {
        totalProperties: 0,
        totalZones: 0,
        totalSubscriptions: 0,
        totalTenants: 0,
      },
      hugePageSize: 10000000000,
      start_date: "",
      end_date: "",

      revenue_start_date: new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0],
      revenue_end_date: new Date().toISOString().split("T")[0],


      // Pricing report
      pricingSeries: [
        { name: "Users", type: "column", data: [] },
        { name: "Revenue ($)", type: "line", data: [] },
      ],
      pricingChartOptions: {
        chart: { height: 350, type: "line", toolbar: { show: false } },
        stroke: { width: [0, 4] },
        title: { text: "Plan Adoption and Revenue", align: "left" },
        xaxis: { categories: [] },
        yaxis: [
          { title: { text: "Users" } },
          { opposite: true, title: { text: "Revenue ($)" } },
        ],
        dataLabels: { enabled: true, enabledOnSeries: [1] },
        colors: ["#3b82f6", "#10b981"],
        legend: { position: "top" },
      },

      // Income report
      incomeData: {
        months: [],
        rent: [],
        sale: [],
        subscription: [],
        workspace: [],
      },


      incomeChartOptions: {
        chart: { id: "income-chart", stacked: false, toolbar: { show: false } },
        xaxis: { categories: [] },
        plotOptions: { bar: { horizontal: false, columnWidth: "55%" } },
        dataLabels: { enabled: false },
        legend: { position: "top" },
      },

      // User report
      userSeries: [],
      userChartOptions: {
        labels: [],
        legend: { position: "bottom" },
      },
    };
  },

  mounted() {
    this.is_superuser = localStorage.getItem("is_superuser");
    this.fetchAllData();
    if (this.is_superuser === "true") {
      this.refreshAllReports();
    }
  },

  methods: {
    async fetchAllData() {
      await Promise.all([
        this.fetchTotalProperties(),
        this.fetchTotalZones(),
        this.fetchTotalSubscriptions(),
        this.fetchTotalTenants(),
        this.fetchIncomeData(),
        this.fetchUserTypeReport(),
      ]);
    },

    async refreshAllReports() {
      await Promise.all([
        this.fetchSubscriptionReport(),
        this.fetchUserTypeReport(),
      ]);
    },
    chartOptions(title, months) {
      return {
        chart: { id: `${title}-chart` },
        xaxis: { categories: months },
        dataLabels: { enabled: false },
        grid: { strokeDashArray: 4 },
        title: {
          text: title,
          align: "center",
          style: { fontSize: "14px", color: "#374151" },
        },
        tooltip: { y: { formatter: (val) => val.toLocaleString() } },
        colors: ["#2563eb"],
      };
    },

    async fetchIncomeData() {
     // alert("hii")
     // if (!this.revenue_start_date || !this.revenue_end_date) return;


      const isSuperUser =
      localStorage.getItem("is_superuser") === "1" ||
      localStorage.getItem("is_superuser") === "true";

  const groups = JSON.parse(localStorage.getItem("groups") || "[]");
   const userId=localStorage.getItem('userId');
    let params = {};

    if (!isSuperUser) {
      if (groups.includes("manager")) {
        params = { 
        rent_id__property_id__property_zone_id__manager_id__id: userId,
        subscription_id__user_id__id:userId,
        space__zone__manager_id__id:userId,
        start_date: this.revenue_start_date,
        end_date: this.revenue_end_date,
        };
      } else if (groups.includes("owner")) {
        params = {
             rent_id__property_id__property_zone_id__owner_id__id: userId,
             property_zone_sale_id__property_zone_id__owner_id__id:userId,
             subscription_id__user_id__id:userId,
             space__zone__owner_id__id:userId,
             start_date: this.revenue_start_date,
             end_date: this.revenue_end_date,
         };
      } else if (groups.includes("staff")) {
        params={rent_id__property_id__property_zone_id__staff_id__id: userId,
        subscription_id__user_id__id:userId,
        space__zone__staff_id__id:userId,
        start_date: this.revenue_start_date,
        end_date: this.revenue_end_date,
        };
      } else if (groups.includes("super_staff")) {
        params = {
            start_date: this.revenue_start_date,
            end_date: this.revenue_end_date,
        };
      }
    }else{
        params = {
            start_date: this.revenue_start_date,
            end_date: this.revenue_end_date,
        };
      }
      console.log("Fetching with params for income:", params);

      try {
        const res = await this.$apiGet("/get_revenue_report", params);
        console.log("resin", res);
        this.incomeData = res;
      } catch (error) {
        console.error("Failed to load income data:", error);
        this.$root.$refs.toast?.showToast("Failed to load income data", "error");
      }
    },

    // 🟢 Fetch subscription report
async fetchSubscriptionReport() {
  try {
    let url = "/get_subscription_report";

    // Add date filters if selected
    if (this.start_date && this.end_date) {
      url += `?start_date=${this.start_date}&end_date=${this.end_date}`;
    }

    const res = await this.$apiGet(url);
    const data = res.data || res;

    // Extract only plans and revenue
    const { plans = [], revenue = [] } = data;

    // Update chart options
    this.pricingChartOptions = {
      chart: {
        type: "bar",
        toolbar: { show: false },
      },
      title: {
        text: "PLANS AND THEIR REVENUE",
        align: "center",
        style: {
          fontSize: "18px",
          fontWeight: "bold",
          color: "#4B0082", // deep purple
        },
      },
      xaxis: {
        categories: plans,
        title: {
          text: "PLAN TYPE",
          style: { color: "#333", fontWeight: "600" },
        },
      },
      yaxis: {
        title: {
          text: "REVENUE ($)",
          style: { color: "#333", fontWeight: "600" },
        },
      },
      colors: ["#7C3AED"], // violet accent
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#fff"],
          fontWeight: "bold",
        },
        background: {
          enabled: true,
          foreColor: "#000",
          borderRadius: 6,
          opacity: 0.9,
        },
      },
      plotOptions: {
        bar: {
          borderRadius: 8,
          distributed: true,
          columnWidth: "45%",
        },
      },
      tooltip: {
        theme: "light",
        y: {
          formatter: (val) => `$${val.toLocaleString()}`,
        },
      },
    };

    // Update data series
    this.pricingSeries = [
      {
        name: "Revenue ($)",
        data: revenue,
      },
    ];

    // Success message
    this.$root.$refs.toast?.showToast(
      "Revenue report loaded successfully",
      "success"
    );
  } catch (err) {
    console.error(err);
    this.$root.$refs.toast?.showToast(
      "Failed to load revenue report",
      "error"
    );
  }
},


    // 🟢 Fetch user type report (replaces fetchAndGroupUsers)
    async fetchUserTypeReport() {
      try {
        const params = {
          user_id: localStorage.getItem("userId"),
        };
        let url = "/get_user_type_report";
        if (this.start_date && this.end_date) {
          url += `?start_date=${this.start_date}&end_date=${this.end_date}`;
        }

        const res = await this.$apiGet(url, params);
        const data = res.data || res;
        const { groups = [], counts = [] } = data;

        this.userChartOptions = {
          ...this.userChartOptions,
          labels: groups,
        };
        this.userSeries = counts;

        if (this.start_date && this.end_date)
          this.$root.$refs.toast?.showToast(
            "User type report loaded",
            "success"
          );
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast?.showToast(
          "Failed to load user type report",
          "error"
        );
      }
    },

    // ---- Stats fetchers ----
    async fetchTotalProperties() {
      try {
        //  const res = await this.$apiGet("/get_properties", { page_size: this.hugePageSize });
        const pageSize = this.hugePageSize;
        const params = {};
        const pageUrl = "/get_properties?page=1&page_size=1000000000";
        const res = await this.$getProperties(pageUrl, params);
        console.log("res properties", res);
        //alert("hi");
        this.stats.totalProperties = res.properties?.length ?? 0;
      } catch {}
    },

    async fetchTotalZones() {
      try {
        const pageUrl = "/get_property_zones?page=1&page_size=10000000000";
        const params = {};
        const res = await this.$getZones(pageUrl, params);
        console.log("res zones", res);
        this.stats.totalZones = res.zones?.length ?? 0;
      } catch {}
    },

    async fetchTotalSubscriptions() {
      try {
        let params = {
          user_id__id: localStorage.getItem("userId"),
          page: 1,
          page_size: 10000000000,
        };

        if (localStorage.getItem("is_superuser") == "true") {
          params = {
            page: 1,
            page_size: 10000000000,
          };
        }
        const pageUrl = `/get_subscription`;
        const res = await this.$apiGet(pageUrl, params);
        console.log("res", res);
        console.log("res for subscriptions", res);
        this.stats.totalSubscriptions = res.count;
      } catch {}
    },

    async fetchTotalTenants() {
      try {
        const pageUrl = `/get_rents`;
        const params = {
          page_size: 10000000000,
        };
        const res = await this.$getTenants(pageUrl, params);
        console.log("res for tenants", res);

        this.stats.totalTenants = res.tenants.length ?? 0;
      } catch {}
    },

  },
};
</script>

<style scoped>
.bg-white:hover {
  transform: translateY(-2px);
  transition: all 0.2s ease;
}
</style>
