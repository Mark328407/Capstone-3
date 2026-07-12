<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow">
    <div class="container">
      <router-link class="navbar-brand fw-bold" to="/">
        <i class="bi bi-laptop me-2 text-primary"></i>HyperHub
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <div class="mx-auto my-2 my-lg-0 col-12 col-lg-5">
          <form @submit.prevent="handleSearch" class="input-group input-group-sm">
            <input 
              v-model="searchQuery"
              type="text" 
              class="form-control bg-secondary border-secondary text-white search-input" 
              placeholder="Search brand, model..." 
              aria-label="Search"
            >
            <button class="btn btn-primary" type="submit">
              <i class="bi bi-search"></i>
            </button>
          </form>
        </div>

        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <router-link class="nav-link btn btn-outline-primary border-0" to="/">Products</router-link>
          </li>

          <template v-if="userStore.isLoggedIn && userStore.isAdmin">
            <li class="nav-item">
              <router-link class="nav-link btn btn-outline-primary border-0" to="/admin">
                <i class="bi bi-speedometer2 me-1"></i>Dashboard
              </router-link>
            </li>
            <li class="nav-item me-lg-3">
              <router-link class="nav-link btn btn-outline-primary border-0" to="/admin/orders">
                <i class="bi bi-clipboard-check me-1"></i>Orders
              </router-link>
            </li>
          </template>

          <li v-if="userStore.isLoggedIn && !userStore.isAdmin" class="nav-item me-lg-3">
            <router-link class="nav-link position-relative d-inline-block px-2" to="/cart">
              <i class="bi bi-cart3 fs-5"></i>
              <span v-if="userStore.cartCount > 0" 
                class="position-absolute badge rounded-pill bg-danger"
                style="top: 2px; right: -2px; font-size: 0.65rem; padding: 0.35em 0.5em;">
                {{ userStore.cartCount }}
              </span>
            </router-link>
          </li>

          <template v-if="!userStore.isLoggedIn">
            <li class="nav-item">
              <router-link class="nav-link" to="/login">Login</router-link>
            </li>
            <li class="nav-item ms-lg-2">
              <router-link class="btn btn-primary btn-sm px-3" to="/register">Register</router-link>
            </li>
          </template>

          <li v-else class="nav-item">
            <div class="dropdown">
              <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <i class="bi bi-person-circle me-1"></i> 
                {{ userStore.user?.firstName }}
              </button>
              <ul class="dropdown-menu dropdown-menu-end shadow">
                <li v-if="userStore.isLoggedIn && !userStore.isAdmin">
                  <router-link class="dropdown-item" to="/my-orders">
                    <i class="bi bi-bag-check me-2"></i>My Orders
                  </router-link>
                </li>
                <li>
                  <router-link class="dropdown-item" to="/profile">
                    <i class="bi bi-person me-2"></i>Profile Settings
                  </router-link>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button @click="onLogout" class="dropdown-item text-danger">
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/global';

const userStore = useUserStore();
const router = useRouter();
const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/', query: { search: searchQuery.value } });
    searchQuery.value = '';
  }
};

const onLogout = () => {
  userStore.logout();
  router.push('/login');
};

// Ensure cart count only attempts to sync if a token actually exists
const syncCartData = async () => {
  if (userStore.isLoggedIn && !userStore.isAdmin) {
    await userStore.updateCartCount();
  }
};

onMounted(syncCartData);

onMounted(() => {
  if (userStore.token && !userStore.user) {
    // If we have a token but lost the user object, 
    // we could trigger a 'fetchProfile' action here.
  }
});

</script>

<style scoped>
.navbar {
  transition: all 0.3s ease;
}

.nav-link {
  font-weight: 500;
  color: rgba(255,255,255,0.85);
}

.nav-link:hover {
  color: #fff;
}

/* Modern Search Input Styling */
.search-input {
  border-radius: 20px 0 0 20px !important;
}
.search-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}
.search-input:focus {
  background-color: #495057 !important;
  box-shadow: none;
  border-color: #0d6efd;
  color: white;
}
.input-group .btn {
  border-radius: 0 20px 20px 0 !important;
}

.badge {
  font-size: 0.6rem;
  padding: 0.3em 0.45em;
  transform: translate(-20%, -20%);
}

.dropdown-item {
  font-size: 0.9rem;
}
</style>