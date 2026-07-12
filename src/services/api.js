import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_JOB_TRACKER_API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getActiveProducts = () => api.get('/products/active');
export const getAllProducts = () => api.get('/products/all');
export const createProduct = (data) => api.post('/products/', data);
export const updateProduct = (id, data) => api.patch(`/products/${id}/update`, data);
export const archiveProduct = (id) => api.patch(`/products/${id}/archive`);
export const activateProduct = (id) => api.patch(`/products/${id}/activate`);
export const toggleProductStatus = (id, isActive) =>
  isActive ? api.patch(`/products/${id}/archive`) : api.patch(`/products/${id}/activate`);


export const loginUser = (credentials) => api.post('/users/login', credentials);
export const registerUser = (userData) => api.post('/users/register', userData);
export const getProfile = () => api.get('/users/details');


export const getCart = () => api.get('/cart/get-cart');
export const addToCart = (data) => api.post('/cart/add-to-cart', data);
export const updateCartQuantity = (data) => api.patch('/cart/update-cart-quantity', data);
export const removeFromCart = (productId) => api.patch(`/cart/${productId}/remove-from-cart`);
export const clearCart = () => api.put('/cart/clear-cart');


export const checkoutOrder = () => api.post('/orders/checkout');
export const getMyOrders = () => api.get('/orders/my-orders');

export default api;