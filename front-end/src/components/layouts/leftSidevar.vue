<template>
  <div>
    <transition name="slide">
      <aside
        class="w-64 flex flex-col fixed md:relative z-15 h-full transition-all duration-300 bg-white mt-0 lg:mt-1"
      >
        <div
          v-if="showTitle"
          class="flex flex-row space-x-4 p-4 text-center font-bold text-lg text-white bg-orange-500 sticky top-0 z-10"
        >
          <div class="w-12 h-12 bg-white rounded-full">
            <img
              src="../../assets/img/logo1.jpg"
              alt=""
              class="h-10 w-10 rounded-full pl-1 pt-1"
            />
          </div>

          <p class="mt-3">Alpha PMS</p>
        </div>

        <!-- Navigation -->
        <div class="flex-1 overflow-y-auto">
          <ul class="p-3 space-y-1">
            <li v-for="item in menuItems" :key="item.route">
              <router-link
                :to="{ name: item.route }"
                class="flex items-center px-3 py-2 rounded-md hover:bg-orange-100 text-sm font-medium transition-all duration-200"
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
                <span class="whitespace-nowrap">{{ item.name }} </span>
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
          icon: "fas fa-tachometer-alt",
          color: "#f97316",
        },
        {
          name: "Users",
          route: "user_view",
          icon: "fas fa-user",
          color: "#60a5fa",
        },
        {
          name: "Plans",
          route: "plans_view",
          icon: "fas fa-tags",
          color: "#f59e0b",
          is_superuser: true,
        },
        {
          name: "Subscriptions",
          route: "subscriptions_view",
          icon: "fas fa-tags",
          color: "#f59e0b",
        },
        {
          name: "Permissions",
          route: "permissions_view",
          icon: "fas fa-shield-alt",
          color: "#10b981",
        },
        {
          name: "Groups",
          route: "groups",
          icon: "fas fa-layer-group",
          color: "#6366f1",
        },
        {
          name: "Zones",
          route: "zones",
          icon: "fas fa-map-marked-alt",
          color: "#3b82f6",
        },
         {
          name: "staffs",
          route: "staffs",
          icon: "fas fa-map-marked-alt",
          color: "#3b82f6",
        },
        {
          name: "Properties",
          route: "properties",
          icon: "fas fa-building",
          color: "#6b7280",
        },

        {
          name: "Property Sales",
          route: "property_sales",
          icon: "fas fa-building",
          color: "#6b7280",
        },

        {
          name: "Sales Payments",
          route: "sales_payments",
          icon: "fas fa-building",
          color: "#6b7280",
        },
        
        {
          name: "Rent Management",
          route: "rents",
          icon: "fas fa-map-marked-alt",
          color: "#3b82f6",
        },
        
        {
          name: "Maintenance Requests",
          route: "maintenance-requests",
          icon: "fas fa-users",
          color: "#ef4444",
        },

        {
          name: "Tenants",
          route: "tenants",
          icon: "fas fa-users",
          color: "#ef4444",
        },


        {
          name: "Payments",
          route: "payments",
          icon: "fas fa-money-bill-wave",
          color: "#22c55e",
        },
      ],
    };
  },
  mounted() {
    this.is_superuser = localStorage.getItem("is_superuser");

    console.log("is_super_admin", this.is_superuser);

    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 1024) {
      this.showTitle = true;
    }
  },
};
</script>

<style scoped>
/* Slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}

/* Optional: Better scroll experience */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(249, 115, 22, 0.4); /* orange scrollbar thumb */
  border-radius: 4px;
}
</style>
