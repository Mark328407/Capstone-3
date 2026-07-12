<template>
  <div class="table-responsive shadow-sm rounded border">
    <table class="table table-hover align-middle mb-0 bg-white">
      <thead class="table-light">
        <tr>
          <th class="ps-4">Product & Brand</th>
          <th>Price</th>
          <th>Status</th>
          <th class="text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="laptop in products" :key="laptop._id">
          <td class="ps-4">
            <div class="d-flex flex-column">
              <span class="fw-bold text-dark">{{ laptop.name }}</span>
              <div class="d-flex align-items-center gap-2 mt-1">
                <span :class="[
                  'badge border', 
                  laptop.stock === 0 ? 'bg-danger-subtle text-danger border-danger' : 
                  laptop.stock < 5 ? 'bg-warning-subtle text-warning border-warning' : 
                  'bg-success-subtle text-success border-success'
                ]">
                  
                  {{ laptop.stock ?? 0 }} in stock
                </span>
                <small class="text-muted">ID: {{ laptop._id.substring(0, 8) }}</small>
              </div>
            </div>
          </td>
          
          <td>
            <span class="fw-semibold">₱{{ laptop.price.toLocaleString() }}</span>
          </td>

          <td>
            <span :class="['badge rounded-pill', laptop.isActive ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger']">
              {{ laptop.isActive ? 'Active' : 'Archived' }}
            </span>
          </td>

          <td class="text-center">
            <div class="btn-group gap-2">
              <button 
                @click="$emit('edit', laptop)" 
                class="btn btn-sm btn-outline-primary rounded shadow-sm"
                title="Edit Product"
              >
                <i class="bi bi-pencil-square"></i>
              </button>

              <button 
                @click="$emit('toggle-status', laptop._id)" 
                :class="['btn btn-sm rounded shadow-sm', laptop.isActive ? 'btn-outline-danger' : 'btn-outline-success']"
                :title="laptop.isActive ? 'Archive Product' : 'Activate Product'"
              >
                <i :class="['bi', laptop.isActive ? 'bi-archive' : 'bi-check-circle']"></i>
              </button>

              <button 
                @click="$emit('delete', laptop)" 
                class="btn btn-sm btn-outline-danger rounded shadow-sm"
                title="Delete Permanently"
              >
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </td>
        </tr>

        <tr v-if="products.length === 0">
          <td colspan="4" class="text-center py-5 text-muted">
            <i class="bi bi-inbox fs-2 d-block mb-2"></i>
            No products found in the inventory.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  products: {
    type: Array,
    required: true
  }
});

defineEmits(['edit', 'toggle-status', 'delete']);
</script>

<style scoped>
.table thead th {
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 700;
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.badge {
  font-weight: 600;
  font-size: 0.75rem;
}

.btn-group .btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  transition: all 0.2s ease;
}

.btn-group .btn:hover {
  transform: translateY(-1px);
}
</style>