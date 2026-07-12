<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <h2 class="mb-4 text-center">
              <i class="bi bi-box-arrow-in-right me-2"></i>Login
            </h2>

            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="email"
                  type="email"
                  class="form-control"
                  placeholder="you@example.com"
                  required
                >
              </div>

              <div class="mb-4">
                <label class="form-label">Password</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="********"
                  required
                >
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Logging in...' : 'Login' }}
              </button>
            </form>

            <p class="text-center mt-4 mb-0">
              Don't have an account?
              <router-link to="/register">Register here</router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/global';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  try {
    const result = await userStore.login({
      email: email.value,
      password: password.value
    });

    if (result.success) {
      notyf.success('Logged in successfully!');
      // Send admins to the dashboard, everyone else to the catalog
      router.push(userStore.isAdmin ? '/admin' : '/');
    } else {
      notyf.error(result.message || 'Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    notyf.error('Something went wrong. Please try again.');
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.card {
  border-radius: 12px;
}
</style>