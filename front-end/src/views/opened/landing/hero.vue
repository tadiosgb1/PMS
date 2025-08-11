<template>
  <div
    class="bg-gradient-to-b from-yellow-500 via-[#0a0a2a] to-yellow-500 text-white font-sans"
  >
    <!-- HERO SECTION -->
    <section
      id="hero"
      class="relative min-h-screen flex flex-col justify-center items-center text-center bg-cover bg-center transition-all duration-1000"
      :style="{ backgroundImage: `url(${currentBg})` }"
    >
      <!-- Overlay -->
      <div class="absolute inset-0 bg-black bg-opacity-75 z-0"></div>

      <!-- Hero Content -->
      <div class="relative z-10 animate-fade-in-up space-y-6 px-4 max-w-4xl">
        <h2
          class="text-3xl sm:text-5xl md:text-6xl font-bold text-green-400 animate-slide-in"
        >
          Alpha Property Management
        </h2>
        <p
          class="text-lg sm:text-xl md:text-2xl text-white animate-fade-in delay-200"
        >
          Smart, secure, and seamless solutions for managing your properties and assets efficiently.
        </p>
        <p class="text-md sm:text-lg md:text-xl text-yellow-200 animate-fade-in delay-300">
          From real-time monitoring to financial tracking and tenant management — everything you need in one platform.
        </p>
        <div class="flex flex-wrap justify-center gap-4 animate-fade-in delay-500">
          <button
            class="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-6 rounded shadow hover:shadow-neon transition duration-300"
          >
            Get Started
          </button>
          <button
            class="bg-transparent border border-white hover:bg-white hover:text-black text-white font-semibold py-2 px-6 rounded transition duration-300"
          >
            Learn More
          </button>
        </div>
      </div>
    </section>
  </div>
</template>


<script>
import bg1 from "@/assets/img/hero/bg1.jpg";
import bg2 from "@/assets/img/hero/bg2.jpg";
import bg3 from "@/assets/img/hero/bg3.jpg";
import bg4 from "@/assets/img/hero/bg4.jpg";
export default {
  data() {
    return {
      bgImages: [bg1,bg2,bg3,bg4 ],
      currentBgIndex: 0,
      currentBg: "",
    };
  },
  mounted() {
    this.currentBg = this.bgImages[0];
    setInterval(() => {
      this.currentBgIndex = (this.currentBgIndex + 1) % this.bgImages.length;
      this.currentBg = this.bgImages[this.currentBgIndex];
    }, 8000); // every 8 seconds
  },
};
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-100px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes marquee {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 1s ease-out;
}

.animate-slide-in {
  animation: slide-in 1s ease-out;
}

.animate-fade-in {
  animation: fade-in-up 1s ease-out;
}

.hover\:shadow-neon:hover {
  box-shadow: 0 0 10px 4px rgba(255, 255, 0, 0.5);
}

.animate-marquee {
  animation: marquee 25s linear infinite;
}

@keyframes marquee {
  0% {
    transform: translateX(50%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.animate-marquee {
  animation: marquee 20s linear infinite;
}
</style>
