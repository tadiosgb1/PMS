<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Header -->
    <h1 class="text-3xl font-bold mb-6">🏠 Property Manager Dashboard</h1>

    <!-- Top Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Properties Card -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Properties</h2>
        <p class="text-2xl font-semibold">{{ stats.totalProperties }}</p>
        <button 
          @click="downloadProperties"
          class="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          ⬇ Download
        </button>
      </div>

      <!-- Total Zones Card -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Property Zones</h2>
        <p class="text-2xl font-semibold">{{ stats.totalZones }}</p>
        <button 
          @click="downloadZones"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          ⬇ Download
        </button>
      </div>

      <!-- Total Subscriptions Card -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Subscriptions</h2>
        <p class="text-2xl font-semibold">{{ stats.totalSubscriptions }}</p>
        <button 
          @click="downloadSubscriptions"
          class="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          ⬇ Download
        </button>
      </div>

      <!-- Total Tenants Card -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h2 class="text-gray-600">Total Tenants</h2>
        <p class="text-2xl font-semibold">{{ stats.totalTenants }}</p>
        <button 
          @click="downloadTenants"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ⬇ Download
        </button>
      </div>

      <TotalProperties
        v-if="totalPropertiesVisible"
        :totalPropertiesVisible="totalPropertiesVisible"
        @close="totalPropertiesVisible = false"
       
      />

    </div>
  </div>
</template>

<script>
import * as XLSX from "xlsx";
import TotalProperties from "@/views/closed/report/totalProperties.vue";

export default {

  components:{
TotalProperties
  },
  data() {
    return {
      stats: {
        totalProperties: 0,
        totalZones: 0,
        totalSubscriptions: 0,
        totalTenants: 0,
      },
      properties: [],
      zones: [],
      subscriptions: [],
      tenants: [],
      totalPropertiesVisible:false
    };
  },
  mounted() {
    this.fetchTotalProperties();
    this.fetchTotalZones();
    this.fetchTotalSubscriptions();
    this.fetchTotalTenants();
  },
  methods: {
    /** ------------------ FETCH DATA WITH PAGINATION ------------------ **/
    async fetchTotalProperties() {
      try {
        const response = await this.$apiGet("/get_properties");
        if (response) {
          this.stats.totalProperties = response.count ?? 0;

          this.properties = [];
          let nextUrl = "/get_properties";
          while (nextUrl) {
            const pageRes = await this.$apiGet(nextUrl);
            if (pageRes && pageRes.data) {
              this.properties.push(...pageRes.data);
              nextUrl = pageRes.next
                ? pageRes.next.replace("https://alphapms.sunriseworld.org/api", "")
                : null;
            } else {
              nextUrl = null;
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch total properties:", error);
      }
    },

    async fetchTotalZones() {
      try {
        const response = await this.$apiGet("/get_property_zones");
        if (response) {
          this.stats.totalZones = response.count ?? 0;

          this.zones = [];
          let nextUrl = "/get_property_zones";
          while (nextUrl) {
            const pageRes = await this.$apiGet(nextUrl);
            if (pageRes && pageRes.data) {
              this.zones.push(...pageRes.data);
              nextUrl = pageRes.next
                ? pageRes.next.replace("https://alphapms.sunriseworld.org/api", "")
                : null;
            } else {
              nextUrl = null;
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch total zones:", error);
      }
    },

    async fetchTotalSubscriptions() {
      try {
        const response = await this.$apiGet("/get_subscription");
        if (response) {
          this.stats.totalSubscriptions = response.count ?? 0;

          this.subscriptions = [];
          let nextUrl = "/get_subscription";
          while (nextUrl) {
            const pageRes = await this.$apiGet(nextUrl);
            if (pageRes && pageRes.data) {
              this.subscriptions.push(...pageRes.data);
              nextUrl = pageRes.next
                ? pageRes.next.replace("https://alphapms.sunriseworld.org/api", "")
                : null;
            } else {
              nextUrl = null;
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch total subscriptions:", error);
      }
    },

    async fetchTotalTenants() {
      try {
        const response = await this.$apiGet("/get_tenants");
        if (response) {
          this.stats.totalTenants = response.count ?? 0;

          this.tenants = [];
          let nextUrl = "/get_tenants";
          while (nextUrl) {
            const pageRes = await this.$apiGet(nextUrl);
            if (pageRes && pageRes.data) {
              this.tenants.push(...pageRes.data);
              nextUrl = pageRes.next
                ? pageRes.next.replace("https://alphapms.sunriseworld.org/api", "")
                : null;
            } else {
              nextUrl = null;
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch total tenants:", error);
      }
    },

    /** ------------------ DOWNLOAD AS EXCEL ------------------ **/
    downloadProperties() {
      if (!this.properties.length) return alert("No property data available.");
      const cleaned = this.properties.map(p => ({
        ID: p.id,
        Name: p.name,
        Type: p.property_type,
        Address: p.address,
        City: p.city,
        State: p.state,
        Zip: p.zip_code,
        Price: p.price,
        Bedrooms: p.bed_rooms,
        Bathrooms: p.bath_rooms,
        Rent: p.rent,
        Status: p.status,
        CreatedAt: p.created_at,
      }));
      this.exportExcel(cleaned, "Properties.xlsx", "Properties");
    },

    downloadZones() {
      if (!this.zones.length) return alert("No property zone data available.");
      const cleaned = this.zones.map(z => ({
        ID: z.id,
        Name: z.name,
        Address: z.address,
        City: z.city,
        State: z.state,
        Owner: z.owner_id,
        Manager: z.manager_id,
      }));
      this.exportExcel(cleaned, "Zones.xlsx", "Zones");
    },

    downloadSubscriptions() {
      if (!this.subscriptions.length) return alert("No subscription data available.");
      const cleaned = this.subscriptions.map(s => ({
        ID: s.id,
        Plan: s.plan_name,
        BillingCycle: s.billing_cycle,
        Price: s.price,
        User: s.user_id,
        StartDate: s.start_date,
        EndDate: s.end_date,
        Status: s.status,
        CreatedAt: s.created_at,
      }));
      this.exportExcel(cleaned, "Subscriptions.xlsx", "Subscriptions");
    },

    downloadTenants() {
      if (!this.tenants.length) return alert("No tenant data available.");
      const cleaned = this.tenants.map(t => ({
        ID: t.id,
        FullName: t.full_name,
        Email: t.email,
        Phone: t.phone,
        PropertyID: t.property_id,
        Status: t.status,
        CreatedAt: t.created_at,
      }));
      this.exportExcel(cleaned, "Tenants.xlsx", "Tenants");
    },

    /** ------------------ HELPER ------------------ **/
    exportExcel(data, fileName, sheetName) {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
      XLSX.writeFile(wb, fileName);
    },
  },
};
</script>
