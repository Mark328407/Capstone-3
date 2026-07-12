// FIX 2: Added /profile route so the Navbar's "Profile Settings" link
// no longer leads to the 404 page.

import { createRouter, createWebHistory } from 'vue-router'; 

import ProductsCatalogPage from '../pages/ProductsCatalogPage.vue';
import LoginPage from '../pages/LoginPage.vue';
import RegisterPage from '../pages/RegisterPage.vue';
import AdminDashboardPage from '../pages/AdminDashboardPage.vue';
import CartViewPage from '../pages/CartViewPage.vue';
import CheckoutOrderPage from '../pages/CheckoutOrderPage.vue';
import MyOrdersPage from '../pages/MyOrdersPage.vue';
import NotFoundPage from '../pages/NotFoundPage.vue';
import AdminOrdersPage from '../pages/AdminOrdersPage.vue';
// FIX 2: Import the new ProfilePage
import ProfilePage from '../pages/ProfilePage.vue';

const routes = [
  {
    path: '/',
    name: 'Products',
    component: ProductsCatalogPage
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterPage
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboardPage,
    meta: { requiresAdmin: true }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: CartViewPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: CheckoutOrderPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/my-orders',
    name: 'MyOrders',
    component: MyOrdersPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/orders',
    name: 'AdminOrders',
    component: AdminOrdersPage,
    meta: { requiresAdmin: true }
  },
  // FIX 2: Register the /profile route so clicking "Profile Settings"
  // in the Navbar dropdown works instead of hitting the 404 page.
  {
    path: '/profile',
    name: 'Profile',
    component: ProfilePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = (userData && userData !== "undefined") ? JSON.parse(userData) : {};

  if (to.meta.requiresAuth && !token) {
    return { name: 'Login' };
  }

  if (to.meta.requiresAdmin && (!token || !user.isAdmin)) {
    return { name: 'Products' };
  }

  return true;
});

export default router;