<template>
  <div>
    <Toast ref="toast" />
    <div class="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div class="bg-white shadow-md rounded-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-white text-black px-6 py-4 text-xl font-bold flex justify-between items-center"
        >
          Users Management
        </div>

        <!-- Tabs -->
        <div class="border-b border-gray-200">
          <nav
            class="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 px-2 sm:px-6 py-2"
            aria-label="Tabs"
          >
            <button
              v-if="is_superuser"
              @click="activeTab = 'allUsers'"
              class="tab-link"
              :class="{ 'tab-active': activeTab === 'allUsers' }"
            >
              All Users
            </button>

            <button
              v-if="is_superuser"
              @click="activeTab = 'superStaffs'"
              class="tab-link"
              :class="{ 'tab-active': activeTab === 'superStaffs' }"
            >
              Super Staffs
            </button>

            <button
              v-if="is_superuser"
              @click="activeTab = 'owners'"
              class="tab-link"
              :class="{ 'tab-active': activeTab === 'owners' }"
            >
              Owners
            </button>

            <button
              v-if="$hasPermission('pms.view_ownerstaff') || is_superuser"
              @click="activeTab = 'staffs'"
              class="tab-link"
              :class="{ 'tab-active': activeTab === 'staffs' }"
            >
              Owner Staffs
            </button>

            <button
              v-if="$hasPermission('pms.view_ownermanager') || is_superuser"
              @click="activeTab = 'managers'"
              class="tab-link"
              :class="{ 'tab-active': activeTab === 'managers' }"
            >
              Managers
            </button>

            <button v-if="is_superuser"
              @click="activeTab = 'brokers'"
              class="tab-link"
              :class="{ 'tab-active': activeTab === 'brokers' }"
            >
              Brokers
            </button>

            <button
              v-if="$hasPermission('pms.view_rentcycle') || is_superuser"
              @click="activeTab = 'tenants'"
              class="tab-link"
              :class="{ 'tab-active': activeTab === 'tenants' }"
            >
              Tenants
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="p-4 sm:p-6">
          <component :is="activeTabComponent" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import allUsers from "./allUsers.vue";
import staffs from "../stafs/view.vue";
import managers from "../managers/view.vue";
import owners from "../owners/view.vue";
import tenants from "../tenant/view.vue";
import superStaffs from "./superStaf.vue";
import brokers from "../brokers/view.vue";

export default {
  components: {
    allUsers,
    superStaffs,
    staffs,
    managers,
    owners,
    tenants,
    brokers,
  },
  data() {
    const is_superuser = localStorage.getItem("is_superuser") === "true";

    let defaultTab = "tenants";
    if (is_superuser) defaultTab = "allUsers";
    else if (this.$hasPermission("pms.view_ownerstaff")) defaultTab = "staffs";
    else if (this.$hasPermission("pms.view_ownermanager")) defaultTab = "managers";

    return {
      is_superuser,
      activeTab: defaultTab,
      showAddUser: false,
    };
  },
  computed: {
    activeTabComponent() {
      return this.activeTab;
    },
  },
};
</script>

<style scoped>
.tab-link {
  @apply py-2 px-3 sm:px-4 border-b-2 border-transparent text-sm font-medium text-gray-600 bg-gray-50 rounded-md hover:text-primary hover:bg-blue-50 hover:border-primary transition-all;
}
.tab-active {
  @apply text-primary bg-blue-100 border-primary font-semibold;
}

/* Ensure wrapping looks clean */
nav {
  flex-wrap: wrap;
}
</style>
