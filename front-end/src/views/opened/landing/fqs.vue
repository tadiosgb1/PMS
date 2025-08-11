<template>
  <section class="bg-white py-16 px-6">
    <div class="max-w-5xl mx-auto text-center mb-12">
      <h2 class="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
      <p class="text-gray-500 text-lg">
        Everything you need to know about using <span class="text-orange-600 font-semibold">Alpha PMS</span> to manage your properties.
      </p>
    </div>

    <div class="max-w-4xl mx-auto space-y-6">
      <transition-group name="faq" tag="div">
        <div
          v-for="(faq, index) in displayedFaqs"
          :key="faq.question"
          class="bg-gray-50 border border-gray-200 rounded-xl p-6 shadow-sm transition-all"
        >
          <h3 class="text-lg font-semibold text-gray-800 mb-2">
            {{ faq.question }}
          </h3>
          <p class="text-gray-600 text-sm">
            {{ faq.answer }}
          </p>
        </div>
      </transition-group>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const faqs = [
  {
    question: 'What is Alpha PMS?',
    answer: 'Alpha PMS is a cloud-based Property Management System designed to help landlords, agents, and property managers efficiently manage their real estate portfolios.'
  },
  {
    question: 'Can I manage multiple properties with Alpha?',
    answer: 'Yes! Alpha allows you to manage unlimited properties, tenants, and units from a single dashboard.'
  },
  {
    question: 'Is Alpha PMS suitable for both residential and commercial properties?',
    answer: 'Absolutely. Alpha is built to handle both residential and commercial real estate, including apartments, office spaces, and mixed-use buildings.'
  },
  {
    question: 'Does Alpha include rent collection features?',
    answer: 'Yes, Alpha enables you to track rent payments, send reminders, generate invoices, and maintain full payment history per tenant.'
  },
  {
    question: 'Can tenants access the system?',
    answer: 'Tenants can log in to their own dashboards to view rent status, payment history, and communicate with the landlord or manager.'
  },
  {
    question: 'Is support available?',
    answer: 'We offer 24/7 customer support via chat and email to help you get the most out of Alpha PMS.'
  }
]

const displayedFaqs = ref([])
const delay = 400 // ms between each question

onMounted(() => {
  faqs.forEach((faq, index) => {
    setTimeout(() => {
      displayedFaqs.value.push(faq)
    }, index * delay)
  })
})
</script>

<style scoped>
.faq-enter-active {
  transition: all 0.5s ease;
}
.faq-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.faq-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
