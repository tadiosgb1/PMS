<template>
  <div>
    <transition name="slide">
      <aside
        class="w-64 flex flex-col fixed md:relative z-15 h-full transition-all duration-300 bg-white mt-0 lg:mt-1"
      >
        <!-- Sidebar Title -->
        <div
          v-if="showTitle"
          class="flex flex-row space-x-4 p-4 text-center font-bold text-lg text-white bg-orange-500 sticky top-0 z-10"
        >
          <div class="w-12 h-12 bg-white rounded-full">
            <img
              src="../../assets/img/logo1.jpg"
              alt="Logo"
              class="h-10 w-10 rounded-full pl-1 pt-1"
            />
          </div>
          <p class="mt-3">Alpha PMS</p>
        </div>

        <!-- Navigation -->
        <div class="flex-1 overflow-y-auto">
          <ul class="p-3 space-y-1">
            <li v-for="item in filteredMenuItems" :key="item.route">
              <router-link
                :to="{ name: item.route }"
                class="flex items-center px-3 py-1 rounded-md hover:bg-orange-100 text-sm font-medium transition-all duration-200"
                :class="{
                  'bg-orange-50 text-orange-600 font-semibold':
                    $route.name === item.route,
                }"
              >
                <i
                  :class="[item.icon, 'w-4 text-sm mr-2']"
                  :style="{
                    color: $route.name === item.route ? '#f97316' : item.color,
                  }"
                ></i>
                <span class="whitespace-nowrap">{{ item.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>
      </aside>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTitle: false,
      is_superuser: false,
      menuItems: [
        {
          name: "Dashboard",
          route: "first-dash",
          icon: "fas fa-gauge", // ✅ updated from deprecated tachometer-alt
          color: "#f97316",
        },
        {
          name: "Configurations",
          route: "configurations",
          icon: "fas fa-gear", // ✅ fa-tags → fa-gear (better match)
          color: "#f59e0b",
          permission: "pms.view_plan",
          is_superuser: true,
        },
        {
          name: "Subscriptions",
          route: "subscriptions_view",
          icon: "fas fa-receipt", // ✅ fa-tags → fa-receipt
          color: "#f59e0b",
          permission: "pms.view_subscription",
        },
        {
          name: "Groups",
          route: "groups",
          icon: "fas fa-layer-group", // ✅ valid
          color: "#6366f1",
          permission: "auth.view_group",
        },
        {
          name: "Permissions",
          route: "permissions_view",
          icon: "fas fa-shield-halved", // ✅ modern version of fa-shield-alt
          color: "#10b981",
          permission: "auth.view_permission",
        },
        {
          name: "Users",
          route: "user_view",
          icon: "fas fa-user", // ✅ valid
          color: "#60a5fa",
          permission: "pms.view_user",
        },
        {
          name: "Zones",
          route: "zones",
          icon: "fas fa-map-location-dot", // ✅ fa-map-marked-alt replaced
          color: "#3b82f6",
          permission: "pms.view_propertyzone",
        },
        {
          name: "Properties",
          route: "properties",
          icon: "fas fa-building", // ✅ valid
          color: "#6b7280",
          permission: "pms.view_property",
        },
        {
          name: "Property Sales",
          route: "property_sales",
          icon: "fas fa-hand-holding-dollar", // ✅ fa-hand-holding-usd → updated name
          color: "#6b7280",
          permission: "pms.view_propertyzonesale",
            //permission: "pms.view_propertysale",
        },
        {
          name: "Rent Management",
          route: "rents",
          icon: "fas fa-file-contract", // ✅ valid
          color: "#3b82f6",
          permission: "pms.view_rent",
        },
        {
          name: "Maintenance Requests",
          route: "maintenance-requests",
          icon: "fas fa-screwdriver-wrench", // ✅ fa-tools → modern name
          color: "#ef4444",
          permission: "pms.view_maintenancerequest",
        },
        {
          name: "Payments",
          route: "payments",
          icon: "fas fa-money-bill-wave", // ✅ valid
          color: "#22c55e",
        },
        {
          name: "Coworking Spaces",
          route: "coworking-spaces",
          icon: "fas fa-people-roof", // ✅ better icon for shared spaces
          color: "#22c55e",
        },
        {
          name: "Coworking-space-rentals",
          route: "coworking-space-rentals",
          icon: "fas fa-file-signature", // ✅ relevant for contracts
          color: "#22c55e",
        },
        {
          name: "Transactions",
          route: "transactions",
          icon: "fas fa-arrows-rotate", // ✅ better for transactions
          color: "#22c55e",
        },
        {
          name: "Reports",
          route: "reports",
          icon: "fas fa-chart-line", // ✅ fa-file-alt → fa-chart-line (better match)
          color: "#22c55e",
        },
        {
          name: "Notifications",
          route: "notifications",
          icon: "fas fa-bell", // ✅ fa-money-bill-wave → fixed
          color: "#22c55e",
        },
         {
          name: "Contacts",
          route: "contacts",
          icon: "fas fa-user", // ✅ fa-money-bill-wave → fixed
          color: "#22c55e",
        },
      ],
    };
  },
  computed: {
    filteredMenuItems() {
      return this.menuItems.filter((item) => {
        if (item.is_superuser && !this.is_superuser) return false;
        if (item.permission) {
          return this.$hasPermission(item.permission);
        }
        return true;
      });
    },
  },
  mounted() {
    this.is_superuser = localStorage.getItem("is_superuser") === "true";
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1024) {
      this.showTitle = true;
    }
  },
};
</script>
