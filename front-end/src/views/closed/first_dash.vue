<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <h1 class="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
      <p class="text-gray-500 text-sm">Performance summary and analytics</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
      <div
        v-for="(value, key) in stats"
        :key="key"
        class="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between border border-gray-100 hover:shadow-lg transition-all"
      >
        <div>
          <h2 class="text-gray-500 text-sm capitalize">{{ key.replace('total', '').trim() }}</h2>
          <p class="text-3xl font-bold text-gray-800 mt-2">{{ value }}</p>
        </div>
        <div class="mt-2 border-t pt-2">
          <span class="text-xs text-gray-400">Updated just now</span>
        </div>
      </div>
    </div>

    <!-- Pricing Analytics (only for superuser) -->
    <div
      v-if="is_superuser === 'true'"
      class="bg-white rounded-2xl shadow-md border border-gray-100 mb-10 p-6"
    >
      <div class="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4 md:mb-0">
          Pricing Plan Analytics
        </h2>

        <div class="flex flex-wrap gap-3">
          <input
            type="date"
            v-model="start_date"
            class="border rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200"
          />
          <input
            type="date"
            v-model="end_date"
            class="border rounded-lg px-3 py-2 text-gray-700 focus:ring focus:ring-blue-200"
          />
          <button
            @click="refreshAllReports"
            class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg shadow"
          >
            Fetch Report
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

    <!-- Income & Users Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Income Chart -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">
          Income Overview
        </h2>
        <apexchart
          type="bar"
          height="320"
          :options="incomeChartOptions"
          :series="incomeSeries"
        />
      </div>

      <!-- User Distribution -->
      <div class="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
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
      incomeSeries: [
        { name: "Rent", data: [] },
        { name: "Sale", data: [] },
        { name: "Subscription", data: [] },
        { name: "Workspace", data: [] },
      ],
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
      await Promise.all([this.fetchSubscriptionReport(), this.fetchUserTypeReport()]);
    },

    // 🟢 Fetch subscription report
    async fetchSubscriptionReport() {
      try {
        let url = "/get_subscription_report";
        if (this.start_date && this.end_date) {
          url += `?start_date=${this.start_date}&end_date=${this.end_date}`;
        }

        const res = await this.$apiGet(url);
        const data = res.data || res;
        const { plans = [], users = [], revenue = [] } = data;

        this.pricingChartOptions = {
          ...this.pricingChartOptions,
          xaxis: { categories: plans },
        };

        this.pricingSeries = [
          { name: "Users", type: "column", data: users },
          { name: "Revenue ($)", type: "line", data: revenue },
        ];

        if (this.start_date && this.end_date)
          this.$root.$refs.toast?.showToast("Report loaded successfully", "success");
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast?.showToast("Failed to load subscription report", "error");
      }
    },

    // 🟢 Fetch user type report (replaces fetchAndGroupUsers)
    async fetchUserTypeReport() {
      try {
        let url = "/get_user_type_report";
        if (this.start_date && this.end_date) {
          url += `?start_date=${this.start_date}&end_date=${this.end_date}`;
        }

        const res = await this.$apiGet(url);
        const data = res.data || res;

        const { groups = [], counts = [] } = data;

        this.userChartOptions = {
          ...this.userChartOptions,
          labels: groups,
        };
        this.userSeries = counts;

        if (this.start_date && this.end_date)
          this.$root.$refs.toast?.showToast("User type report loaded", "success");
      } catch (err) {
        console.error(err);
        this.$root.$refs.toast?.showToast("Failed to load user type report", "error");
      }
    },

    // ---- Stats fetchers ----
    async fetchTotalProperties() {
      try {
        const res = await this.$apiGet("/get_properties", { page_size: this.hugePageSize });
        this.stats.totalProperties = res.count ?? res.data?.results?.length ?? 0;
      } catch {}
    },
    async fetchTotalZones() {
      try {
        const res = await this.$apiGet("/get_property_zones", { page_size: this.hugePageSize });
        this.stats.totalZones = res.count ?? res.data?.results?.length ?? 0;
      } catch {}
    },
    async fetchTotalSubscriptions() {
      try {
        const res = await this.$apiGet("/get_subscription", { page_size: this.hugePageSize });
        this.stats.totalSubscriptions = res.count ?? res.data?.results?.length ?? 0;
      } catch {}
    },
    async fetchTotalTenants() {
      try {
        const res = await this.$apiGet("/get_tenants", { page_size: this.hugePageSize });
        this.stats.totalTenants = res.count ?? res.data?.results?.length ?? 0;
      } catch {}
    },

    // 🟢 Income data aggregation
    async fetchIncomeData() {
      const params = { page_size: this.hugePageSize };
      try {
        const [rentRes, salesRes, subsRes] = await Promise.all([
          this.$apiGet("/get_payments", params),
          this.$apiGet("/get_sales_payments", params),
          this.$apiGet("/get_subscription_payment", params),
        ]);

        const rents = rentRes.data?.results ?? rentRes.data ?? [];
        const sales = salesRes.data?.results ?? salesRes.data ?? [];
        const subs = subsRes.data?.results ?? subsRes.data ?? [];

        const sumByMonth = (arr) => {
          const map = {};
          arr.forEach((item) => {
            const d = new Date(item.payment_date ?? item.date);
            const month = !isNaN(d)
              ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
              : "";
            const amount = parseFloat(item.amount ?? item.price ?? 0) || 0;
            map[month] = (map[month] || 0) + amount;
          });
          return map;
        };

        const rentByMonth = sumByMonth(rents);
        const salesByMonth = sumByMonth(sales);
        const subsByMonth = sumByMonth(subs);
        const workspaceByMonth = sumByMonth(
          subs.filter((s) => (s.plan_name ?? "").toLowerCase().includes("workspace"))
        );

        const months = [
          ...new Set([
            ...Object.keys(rentByMonth),
            ...Object.keys(salesByMonth),
            ...Object.keys(subsByMonth),
            ...Object.keys(workspaceByMonth),
          ]),
        ].sort();

        this.incomeChartOptions = {
          ...this.incomeChartOptions,
          xaxis: { categories: months },
        };
        this.incomeSeries = [
          { name: "Rent", data: months.map((m) => rentByMonth[m] || 0) },
          { name: "Sale", data: months.map((m) => salesByMonth[m] || 0) },
          { name: "Subscription", data: months.map((m) => subsByMonth[m] || 0) },
          { name: "Workspace", data: months.map((m) => workspaceByMonth[m] || 0) },
        ];
      } catch {
        this.$root.$refs.toast?.showToast("Failed to load income data", "error");
      }
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
