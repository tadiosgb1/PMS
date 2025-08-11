<template>
  <section id="contact" class="py-16 bg-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-4xl font-bold text-gray-800">Contact Us</h2>
        <p class="text-lg text-gray-600 mt-2">
          We’d love to hear from you — whether you’re a client, partner, or just have a question!
        </p>
      </div>

      <!-- Contact Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10">
        <!-- Contact Info -->
        <div class="space-y-6">
          <div class="flex items-start space-x-4">
            <div class="text-orange-500 text-2xl">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-800">Address</h4>
              <p class="text-gray-600">123 Alpha Street, Addis Ababa, Ethiopia</p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="text-orange-500 text-2xl">
              <i class="fas fa-envelope"></i>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-800">Email</h4>
              <p class="text-gray-600">info@alphapms.com</p>
            </div>
          </div>

          <div class="flex items-start space-x-4">
            <div class="text-orange-500 text-2xl">
              <i class="fas fa-phone"></i>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-800">Phone</h4>
              <p class="text-gray-600">+251 911 123 456</p>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <form @submit.prevent="submitForm" class="space-y-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Your Name"
              v-model="form.name"
              required
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <input
              type="email"
              placeholder="Your Email"
              v-model="form.email"
              required
              class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <input
            type="text"
            placeholder="Subject"
            v-model="form.subject"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <textarea
            placeholder="Your Message"
            v-model="form.message"
            rows="5"
            class="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          ></textarea>
          <button
            type="submit"
            class="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-md shadow transition duration-300"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        subject: "",
        message: "",
      },
    };
  },
  methods: {
    submitForm() {
      // You can integrate with an API or send an email here.
      console.log("Form submitted:", this.form);
      alert("Thank you for contacting us!");
      this.form = { name: "", email: "", subject: "", message: "" };
    },
  },
};
</script>
