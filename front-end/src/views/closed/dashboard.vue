<template>
  <!-- Root container -->
  <div class="flex flex-col h-screen bg-gray-100 font-sans">
    <!-- Header -->
<header class="relative bg-white w-full shadow sticky top-0 z-20 px-4 py-3">
  <div class="flex items-center justify-between w-full">
    <!-- Left side: Toggle + Logo + Title -->
    <div class="flex items-center space-x-3">
      <!-- Sidebar toggle (mobile only) -->
      <button
        v-if="showToggleButton"
        @click="toggleSidebar"
        class="text-blue-500 hover:text-yellow-400 focus:outline-none sm:hidden"
        aria-label="Toggle sidebar"
      >
        <i class="fas fa-bars text-2xl"></i>
      </button>

      <!-- Logo and title -->
      <div class="flex items-center space-x-2">
        <img
          src="../../assets/img/logo1.jpg"
          alt="Logo"
          class="h-10 w-10 rounded-full flex-shrink-0"
        />
        <h1
          class="text-xl md:text-2xl font-extrabold text-blue-400 truncate"
          title="NePAF"
        >
          PMS
        </h1>
      </div>
    </div>

    <!-- Right side: Welcome + Username + Profile -->
    <div class="flex items-center space-x-4 text-blue-500">
      <span class="whitespace-nowrap hidden sm:block">Welcome,</span>
      <h1
        class="font-extrabold text-blue-400 hidden sm:block"
        title="User Name"
      >
        {{ name }}
      </h1>

      <!-- Profile dropdown -->
      <div class="relative" @click.stop="toggleProfileDropdown">
        <div
          class="w-8 h-8 bg-white text-primary rounded-full flex items-center justify-center cursor-pointer hover:bg-yellow-100"
          aria-haspopup="true"
          aria-expanded="isProfileDropdownOpen ? 'true' : 'false'"
          role="button"
          tabindex="0"
        >
          <i class="fas fa-user text-yellow-500"></i>
        </div>

        <transition name="fade">
          <ul
            v-show="isProfileDropdownOpen"
            class="absolute right-0 mt-2 w-44 bg-white shadow-md z-50 text-sm py-2 rounded"
            @click.outside="isProfileDropdownOpen = false"
          >
            <li>
              <a
                href="#"
                class="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                <i class="fas fa-cog text-yellow-500 mr-2"></i>
                <span>Change Password</span>
              </a>
            </li>
            <li>
              <a
                @click="logout"
                href="#"
                class="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                <i class="fas fa-sign-out-alt text-yellow-500 mr-2"></i>
                <span>Logout</span>
              </a>
            </li>
          </ul>
        </transition>
      </div>
    </div>
  </div>
</header>





    <!-- Main Content -->
    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar always visible on large screens (lg+), hidden on md and below -->
      <div
        class="hidden lg:block w-64   h-full  bg-white"
      >
        <Sidebar />
      </div>

      <!-- Overlay and Slide-in Sidebar for tablet and mobile -->
      <div
        v-if="showSidebar && screenWidth < 1024"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="toggleSidebar"
      ></div>
      <div
        v-if="showSidebar && screenWidth < 1024"
        class="fixed left-0 top-0 w-64 bg-white shadow-lg z-50 h-full overflow-y-auto"
      >
        <button
          class="absolute top-4 right-4 text-gray-600"
          @click="toggleSidebar"
        >
          <i class="fas fa-times text-xl"></i>
        </button>
        <Sidebar />
      </div>

      <!-- Main content slot -->
      <main class="flex-1 overflow-y-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import Sidebar from "@/components/layouts/leftSidevar.vue";

export default {
  name: "AppLayout",
  components: { Sidebar },
  data() {
    return {
      name:"",
      showSidebar: false,
      isLangOpen: false,
      isProfileDropdownOpen: false,
      screenWidth: window.innerWidth,
      currentLanguage: "English",
      showToggleButton: window.innerWidth < 1024,
    };
  },
  created() {
    window.addEventListener("resize", this.handleResize);
    this.name=localStorage.getItem('name');
  },
  // mounted(){
  //    this.$router.push("/dashboard/first-dash");
  // },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
  methods: {
    handleResize() {
      this.screenWidth = window.innerWidth;
      this.showToggleButton = this.screenWidth < 1024;
    },
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    toggleProfileDropdown() {
      this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
    },
    changeLang(lang) {
      this.currentLanguage = lang;
      this.isLangOpen = false;
    },
    logout() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
