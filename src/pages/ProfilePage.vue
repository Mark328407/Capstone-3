<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-md-7 col-lg-5">

        <div class="card shadow-lg border-0 rounded-3">
          <div class="card-body p-4 p-md-5">

            <div class="text-center mb-4">
              <div class="avatar-circle mx-auto mb-3">
                <i class="bi bi-person-fill fs-1 text-white"></i>
              </div>
              <h4 class="fw-bold mb-0">{{ userStore.user?.firstName }} {{ userStore.user?.lastName }}</h4>
              <p class="text-muted small">{{ userStore.user?.email }}</p>
            </div>

            <div v-if="feedback.message" :class="['alert', `alert-${feedback.type}`, 'alert-dismissible', 'fade', 'show']">
              {{ feedback.message }}
              <button type="button" class="btn-close" @click="feedback.message = ''"></button>
            </div>

            <h6 class="fw-bold mb-3 text-uppercase text-muted small">Change Password</h6>
            <form @submit.prevent="handleChangePassword">
              <div class="mb-3">
                <label class="form-label fw-semibold">New Password</label>
                <div class="input-group">
                  <span class="input-group-text bg-light"><i class="bi bi-lock"></i></span>
                  <input
                    v-model="newPassword"
                    type="password"
                    class="form-control"
                    placeholder="Min. 8 characters"
                    required
                    minlength="8"
                  >
                </div>
              </div>

              <button type="submit" class="btn btn-primary w-100 py-2 fw-bold" :disabled="isLoading">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ isLoading ? 'Updating...' : 'Update Password' }}
              </button>
            </form>

            <hr class="my-4">

            <div class="text-center">
              <button @click="userStore.logout()" class="btn btn-outline-danger btn-sm px-4">
                <i class="bi bi-box-arrow-right me-2"></i>Logout
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useUserStore } from '../stores/global';
import api from '../services/api';

const userStore = useUserStore();
const newPassword = ref('');
const isLoading = ref(false);
const feedback = reactive({ message: '', type: 'success' });

const handleChangePassword = async () => {
  isLoading.value = true;
  feedback.message = '';
  try {
    await api.patch('/users/update-password', { newPassword: newPassword.value });
    feedback.type = 'success';
    feedback.message = 'Password updated successfully!';
    newPassword.value = '';
  } catch (err) {
    feedback.type = 'danger';
    feedback.message = err.response?.data?.error || 'Failed to update password.';
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.avatar-circle {
  width: 72px;
  height: 72px;
  background: linear-gradient(135deg, #0d6efd, #0a58ca);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13,110,253,.15);
}
</style>