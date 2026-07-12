<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-md-7 col-lg-6">
        <div class="card shadow-sm border-0">
          <div class="card-body p-4 p-md-5">
            <h2 class="mb-4 text-center">
              <i class="bi bi-person-plus me-2"></i>Register
            </h2>

            <form @submit.prevent="handleRegister">
              <div class="row">
                <div class="col-md-6 mb-3">
                  <label class="form-label">First Name</label>
                  <input
                    v-model="firstName"
                    type="text"
                    class="form-control"
                    placeholder="Juan"
                    required
                  >
                </div>
                <div class="col-md-6 mb-3">
                  <label class="form-label">Last Name</label>
                  <input
                    v-model="lastName"
                    type="text"
                    class="form-control"
                    placeholder="Dela Cruz"
                    required
                  >
                </div>
              </div>

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

              <div class="mb-3">
                <label class="form-label">Mobile Number</label>
                <input
                  v-model="mobileNo"
                  type="tel"
                  class="form-control"
                  placeholder="09171234567"
                  maxlength="11"
                  required
                >
                <small class="text-muted">Must be exactly 11 digits.</small>
              </div>

              <div class="mb-3">
                <label class="form-label">Password</label>
                <input
                  v-model="password"
                  type="password"
                  class="form-control"
                  placeholder="At least 8 characters"
                  required
                >
              </div>

              <div class="mb-4">
                <label class="form-label">Confirm Password</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="form-control"
                  placeholder="Re-enter your password"
                  required
                >
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="isLoading"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Creating account...' : 'Register' }}
              </button>
            </form>

            <p class="text-center mt-4 mb-0">
              Already have an account?
              <router-link to="/login">Login here</router-link>
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
import { registerUser } from '../services/api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const mobileNo = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
  // Client-side checks that mirror the backend's validation
  // so users get instant feedback instead of a round-trip error.
  if (!email.value.includes('@')) {
    notyf.error('Please enter a valid email address.');
    return;
  }
  if (mobileNo.value.length !== 11) {
    notyf.error('Mobile number must be exactly 11 digits.');
    return;
  }
  if (password.value.length < 8) {
    notyf.error('Password must be at least 8 characters.');
    return;
  }
  if (password.value !== confirmPassword.value) {
    notyf.error('Passwords do not match.');
    return;
  }

  isLoading.value = true;
  try {
    await registerUser({
      firstName: firstName.value,
      lastName: lastName.value,
      email: email.value,
      mobileNo: mobileNo.value,
      password: password.value
    });

    notyf.success('Registered successfully! Please log in.');
    router.push('/login');
  } catch (error) {
    console.error('Registration error:', error);
    const message = error.response?.data?.error || 'Registration failed. Please try again.';
    notyf.error(message);
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