<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <h1 class="text-3xl font-bold mb-6">🏠 Property Manager Dashboard</h1>

    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Properties</h2>
        <p class="text-2xl font-semibold">{{ stats.totalProperties }}</p>
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Property Zones</h2>
        <p class="text-2xl font-semibold ">
          {{ stats.totalZones }}
        </p>
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
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-lg font-semibold mb-4">Pricing Plan Analytics</h2>
      <apexchart
        type="bar"
        height="350"
        :options="pricingChartOptions"
        :series="pricingSeries"
      />
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">Sales vs Rent Income</h2>
        <apexchart
          type="bar"
          height="300"
          :options="incomeChartOptions"
          :series="incomeSeries"
        />
      </div>
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-lg font-semibold mb-4">User Types</h2>
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
      stats: {
        totalProperties: 0,
        totalZones:0,
        totalSubscriptions:0,
        totalTenants:0,
        monthlyRevenue: 45200,
        occupancyRate: 89,
        newTenants: 6,
      },
      incomeSeries: [
        {
          name: "Rent",
          data: [11000, 15000, 12500, 14000, 16000],
        },
        {
          name: "Sale",
          data: [8000, 9000, 7000, 8500, 9500],
        },
      ],
      incomeChartOptions: {
        chart: {
          id: "income-chart",
          toolbar: { show: false },
        },
        xaxis: {
          categories: ["Apr", "May", "Jun", "Jul", "Aug"],
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: "55%",
          },
        },
        dataLabels: { enabled: false },
        legend: { position: "top" },
      },
      userSeries: [60, 30, 10],
      userChartOptions: {
        labels: ["Tenants", "Owners", "Agents"],
        legend: {
          position: "bottom",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: { width: 200 },
              legend: { position: "bottom" },
            },
          },
        ],
      },
      pricingSeries: [
        {
          name: "Users",
          type: "column",
          data: [250, 120, 80, 15], // Number of users per plan
        },
        {
          name: "Revenue ($)",
          type: "line",
          data: [0, 100000, 4560000, 4568000], // Accumulated revenue per plan
        },
      ],
      pricingChartOptions: {
        chart: {
          height: 350,
          type: "line",
          toolbar: { show: false },
        },
        stroke: {
          width: [0, 4],
        },
        title: {
          text: "Plan Adoption and Revenue",
          align: "left",
        },
        xaxis: {
          categories: ["Free", "Basic", "Pro", "Enterprise"],
        },
        yaxis: [
          {
            title: {
              text: "Users",
            },
          },
          {
            opposite: true,
            title: {
              text: "Revenue ($)",
            },
          },
        ],
        dataLabels: {
          enabled: true,
          enabledOnSeries: [1],
        },
        colors: ["#60a5fa", "#34d399"], // blue for users, green for revenue
        legend: {
          position: "top",
        },
      },
    };
  },
  mounted() {
    this.fetchTotalProperties();
    this.fetchTotalZones();
     this.fetchTotalSubscriptions();
     this.fetchTotalTenants();
    // console.log("add_user", this.$hasPermission("pms.add_user"));
  },
  methods: {
   async fetchTotalProperties() {
  try {
    const response = await this.$apiGet("/get_properties");
    console.log("API response:", response);
    if (response && response.count !== undefined) {
      this.stats.totalProperties = response.count;
    } else {
      console.warn("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Failed to fetch total properties:", error);
  }
},
 async fetchTotalZones() {
  try {
    const response = await this.$apiGet("/get_property_zones");
    console.log("API response:", response);
    if (response && response.count !== undefined) {
      this.stats.totalZones = response.count;
    } else {
      console.warn("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Failed to fetch total properties:", error);
  }
},
 async fetchTotalSubscriptions() {
  try {
    const response = await this.$apiGet("/get_subscription");
    console.log("API response:", response);
    if (response && response.count !== undefined) {
      this.stats.totalSubscriptions = response.count;
    } else {
      console.warn("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Failed to fetch total properties:", error);
  }
},
 async fetchTotalTenants() {
  try {
    const response = await this.$apiGet("/get_tenants");
    console.log("API response:", response);
    if (response && response.count !== undefined) {
      this.stats.totalTenants = response.count;
    } else {
      console.warn("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Failed to fetch total properties:", error);
  }
}

  },
};
</script>
