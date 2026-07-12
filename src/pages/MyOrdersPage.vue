<template>
  <div class="container py-4">
    <h2 class="mb-4 text-center">My Purchase</h2>

    <div class="tabs-container mb-4">
      <ul class="nav nav-tabs nav-justified">
        <li class="nav-item" v-for="tab in tabOptions" :key="tab">
          <a 
            class="nav-link" 
            :class="{ active: activeTab === tab }" 
            @click.prevent="activeTab = tab" 
            href="#"
          >
            {{ tab }}
          </a>
        </li>
      </ul>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted">Fetching your orders...</p>
    </div>

    <div v-else-if="filteredOrders.length === 0" class="text-center py-5 empty-state">
      <div class="empty-icon-container mb-3">
        <i class="bi bi-bag-x"></i>
      </div>
      <h5 class="text-dark">No orders yet</h5>
      <p class="text-muted">Orders in the "{{ activeTab }}" status will appear here.</p>
      <router-link to="/" class="btn btn-primary mt-2">Go Shopping</router-link>
    </div>

    <div v-else>
      <div v-for="order in filteredOrders" :key="order._id" class="order-card card shadow-sm mb-4 border-0">
        <div class="card-header bg-white d-flex justify-content-between align-items-center py-3">
          <div class="order-id">
            <span class="text-muted small">Order ID: </span>
            <span class="fw-bold small text-dark">{{ order._id }}</span>
          </div>
          <div class="order-status">
            <span class="status-label" :class="order.status?.toLowerCase() || 'pending'">
              {{ order.status || 'Pending' }}
            </span>
          </div>
        </div>
        
        <div class="card-body px-4">
          <div v-for="item in order.productOrdered" :key="item._id" class="product-row d-flex py-3 align-items-center">
            <div class="product-img-placeholder me-3">
              <i class="bi bi-laptop"></i>
            </div>
            <div class="flex-grow-1">
              <h6 class="product-name mb-1">{{ item.productId?.name || 'Product Name' }}</h6>
              <div class="text-muted small">Quantity: x{{ item.quantity }}</div>
            </div>
            <div class="text-end">
              <div class="product-price">₱ {{ item.subtotal?.toLocaleString() }}</div>
            </div>
          </div>
          
          <div class="order-footer border-top mt-2 pt-3">
            <div class="d-flex justify-content-between align-items-center">
              <div class="total-label text-muted">Order Total:</div>
              <div class="total-amount">₱ {{ order.totalPrice.toLocaleString() }}</div>
            </div>
            
            <div class="d-flex justify-content-end mt-3" v-if="activeTab === 'Pending'">
              <button 
                @click="handleCancelOrder(order._id)" 
                class="btn btn-outline-danger btn-sm px-4"
              >
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';

const orders = ref([]);
const loading = ref(true);
const activeTab = ref('Pending'); // Default tab

const tabOptions = ['Pending', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];

// Logic to filter orders based on active tab
const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    const status = order.status || 'Pending';
    
    // Mapping tabs to your backend status strings
    if (activeTab.value === 'Cancelled') return status === 'Cancelled';
    if (activeTab.value === 'Completed') return status === 'Completed';
    return status === activeTab.value;
  });
});

const fetchOrders = async () => {
  loading.value = true;
  try {
    const res = await api.get('/orders/my-orders');
    orders.value = res.data.orders || [];
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleCancelOrder = async (id) => {
  if (!confirm("Cancel this order?")) return;
  try {
    await api.patch(`/orders/${id}/cancel`);
    fetchOrders(); // Refresh all orders to see status change
  } catch (err) {
    alert("Cancellation failed");
  }
};

onMounted(fetchOrders);
</script>

<style scoped>
/* Background and Container */
.container {
  max-width: 850px;
  min-height: 90vh;
}

h2 {
  font-weight: 800;
  color: #333;
  text-transform: uppercase;
  font-size: 1.5rem;
}

/* Tab Bar Styling */
.tabs-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.nav-tabs {
  border-bottom: none;
}

.nav-link {
  border: none;
  border-bottom: 3px solid transparent;
  color: #555;
  padding: 1rem 0;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 0;
}

.nav-link:hover {
  color: #0d6efd;
}

.nav-link.active {
  color: #0d6efd !important;
  border-bottom: 3px solid #0d6efd !important;
  background: transparent !important;
}

/* Order Card Styling */
.order-card {
  border-radius: 4px;
}

.status-label {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 4px;
  background: #eef2f7;
  color: #0d6efd;
  text-transform: uppercase;
}

.status-label.cancelled {
  color: #dc3545;
  background: #fff5f5;
}

.status-label.completed {
  color: #198754;
  background: #f0fff4;
}

/* Product Row Styling */
.product-row {
  border-bottom: 1px solid #f8f9fa;
}

.product-row:last-child {
  border-bottom: none;
}

.product-img-placeholder {
  width: 60px;
  height: 60px;
  background: #f1f3f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: #adb5bd;
}

.product-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: #333;
}

.product-price {
  font-weight: 700;
  color: #444;
}

/* Footer Styling */
.total-amount {
  font-size: 1.25rem;
  font-weight: 800;
  color: #3b3b3b; /* E-commerce gray-color price color */
}

/* Empty State Styling */
.empty-state i {
  font-size: 4rem;
  color: #dee2e6;
}

.btn-primary {
  background-color: #0d6efd;
  border: none;
  font-weight: 600;
}
</style>