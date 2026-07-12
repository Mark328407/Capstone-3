<template>
  <div class="card mb-3 shadow-sm border-0 position-relative clickable-card" @click="showDetails = true">
    
    <div v-if="item.productId?.isBestSeller" class="best-seller-tag">
      <i class="bi bi-fire me-1"></i> Best Seller
    </div>

    <div class="card-body">
      <div class="row align-items-center">
        <div class="col-12 col-md-2 text-center mb-3 mb-md-0">
          <img 
            :src="item.productId?.image || 'https://placehold.jp/24/0d6efd/ffffff/100x80.png?text=Laptop'" 
            class="img-fluid rounded" 
            alt="Laptop"
          >
        </div>
        
        <div class="col-12 col-md-4 mb-3 mb-md-0">
          <h5 class="card-title mb-1 text-primary">{{ item.productId?.name || 'Unknown Laptop' }}</h5>
          
          <div class="small mb-1">
            <span class="text-warning">
              <i v-for="i in 5" :key="i" :class="i <= (item.productId?.rating || 0) ? 'bi bi-star-fill' : 'bi bi-star'"></i>
            </span>
            <span class="text-muted ms-2">({{ item.productId?.soldCount || 0 }} sold)</span>
          </div>

          <p class="text-muted small mb-0">Unit Price: ₱ {{ (item.productId?.price || 0).toLocaleString() }}</p>
        </div>

        <div class="col-6 col-md-3" @click.stop>
          <div class="input-group input-group-sm w-75 mx-auto mx-md-0">
            <button @click="updateQty(item.quantity - 1)" class="btn btn-outline-secondary" :disabled="item.quantity <= 1"> - </button>
            <input type="number" class="form-control text-center" :value="item.quantity" readonly>
            <button @click="updateQty(item.quantity + 1)" class="btn btn-outline-secondary"> + </button>
          </div>
        </div>

        <div class="col-6 col-md-3 text-end" @click.stop>
          <p class="fw-bold mb-1">Subtotal: ₱ {{ subtotal.toLocaleString() }}</p>
          <button @click="$emit('remove', item.productId?._id || item.productId)" class="btn btn-link btn-sm text-danger p-0 text-decoration-none">
            <i class="bi bi-trash"></i> Remove
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="offcanvas offcanvas-end" :class="{ show: showDetails }" tabindex="-1" v-if="showDetails">
    <div class="offcanvas-header border-bottom">
      <h5 class="offcanvas-title fw-bold">{{ item.productId?.name }}</h5>
      <button type="button" class="btn-close" @click="showDetails = false"></button>
    </div>
    <div class="offcanvas-body">
       <span class="h4 fw-bold text-primary">₱ {{ (item.productId?.price || 0).toLocaleString() }}</span>
       <button @click="showDetails = false" class="btn btn-primary w-100 py-2">Back to Cart</button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update-qty', 'remove']);
const showDetails = ref(false);

// FIX: Subtotal calculation using nested productId price
const subtotal = computed(() => (props.item.productId?.price || 0) * props.item.quantity);

const itemImages = computed(() => {
  if (props.item.productId?.images && props.item.productId.images.length > 0) {
    return props.item.productId.images;
  }
  return [props.item.productId?.image || 'https://placehold.jp/300x200.png?text=Laptop'];
});

const updateQty = (newQty) => {
  if (newQty > 0) {
    // FIX: Send the correct ID to the backend
    const id = props.item.productId?._id || props.item.productId;
    emit('update-qty', { productId: id, quantity: newQty });
  }
};
</script>

<style scoped>
.clickable-card {
  cursor: pointer;
  transition: all 0.3s ease;
}

.clickable-card:hover {
  transform: scale(1.01);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
}

/* Best Seller Badge Styles */
.best-seller-tag {
  position: absolute;
  top: 10px;
  right: -5px;
  background: #ffc107;
  color: #000;
  padding: 2px 12px;
  font-size: 0.7rem;
  font-weight: bold;
  text-transform: uppercase;
  border-radius: 4px 0 0 4px;
  box-shadow: -2px 2px 5px rgba(0,0,0,0.1);
  z-index: 5;
}

.offcanvas {
  width: 400px !important;
  border-left: none;
  box-shadow: -10px 0 30px rgba(0,0,0,0.1);
}

@media (max-width: 576px) {
  .offcanvas {
    width: 100% !important;
  }
}
</style>