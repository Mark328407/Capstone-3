<template>
  <AppNavbar />
  <main class="py-4">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </main>
  <footer class="py-4 bg-white border-top mt-auto">
    <div class="container text-center text-muted">
      <small>&copy; 2026 LaptopStore | Zuitt Coding Bootcamp Capstone</small>
    </div>
  </footer>
</template>
<script setup>
import AppNavbar from './components/AppNavbar.vue';
</script>
<style>
/* Global Styles - Modern Tech Color Palette */
:root {
  --primary-color: #2563EB;
  --secondary-color: #1F2937;
  --accent-color: #10B981;
  /* Bootstrap variable overrides (repaints utility classes: bg-primary, text-primary, border-primary, bg-dark, bg-success, etc.) */
  --bs-primary: #2563EB;
  --bs-primary-rgb: 37, 99, 235;
  --bs-dark: #1F2937;
  --bs-dark-rgb: 31, 41, 55;
  --bs-success: #10B981;
  --bs-success-rgb: 16, 185, 129;
}
body {
  background-color: #F8FAFC;
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
/* Buttons: Bootstrap bakes btn-primary/btn-success colors as fixed hex per-component,
   so they need explicit overrides (utility classes like bg-primary/text-primary
   already pick up the --bs-primary var above automatically) */
.btn-primary {
  --bs-btn-bg: #2563EB;
  --bs-btn-border-color: #2563EB;
  --bs-btn-hover-bg: #1D4ED8;
  --bs-btn-hover-border-color: #1D4ED8;
  --bs-btn-active-bg: #1D4ED8;
  --bs-btn-active-border-color: #1D4ED8;
  --bs-btn-disabled-bg: #2563EB;
  --bs-btn-disabled-border-color: #2563EB;
  --bs-btn-focus-shadow-rgb: 37, 99, 235;
}
.btn-outline-primary {
  --bs-btn-color: #2563EB;
  --bs-btn-border-color: #2563EB;
  --bs-btn-hover-bg: #2563EB;
  --bs-btn-hover-border-color: #2563EB;
  --bs-btn-active-bg: #2563EB;
  --bs-btn-active-border-color: #2563EB;
  --bs-btn-focus-shadow-rgb: 37, 99, 235;
}
.btn-success {
  --bs-btn-bg: #10B981;
  --bs-btn-border-color: #10B981;
  --bs-btn-hover-bg: #0EA271;
  --bs-btn-hover-border-color: #0EA271;
  --bs-btn-active-bg: #0EA271;
  --bs-btn-active-border-color: #0EA271;
  --bs-btn-disabled-bg: #10B981;
  --bs-btn-disabled-border-color: #10B981;
  --bs-btn-focus-shadow-rgb: 16, 185, 129;
}
/* Price text color - Emerald accent, used across product cards, cart, and checkout */
.text-price {
  color: #10B981 !important;
}
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
main {
  flex: 1; /* Pushes the footer to the bottom of the page */
}
/* Page Transition Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
/* Customizing Bootstrap Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>