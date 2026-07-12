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
/* Global Styles */
:root {
  --primary-color: #0d6efd;
}

body {
  background-color: #f8f9fa;
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
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