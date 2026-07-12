<template>
  <div 
    class="card h-100 shadow-sm border-0 product-card position-relative clickable-card" 
    @click="openTab"
  >
    <div v-if="product.isBestSeller" class="best-seller-badge">
      <i class="bi bi-award-fill me-1"></i> Best Selling
    </div>

    <img 
      :src="productImages[0]" 
      class="card-img-top p-3" 
      :alt="product.name"
    >
    
    <div class="card-body d-flex flex-column">
      <div class="d-flex justify-content-between align-items-start mb-1">
        <h5 class="card-title fw-bold mb-0 text-truncate">{{ product.name }}</h5>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex align-items-center small">
          <div class="text-warning me-2">
            <i v-for="i in 5" :key="i" :class="i <= (product.rating || 0) ? 'bi bi-star-fill' : 'bi bi-star'"></i>
          </div>
          <span class="text-muted">({{ product.soldCount || 0 }} sold)</span>
        </div>
        <span v-if="isNewProduct" class="badge bg-info text-dark">New</span>
      </div>
      
      <div class="mt-auto">
        <h5 class="text-primary fw-bold mb-0">₱ {{ product.price.toLocaleString() }}</h5>
      </div>
    </div>
  </div>

  
  <div v-if="showDetails" class="custom-modal-overlay" @click.self="showDetails = false">
    <div class="custom-modal-container card shadow-lg border-0">
      <div class="card-header bg-white d-flex justify-content-between align-items-center border-0 pt-4 px-4">
        <h4 class="fw-bold mb-0">{{ product.name }}</h4>
        <button type="button" class="btn-close" @click="showDetails = false"></button>
      </div>
      
      <div class="card-body p-4 overflow-auto">
        <div class="row g-4">
          <div class="col-lg-6">
            <div id="productCarousel" class="carousel slide bg-light rounded-4" data-bs-ride="carousel">
              <div class="carousel-inner">
                <div 
                  v-for="(img, index) in productImages" 
                  :key="index" 
                  :class="['carousel-item', { active: index === 0 }]"
                >
                  <img :src="img" class="d-block w-100 p-4 product-main-img" alt="Product Image">
                </div>
              </div>
              <button v-if="productImages.length > 1" class="carousel-control-prev" type="button" data-bs-target="#productCarousel" data-bs-slide="prev">
                <span class="carousel-control-prev-icon bg-dark rounded-circle" aria-hidden="true"></span>
              </button>
              <button v-if="productImages.length > 1" class="carousel-control-next" type="button" data-bs-target="#productCarousel" data-bs-slide="next">
                <span class="carousel-control-next-icon bg-dark rounded-circle" aria-hidden="true"></span>
              </button>
            </div>
          </div>

          <div class="col-lg-6 d-flex flex-column">
            <div class="mb-4">
              <h6 class="fw-bold text-muted small text-uppercase mb-3">Product Details</h6>
              <p class="preserve-lines text-secondary">{{ product.description }}</p>
            </div>

            <div class="mt-auto p-4 bg-light rounded-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <span class="display-6 fw-bold text-primary">₱ {{ product.price.toLocaleString() }}</span>
                  <div class="text-warning mt-1 small">
                    <i class="bi bi-star-fill me-1"></i>{{ product.rating || 0 }} Rating
                  </div>
                </div>
                <div class="text-end">
                  <span class="badge bg-success px-3 py-2 mb-2">In Stock</span>
                  <div class="small text-muted">{{ product.soldCount || 0 }} units sold</div>
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label fw-semibold small text-uppercase text-muted">Quantity</label>
                <div class="input-group w-50">
                  <button @click.stop="quantity > 1 ? quantity-- : null" class="btn btn-outline-secondary btn-sm">-</button>
                  <input type="number" v-model.number="quantity" min="1" class="form-control form-control-sm text-center" @click.stop>
                  <button @click.stop="quantity++" class="btn btn-outline-secondary btn-sm">+</button>
                </div>
              </div>

              <div class="d-grid gap-3">
                <!-- Show cart/checkout only for regular (non-admin) users -->
                <template v-if="!userStore.isAdmin">
                  <button @click.stop="handleAddToCart" class="btn btn-dark btn-lg rounded-pill py-3" :disabled="isAdding">
                    <span v-if="isAdding" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-cart-plus me-2"></i>
                    {{ isAdding ? 'Adding...' : 'Add to Cart' }}
                  </button>

                  <button @click.stop="handleCheckout" class="btn btn-primary btn-lg rounded-pill py-3" :disabled="isCheckingOut">
                    <span v-if="isCheckingOut" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-bag-check me-2"></i>
                    {{ isCheckingOut ? 'Redirecting...' : 'Checkout Now' }}
                  </button>
                </template>

                <!-- Admins see a notice instead of cart buttons -->
                <div v-else class="alert alert-info text-center mb-0 py-3">
                  <i class="bi bi-shield-check me-2"></i>
                  Admin accounts cannot add items to cart.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/global';
import api from '../services/api';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf({ duration: 3000, position: { x: 'right', y: 'top' } });

const props = defineProps({
  product: { type: Object, required: true }
});

const userStore = useUserStore();
const router = useRouter();
const isAdding = ref(false);
// FIX 3: Separate loading state for the checkout button
const isCheckingOut = ref(false);
const showDetails = ref(false);
const quantity = ref(1); 

const productImages = computed(() => {
  const baseUrl = import.meta.env.VITE_JOB_TRACKER_API?.replace('/api', '') || 'http://localhost:4000';
  if (props.product.images && props.product.images.length > 0) {
    return props.product.images.map(img => 
      img.startsWith('http') ? img : `${baseUrl}/${img.replace(/\\/g, '/')}`
    );
  }
  return [props.product.image || 'https://placehold.jp/300x200.png?text=No+Image'];
});

const openTab = (event) => {
  if (event.target.closest('button') || event.target.closest('input')) return;
  quantity.value = 1; 
  showDetails.value = true;
};

const handleAddToCart = async () => {
  if (isAdding.value) return;

  const token = localStorage.getItem('token');
  if (!token) {
    notyf.error("Please login to add items to the cart.");
    return;
  }

  if (quantity.value < 1) {
    notyf.error("Please enter a valid quantity.");
    return;
  }

  try {
    isAdding.value = true;
    await api.post('/cart/add-to-cart', {
      productId: props.product._id,
      quantity: quantity.value  
    });

    await userStore.updateCartCount();
    notyf.success(`${quantity.value} item(s) added to cart!`);
    showDetails.value = false;
    quantity.value = 1;
  } catch (error) {
    console.error("Cart Error:", error);
    notyf.error("Failed to add to cart. Please try again.");
    // FIX 3: Return false so handleCheckout knows it failed
    return false;
  } finally {
    isAdding.value = false;
  }
  return true;
};

const isNewProduct = computed(() => {
  if (!props.product.createdAt) return false;
  const diffDays = Math.ceil(Math.abs(new Date() - new Date(props.product.createdAt)) / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
});

// FIX 3: await handleAddToCart() before navigating.
// Previously router.push fired immediately without waiting for the API call,
// so the checkout page could load before the item was saved to the cart.
const handleCheckout = async () => {
  isCheckingOut.value = true;
  try {
    const success = await handleAddToCart();
    if (success) {
      router.push('/checkout');
    }
  } finally {
    isCheckingOut.value = false;
  }
};
</script>

<style scoped>
.clickable-card { cursor: pointer; }

.product-card {
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

.card-img-top {
  height: 200px;
  object-fit: contain;
}

.best-seller-badge {
  position: absolute;
  top: 12px;
  left: -5px;
  background: #ffc107;
  padding: 4px 15px;
  font-size: 0.7rem;
  font-weight: bold;
  border-radius: 0 4px 4px 0;
  z-index: 2;
}

.custom-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-modal-container {
  width: 80%;
  max-width: 1200px;
  max-height: 90vh;
  background: white;
  border-radius: 24px;
}

.product-main-img {
  height: 400px;
  object-fit: contain;
}

.preserve-lines {
  white-space: pre-wrap;
  line-height: 1.6;
}

@media (max-width: 991px) {
  .custom-modal-container { width: 95%; max-height: 95vh; }
  .product-main-img { height: 250px; }
}
</style>