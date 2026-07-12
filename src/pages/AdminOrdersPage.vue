<template>
  <div class="container-fluid py-5 px-lg-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-dark">
        <i class="bi bi-clipboard-check me-2 text-primary"></i>Admin Order Management
      </h2>
      <div class="badge bg-primary px-3 py-2 fs-6 shadow-sm">
        {{ orders.length }} Total Orders
      </div>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="mt-2 text-muted fw-bold">Fetching system orders...</p>
    </div>

    <div v-else-if="orders.length === 0" class="card shadow-sm border-0 text-center py-5">
      <div class="card-body">
        <i class="bi bi-inbox fs-1 text-muted"></i>
        <p class="text-muted mt-3">No orders have been placed yet.</p>
      </div>
    </div>

    <div v-else class="table-responsive shadow-sm rounded border bg-white">
      <table class="table table-hover align-middle mb-0">
        <thead class="table-dark">
          <tr>
            <th class="ps-4">Order ID</th>
            <th>Customer</th>
            <th>Items</th>
            <th>Total</th>
            <th>Status</th>
            <th class="text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td class="ps-4">
              <div class="fw-bold small text-primary">#{{ order._id.substring(18).toUpperCase() }}</div>
              <div class="text-muted extra-small">{{ formatDate(order.orderedOn) }}</div>
            </td>
            <td>
              <div class="fw-bold text-dark">
                {{ order.userId?.firstName }} {{ order.userId?.lastName }}
              </div>
              <div class="text-muted small">{{ order.userId?.email }}</div>
            </td>
            <td>
              <ul class="list-unstyled mb-0 small text-secondary">
                <li v-for="item in order.productOrdered" :key="item._id">
                  <i class="bi bi-dot"></i> {{ item.productId?.name || 'Unknown Product' }} (x{{ item.quantity }})
                </li>
              </ul>
            </td>
            <td>
              <span class="fw-bold text-success">₱{{ order.totalPrice?.toLocaleString() }}</span>
            </td>
            <td>
              <span :class="getStatusClass(order.status)">{{ order.status || 'Pending' }}</span>
            </td>
            <td class="text-center">
              <div v-if="order.status === 'Pending'">
                <button @click="updateStatus(order._id, 'To Ship')" class="btn btn-sm btn-outline-success">
                  Accept
                </button>
              </div>
              
              <div v-else-if="order.status === 'To Ship'">
                <button @click="updateStatus(order._id, 'Completed')" class="btn btn-sm btn-primary">
                  Mark Delivered
                </button>
              </div>

              <div v-else-if="order.status === 'Completed'">
                <span class="badge rounded-pill bg-light text-success border border-success">
                  Fulfilled
                </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';

const orders = ref([]);
const loading = ref(true);

const fetchAllOrders = async () => {
  loading.value = true;
  try {
    const res = await api.get('/orders/all-orders');
    
    // Safety check: handle { orders: [] } or a direct array []
    if (res.data && res.data.orders) {
      orders.value = res.data.orders; // Matches backend { orders }
    } else if (Array.isArray(res.data)) {
      orders.value = res.data;
    } else {
      orders.value = [];
    }
  } catch (err) {
    console.error("Admin Fetch Error:", err);
    orders.value = []; // Prevents the 0 Total Orders layout from crashing
  } finally {
    loading.value = false;
  }
};

// 2. Handle Status Update
const updateStatus = async (orderId, newStatus) => {
  try {
    await api.patch(`/orders/${orderId}/update-status`, { status: newStatus });
    alert(`Order updated to: ${newStatus}`);
    await fetchAllOrders(); // Refresh table data
  } catch (err) {
    console.error("Update error:", err);
    alert("Error updating order status.");
  }
};

// 3. UI Helpers
const getStatusClass = (status) => {
  const s = status?.toLowerCase() || 'pending';
  if (s === 'pending') return 'badge bg-warning text-dark';
  if (s === 'to ship') return 'badge bg-info text-dark';
  if (s === 'completed') return 'badge bg-success';
  if (s === 'cancelled') return 'badge bg-danger';
  return 'badge bg-secondary';
};

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  return new Date(dateStr).toLocaleDateString('en-PH', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit'
  });
};


onMounted(fetchAllOrders);
</script>
