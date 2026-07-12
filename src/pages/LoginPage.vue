<template>
  <div class="container my-5">
    <h2 class="mb-4"><i class="bi bi-cart3"></i> Your Shopping Cart</h2>

    <div v-if="cartItems.length > 0" class="row">
      <div class="col-lg-8">
        <CartItem 
          v-for="item in cartItems" 
          :key="item.productId._id || item.productId" 
          :item="item" 
          @update-qty="handleUpdateQuantity"
          @remove="handleRemoveItem"
        />
        
        <div class="d-flex justify-content-between mt-3">
          <router-link to="/" class="btn btn-outline-dark">
            <i class="bi bi-arrow-left"></i> Continue Shopping
          </router-link>
          <button @click="handleClearCart" class="btn btn-outline-danger btn-sm">
            Clear Cart
          </button>
        </div>
      </div>

      <div class="col-lg-4 mt-4 mt-lg-0">
        <div class="card shadow-sm border-0 bg-light">
          <div class="card-body">
            <h4 class="card-title mb-4">Order Summary</h4>
            
            <div class="d-flex justify-content-between mb-2">
              <span>Items Count:</span>
              <span>{{ totalItems }}</span>
            </div>
            
            <hr>
            
            <div class="d-flex justify-content-between mb-4">
              <span class="h5">Total Price:</span>
              <span class="h5 text-primary">
                {{ totalPrice ? totalPrice.toLocaleString() : '0' }}
              </span>
            </div>

            <button @click="proceedToCheckout" class="btn btn-success w-100 btn-lg shadow-sm">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="mb-4">
        <i class="bi bi-cart-x text-muted" style="font-size: 4rem;"></i>
      </div>
      <h3>Your cart is empty</h3>
      <p class="text-muted">Looks like you haven't added any laptops to your cart yet.</p>
      <router-link to="/" class="btn btn-primary mt-3">Browse Laptops</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import CartItem from '../components/CartItem.vue';
import { useUserStore } from '../stores/global';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

const router = useRouter();
const cartItems = ref([]);
const userStore = useUserStore();
const isLoading = ref(true);

const fetchCart = async () => {
  try {
    isLoading.value = true;
    const res = await api.get('/cart/get-cart', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    // Check if res.data.cart exists before accessing cartItems
    if (res.data && res.data.cart) {
      cartItems.value = res.data.cart.cartItems || [];
    } else {
      cartItems.value = [];
    }
  } catch (error) {
    console.error("Error fetching cart:", error);
    cartItems.value = []; // Reset on error to prevent NaN loops
  } finally {
    isLoading.value = false;
  }
}

const totalPrice = computed(() => {
  return cartItems.value.reduce((acc, item) => {
    // Check if productId is populated with the laptop details
    const price = item.productId?.price || item.price || 0;
    return acc + (price * item.quantity);
  }, 0);
});

const totalItems = computed(() => {
  return cartItems.value.reduce((acc, item) => acc + item.quantity, 0);
});

// Inside src/pages/CartViewPage.vue script
const handleUpdateQuantity = async ({ productId, quantity }) => {
  try {
    await api.patch('/cart/update-cart-quantity', 
      { productId, quantity }, 
      {
        headers: {
          // FIX: Include authorization so the backend allows the update
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    
    // Refresh the data so the new subtotal shows up
    await fetchCart(); 
    await userStore.updateCartCount(); 
  } catch (err) {
    console.error("Update failed:", err);
    notyf.error("Failed to update quantity. Please try again.");
  }
};

// src/pages/CartViewPage.vue

const handleRemoveItem = async (productId) => {
  try {
    // FIX: Include headers so the backend knows WHO is removing the item
    await api.patch(`/cart/${productId}/remove-from-cart`, {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    await fetchCart(); 
    await userStore.updateCartCount();
    notyf.success("Item removed from cart.");
  } catch (err) {
    console.error("Remove failed:", err);
    notyf.error("Could not remove item.");
  }
};

const handleClearCart = async () => {
  if (!confirm("Are you sure you want to empty your cart?")) return;
  try {
    await api.put('/cart/clear-cart', {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    cartItems.value = [];
    await userStore.updateCartCount();
    notyf.success("Cart cleared successfully.");
  } catch (err) {
    console.error("Clear failed:", err);
    notyf.error("Error clearing cart.");
  }
};

const proceedToCheckout = () => {
  router.push('/checkout');
};


onMounted(() => {
  fetchCart();
});
</script>

<style scoped>
.container {
  min-height: 70vh;
}
</style>