<template>
  <div class="min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100">
   <section>
    <header class="bg-orange-500 sticky top-0 z-50 border-b border-white shadow-md">
      <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <!-- Logo Section -->
        <div class="flex items-center space-x-3 ">
          <div class="h-12 w-12 bg-white rounded-full">      <img src="@/assets/img/logo1.jpg" alt="Alpha PMS" class="w-10 h-10 rounded-full shadow pl-1 pt-1 -pr-1" /></div>
    
          <span class="text-2xl font-bold text-white tracking-wide">Alpha PMS</span>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center space-x-6 text-white text-sm font-medium">
          <a href="#home" class="hover:text-yellow-200 transition duration-200">Home</a>
          <a href="#features" class="hover:text-yellow-200 transition duration-200">Features</a>
          <a href="#plans" class="hover:text-yellow-200 transition duration-200">Pricing</a>
          <a href="#about" class="hover:text-yellow-200 transition duration-200">About</a>
          <a href="#contact" class="hover:text-yellow-200 transition duration-200">Contact</a>
        </nav>

        <!-- Right Side -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Language Selector -->
          <div class="relative">
            <select
              v-model="selectedLang"
              class="appearance-none cursor-pointer bg-white text-gray-700 text-sm font-medium px-4 py-2 pr-8 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-300"
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
              <option value="ti">Tigrigna</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
              <i class="fas fa-chevron-down text-xs"></i>
            </div>
          </div>

          <!-- Login Button -->
          <button
            @click="showLoginModal = true"
            class="relative inline-flex items-center justify-center px-5 py-2 font-semibold text-white bg-green-700 rounded-xl shadow-lg overflow-hidden group hover:bg-green-800 transition-all duration-300"
          >
            <span
              class="absolute inset-0 w-full h-full transition-all scale-0 group-hover:scale-100 group-hover:bg-white group-hover:opacity-10"
            ></span>
            <span class="relative z-10 flex items-center gap-2">
              <i class="fas fa-sign-in-alt"></i> Login
            </span>
          </button>
        </div>

        <!-- Hamburger Menu (Mobile) -->
        <button
          @click="mobileMenuOpen = !mobileMenuOpen"
          class="md:hidden text-white text-2xl focus:outline-none"
        >
          <i class="fas" :class="mobileMenuOpen ? 'fa-times' : 'fa-bars'"></i>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="md:hidden bg-orange-600 text-white text-sm px-6 pb-4 space-y-3">
        <a href="#home" class="block hover:text-yellow-200">Home</a>
        <a href="#features" class="block hover:text-yellow-200">Features</a>
        <a href="#plans" class="block hover:text-yellow-200">Pricing</a>
        <a href="#about" class="block hover:text-yellow-200">About</a>
        <a href="#contact" class="block hover:text-yellow-200">Contact</a>

        <div class="flex flex-col gap-3 pt-4">
          <!-- Mobile Language Selector -->
          <div class="relative">
            <select
              v-model="selectedLang"
              class="appearance-none cursor-pointer bg-white text-gray-700 text-sm font-medium px-4 py-2 pr-8 rounded-md shadow focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full"
            >
              <option value="en">English</option>
              <option value="am">Amharic</option>
              <option value="ti">Tigrigna</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
              <i class="fas fa-chevron-down text-xs"></i>
            </div>
          </div>

          <!-- Mobile Login Button -->
          <button
            @click="showLoginModal = true"
            class="w-full bg-green-700 hover:bg-green-800 text-white font-semibold py-2 rounded-xl shadow transition-all duration-300"
          >
            <i class="fas fa-sign-in-alt mr-2"></i> Login
          </button>
        </div>
      </div>
    </header>
  </section>
    <Hero @openLogin="showLoginModal=true" />
     <Features />

   <PropertiesSection />
    <!-- Plans Section -->
    <Plans id="plans" />



    <!-- Registration Form -->
    <section v-if="showForm" class="max-w-3xl mx-auto mt-12 px-6 py-10 bg-white rounded-2xl shadow-xl">
      <h3 class="text-2xl font-bold mb-6 text-indigo-700">Create Your Account</h3>
      <form @submit.prevent="submitForm" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input v-model="form.first_name" type="text" placeholder="First Name" class="input" />
        <input v-model="form.middle_name" type="text" placeholder="Middle Name" class="input" />
        <input v-model="form.last_name" type="text" placeholder="Last Name" class="input" />
        <input v-model="form.phone_number" type="text" placeholder="Phone Number" class="input" />
        <input v-model="form.email" type="email" placeholder="Email Address" class="input" />
        <input v-model="form.password" type="password" placeholder="Password" class="input" />

        <div class="col-span-full">
          <button class="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-lg font-semibold" type="submit">
            Register & Subscribe
          </button>
        </div>
      </form>
    </section>

    <Fqs />
    <ContactUs />
    <Footer />
    <LoginModal :visible="showLoginModal" @close="showLoginModal = false" @open="showLoginModal=true" />


  </div>
</template>

<script>


import Fqs from './fqs.vue'
import Footer from './footer.vue'
import Header from './header.vue'
import Plans from "./plans.vue"
import LoginModal from '../auth/login.vue'
import Hero from './hero.vue'
import Features from './features.vue'
import ContactUs from './contactUs.vue'
import PropertiesSection from './PropertiesSection.vue'
export default {
  components:{
    Plans,
    Footer,
    Header,
    Fqs,
    LoginModal,
    Hero,
    Features,
    ContactUs,
    PropertiesSection
  },
  data() {
    return {
      showLoginModal: false,
       selectedLang: "en",
      mobileMenuOpen: false,
      plans: [
        {
          id: 'basic001',
          name: 'Basic Plan',
          max_locations: 2,
          max_staff: 5,
          max_users: 10,
          max_kds: 1,
          kds_enabled: true,
          price: 199,
          billing_cycle: 'monthly'
        },
        {
          id: 'pro002',
          name: 'Pro Plan',
          max_locations: 10,
          max_staff: 25,
          max_users: 50,
          max_kds: 5,
          kds_enabled: true,
          price: 499,
          billing_cycle: 'monthly'
        },
        {
          id: 'enterprise003',
          name: 'Enterprise Plan',
          max_locations: 100,
          max_staff: 200,
          max_users: 500,
          max_kds: 50,
          kds_enabled: true,
          price: 1499,
          billing_cycle: 'monthly'
        }
      ],
      selectedPlan: null,
      showForm: false,
      form: {
        email: '',
        password: '',
        phone_number: '',
        first_name: '',
        middle_name: '',
        last_name: ''
      }
    };
  },
  methods: {
    selectPlan(planId) {
      this.selectedPlan = planId;
      this.showForm = true;
    },
    async submitForm() {
      if (!this.selectedPlan) return alert('Please select a plan.');
      const payload = { ...this.form, plan: this.selectedPlan };

      try {
        const res = await fetch('https://your-api.com/api/sign_up', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok) {
          alert('Registration successful!');
        } else {
          alert(data.error || 'Failed to register');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong.');
      }
    },
    controlLogin(status){
      this.showLoginModal=status
    },
    goToLogin() {
      this.$router.push('/login');
    },
    goToRegister() {
      const el = document.getElementById('plans');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }
};
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400;
}
</style>
