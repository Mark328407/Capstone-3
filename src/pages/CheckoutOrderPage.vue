<template>
  <div class="container my-5">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-10">
        <h2 class="mb-4 text-center">Checkout</h2>
        
        <div class="row g-4">
          <div class="col-md-7">
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-header bg-dark text-white">
                <h5 class="mb-0">Shipping Information</h5>
              </div>
              <div class="card-body">
                <form id="checkoutForm" @submit.prevent="handlePlaceOrder">
                  <div class="mb-3">
                    <label class="form-label">Full Name</label>
                    <input type="text" class="form-control" placeholder="Juan Dela Cruz" required>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Shipping Address</label>
                    <textarea class="form-control" rows="2" placeholder="123 Street, Taguig City, Philippines" required></textarea>
                  </div>
                  <div class="mb-3">
                    <label class="form-label">Payment Method</label>
                    <select class="form-select">
                      <option value="cod">Cash on Delivery (COD)</option>
                      <option value="card" disabled>Credit/Debit Card (Coming Soon)</option>
                    </select>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div class="col-md-5">
            <div class="card shadow-sm border-0">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">Order Summary</h5>
              </div>
              <div class="card-body">
                <div v-for="item in cartItems" :key="item.productId._id" class="mb-3 border-bottom pb-2">
                  <div class="d-flex justify-content-between">
                    <span class="fw-bold">{{ item.productId?.name || 'Loading Laptop...' }}</span>
                    <span>₱ {{ ((item.productId?.price || 0) * item.quantity).toLocaleString() }}</span>
                  </div>
                  <div class="small text-muted">x{{ item.quantity }}</div>
                </div>

                <div class="d-flex justify-content-between align-items-center mt-4">
                  <span class="h5">Total to Pay:</span>
                  <span class="h5 text-primary fw-bold">₱ {{ totalPrice.toLocaleString() }}</span>
                </div>

                <button 
                  type="submit" 
                  form="checkoutForm" 
                  class="btn btn-success w-100 btn-lg" 
                  :disabled="isProcessing || cartItems.length === 0"
                >
                  <span v-if="isProcessing" class="spinner-border spinner-border-sm me-2"></span>
                  {{ isProcessing ? 'Processing...' : 'Place Order' }}
                </button>
                
                <router-link to="/cart" class="btn btn-link w-100 mt-2 text-decoration-none text-muted">
                  Back to Cart
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import { useUserStore } from '../stores/global'; 

const router = useRouter();
const userStore = useUserStore();
const cartItems = ref([]); 
const isProcessing = ref(false);

const totalPrice = computed(() => {

  if (!cartItems.value || cartItems.value.length === 0) return 0;
  
  return cartItems.value.reduce((acc, item) => {
   
    const price = item.productId?.price || 0;
    return acc + (price * item.quantity);
  }, 0);
});

const fetchCart = async () => {
  try {
    const res = await api.get('/cart/get-cart', {
      headers: {
        
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    
 
    if (res.data && res.data.cart) {
      cartItems.value = res.data.cart.cartItems || [];
    } else {
      cartItems.value = [];
    }
    
    if (cartItems.value.length === 0) {
      router.push('/cart');
    }
  } catch (err) {
    console.error("Error loading checkout", err);
    cartItems.value = []; 
  }
};

const handlePlaceOrder = async () => {
  if (cartItems.value.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  isProcessing.value = true;
  try {
   
    const token = localStorage.getItem('token'); 

  const res = await api.post('/orders/checkout', {}, {
    headers: { Authorization: `Bearer ${token}` }
  });

    if (res.status === 201 || res.status === 200) {
      alert("Order Placed Successfully!");
      await userStore.updateCartCount(); 
      router.push('/my-orders'); 
    }
  } catch (err) {
    console.error("Checkout Error:", err);
    alert("Place order failed. Please check your connection.");
  } finally {
    isProcessing.value = false;
  }
};

onMounted(fetchCart);
</script>

<style scoped>
.card {
  border-radius: 10px;
}
.form-control:focus {
  border-color: #2563EB;
  box-shadow: none;
}
</style>