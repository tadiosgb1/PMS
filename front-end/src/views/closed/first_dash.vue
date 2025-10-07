<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <h1 class="text-lg font-bold mb-6">Dashboard</h1>

    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Properties</h2>
        <p class="text-2xl font-semibold">{{ stats.totalProperties }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Property Zones</h2>
        <p class="text-2xl font-semibold">{{ stats.totalZones }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Subscriptions</h2>
        <p class="text-2xl font-semibold">{{ stats.totalSubscriptions }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Tenants</h2>
        <p class="text-2xl font-semibold">{{ stats.totalTenants }}</p>
      </div>
    </div>

    <!-- Pricing Plan Stats -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8" v-if="is_superuser==='true'">

      <h2 class="text-lg font-semibold mb-4">Pricing Plan Analytics</h2>
      <apexchart type="line" height="350" :options="pricingChartOptions" :series="pricingSeries" />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Sales / Rent / Subscription / Workspace Income</h2>
        <apexchart type="bar" height="320" :options="incomeChartOptions" :series="incomeSeries" />
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">User Types (by Group)</h2>
        <apexchart type="donut" height="300" :options="userChartOptions" :series="userSeries" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      is_superuser:false,
      stats: { totalProperties: 0, totalZones: 0, totalSubscriptions: 0, totalTenants: 0 },
      hugePageSize: 10000000000,

      // charts
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

      userSeries: [],
      userChartOptions: {
        labels: [],
        legend: { position: "bottom" },
      },

      pricingSeries: [
        { name: "Users", type: "column", data: [] },
        { name: "Revenue ($)", type: "line", data: [] },
      ],
      pricingChartOptions: {
        chart: { height: 350, type: "line", toolbar: { show: false } },
        stroke: { width: [0, 4] },
        title: { text: "Plan Adoption and Revenue", align: "left" },
        xaxis: { categories: [] },
        yaxis: [{ title: { text: "Users" } }, { opposite: true, title: { text: "Revenue ($)" } }],
        dataLabels: { enabled: true, enabledOnSeries: [1] },
        colors: ["#60a5fa", "#34d399"],
        legend: { position: "top" },
      },
    };
  },

  mounted() {
    this.is_superuser=localStorage.getItem("is_superuser");
    this.fetchAllData();
    
  },

  methods: {
    async fetchAllData() {
      await Promise.all([
        this.fetchTotalProperties(),
        this.fetchTotalZones(),
        this.fetchTotalSubscriptions(),
        this.fetchTotalTenants(),
        this.fetchPricingAndSubscriptionData(),
        this.fetchIncomeData(),
        this.fetchAndGroupUsers(),
      ]);
    },

    //--------------------------------
    // 🔹 Pricing Analytics with plan_name
    //--------------------------------
    async fetchPricingAndSubscriptionData() {
      try {
        const params = { page_size: this.hugePageSize };
        const res = await this.$apiGet("/get_subscription_payment", params);
        const payments = res.data?.results ?? res.data ?? [];

        // collect subscription ids
        const subscriptionIds = [...new Set(payments.map(p => p.subscription_id))];

        // fetch subscription details (plan_name) for each
        const subscriptionMap = {};
        for (const id of subscriptionIds) {
          try {
            const subRes = await this.$apiGet(`/get_subscription/${id}`);
            if (subRes && subRes.plan_name) {
              subscriptionMap[id] = subRes.plan_name;
            }
          } catch (e) {
            subscriptionMap[id] = "Unknown Plan";
          }
        }

        // aggregate users & revenue
        const usersPerPlan = {}, revenuePerPlan = {};
        payments.forEach(p => {
          const plan = subscriptionMap[p.subscription_id] ?? "Unknown Plan";
          if (!usersPerPlan[plan]) { usersPerPlan[plan] = 0; revenuePerPlan[plan] = 0; }
          usersPerPlan[plan]++;
          revenuePerPlan[plan] += parseFloat(p.amount ?? p.price ?? 0) || 0;
        });

        const plans = Object.keys(usersPerPlan);
        this.pricingChartOptions = { ...this.pricingChartOptions, xaxis: { categories: plans } };
        this.pricingSeries = [
          { name: "Users", type: "column", data: plans.map(p => usersPerPlan[p]) },
          { name: "Revenue ($)", type: "line", data: plans.map(p => revenuePerPlan[p]) },
        ];

        //this.$root.$refs.toast.showToast("Pricing analytics loaded successfully", "success");
      } catch (err) {
        this.$root.$refs.toast.showToast("Failed to load pricing analytics", "error");
      }
    },

    //--------------------------------
    // 🔹 Group Users (only active)
    //--------------------------------
async fetchAndGroupUsers() {
  try {
    const params = { page_size: this.hugePageSize };
    const res = await this.$apiGet("/get_users", params);

    // Backend returns { data: [...] }
    const users = res.data;

    const groupCounts = {};

    users.forEach(u => {
      if (!u.is_active) return; // ✅ only active users

      if (Array.isArray(u.groups) && u.groups.length > 0) {
        u.groups.forEach(g => {
          const groupName = typeof g === "string" ? g : g?.name || "Unknown";
          if (!groupCounts[groupName]) groupCounts[groupName] = 0;
          groupCounts[groupName]++;
        });
      } else {
        const groupName = "No Group"; // optional bucket
        if (!groupCounts[groupName]) groupCounts[groupName] = 0;
        groupCounts[groupName]++;
      }
    });

    // Update chart
    this.userChartOptions = {
      ...this.userChartOptions,
      labels: Object.keys(groupCounts),
    };
    this.userSeries = Object.values(groupCounts);
console.log("this.userSeries ",this.userSeries )
    //this.$root.$refs.toast.showToast("Users grouped successfully", "success");
  } catch (err) {
    console.error("Error fetching users:", err);
    this.$root.$refs.toast.showToast("Failed to load users", "error");
  }
}

,

    //--------------------------------
    // 🔹 Fetch totals
    //--------------------------------
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

    //--------------------------------
    // 🔹 Income Data
    //--------------------------------
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
          arr.forEach(item => {
            const d = new Date(item.payment_date ?? item.date);
            const month = !isNaN(d) ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}` : "";
            const amount = parseFloat(item.amount ?? item.price ?? 0) || 0;
            map[month] = (map[month] || 0) + amount;
          });
          return map;
        };

        const rentByMonth = sumByMonth(rents);
        const salesByMonth = sumByMonth(sales);
        const subsByMonth = sumByMonth(subs);
        const workspaceByMonth = sumByMonth(subs.filter(s => (s.plan_name ?? "").toLowerCase().includes("workspace")));

        const months = [...new Set([...Object.keys(rentByMonth), ...Object.keys(salesByMonth), ...Object.keys(subsByMonth), ...Object.keys(workspaceByMonth)])].sort();
        this.incomeChartOptions = { ...this.incomeChartOptions, xaxis: { categories: months } };
        this.incomeSeries = [
          { name: "Rent", data: months.map(m => rentByMonth[m] || 0) },
          { name: "Sale", data: months.map(m => salesByMonth[m] || 0) },
          { name: "Subscription", data: months.map(m => subsByMonth[m] || 0) },
          { name: "Workspace", data: months.map(m => workspaceByMonth[m] || 0) },
        ];
      } catch (err) {
        this.$root.$refs.toast.showToast("Failed to load income data", "error");
      }
    },
  },
};
</script>


