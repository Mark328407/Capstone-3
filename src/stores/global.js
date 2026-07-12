import { defineStore } from 'pinia';
import api from '../services/api';
import router from '../router';

export const useUserStore = defineStore('global', {
  state: () => ({
    user: localStorage.getItem('user') && localStorage.getItem('user') !== "undefined"
      ? JSON.parse(localStorage.getItem('user'))
      : null,
    token: localStorage.getItem('token') || null,
    cartCount: 0
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.isAdmin || false
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.post('/users/login', credentials);

        // Backend returns: { access: "eyJ..." }
        const token = response.data.access || response.data.token;

        if (!token) {
          return { success: false, message: "No token received" };
        }

        // FIX: The backend only returns { access: token }.
        // There is no response.data.user — decode the JWT payload directly.
        let userData = {};
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          // JWT payload has: { id, email, isAdmin }
          userData = {
            id:      payload.id,
            email:   payload.email,
            isAdmin: payload.isAdmin || false
          };
        } catch (e) {
          console.error("Failed to parse JWT payload", e);
          return { success: false, message: "Invalid token received" };
        }

        this.token = token;
        this.user  = userData;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));

        // Only fetch cart count for non-admin users
        if (!userData.isAdmin) {
          await this.updateCartCount();
        }

        return { success: true };
      } catch (error) {
        console.error("Login Error:", error);
        return {
          success: false,
          message: error.response?.data?.error || error.response?.data?.message || "Login failed"
        };
      }
    },

    logout() {
      this.user      = null;
      this.token     = null;
      this.cartCount = 0;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
    },

    async updateCartCount() {
      if (!this.token || this.isAdmin) {
        this.cartCount = 0;
        return;
      }

      try {
        const res   = await api.get('/cart/get-cart');
        const items = res.data.cart?.cartItems || res.data.cartItems || [];
        this.cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
      } catch (err) {
        if (err.response?.status === 404) {
          this.cartCount = 0;
        } else {
          console.error("Could not sync cart count", err);
        }
      }
    }
  }
});