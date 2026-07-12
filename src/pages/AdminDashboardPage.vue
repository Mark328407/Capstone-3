<template>
  <div class="container my-5">
    <div class="row g-3 mb-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-primary text-white p-3">
          <div class="small fw-bold">Total Products</div>
          <div class="h3 mb-0">{{ products.length }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-success text-white p-3">
          <div class="small fw-bold">Active Inventory</div>
          <div class="h3 mb-0">{{ products.filter(p => p.isActive).length }}</div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card border-0 shadow-sm bg-warning text-dark p-3">
          <div class="small fw-bold">Low Stock</div>
         
          <div class="h3 mb-0">{{ products.filter(p => (p.stock ?? 0) < 5).length }}</div>
        </div>
      </div>
    </div>

    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold mb-0">
        <i class="bi bi-box-seam me-2"></i>Inventory Management
      </h2>
      <button 
        class="btn btn-primary shadow-sm px-4" 
        data-bs-toggle="modal" 
        data-bs-target="#addProductModal"
      >
        <i class="bi bi-plus-lg me-2"></i>Add Laptop
      </button>
    </div>

    <div class="row mb-3">
      <div class="col-md-5">
        <div class="input-group shadow-sm">
          <span class="input-group-text bg-white border-end-0 text-muted">
            <i class="bi bi-search"></i>
          </span>
          <input 
            v-model="searchQuery" 
            type="text" 
            class="form-control border-start-0" 
            placeholder="Search laptop models..."
          >
        </div>
      </div>
    </div>

    <div v-if="alert.message" :class="['alert', `alert-${alert.type}`, 'alert-dismissible', 'fade', 'show shadow-sm']">
      {{ alert.message }}
      <button type="button" class="btn-close" @click="alert.message = ''"></button>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2">Updating laptop collection...</p>
    </div>

    <AdminProductTable 
      v-else
      :products="filteredProducts" 
      @toggle-status="handleToggleStatus" 
      @edit="handleEditClick" 
    />

    <AddProductModal @productAdded="onProductAdded" />

    
    <div v-if="editModal.show" class="modal d-block" style="background: rgba(0,0,0,0.5);" @click.self="editModal.show = false">
      <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content border-0 shadow">
          <div class="modal-header bg-dark text-white">
            <h5 class="modal-title"><i class="bi bi-pencil-square me-2"></i>Edit Product</h5>
            <button type="button" class="btn-close btn-close-white" @click="editModal.show = false"></button>
          </div>
          <form @submit.prevent="handleEditSubmit">
            <div class="modal-body p-4">
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <label class="form-label fw-bold">Product Name</label>
                  <input v-model="editForm.name" type="text" class="form-control" required>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-bold">Price (PHP)</label>
                  <div class="input-group">
                    <span class="input-group-text">₱</span>
                    <input v-model.number="editForm.price" type="number" class="form-control" required>
                  </div>
                </div>
                <div class="col-md-3">
                  <label class="form-label fw-bold">Stock</label>
                  <input v-model.number="editForm.stock" type="number" class="form-control" min="0">
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Description</label>
                <textarea v-model="editForm.description" class="form-control" rows="4" required></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label fw-bold">Image URL</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-image"></i></span>
                  <input
                    v-model="editForm.image"
                    type="url"
                    class="form-control"
                    placeholder="https://example.com/laptop-photo.jpg"
                  >
                </div>
                <div class="form-text">
                  Paste a direct link to an image. Leave blank to use a placeholder.
                </div>
              </div>
              <div v-if="editForm.image" class="mb-2">
                <label class="form-label fw-bold small text-muted text-uppercase">Preview</label>
                <div class="border rounded p-2 bg-light" style="max-width: 220px;">
                  <img
                    :src="editForm.image"
                    class="img-fluid rounded"
                    alt="Preview"
                    @error="editImagePreviewFailed = true"
                    @load="editImagePreviewFailed = false"
                    style="max-height: 150px; object-fit: contain; width: 100%;"
                  >
                  <p v-if="editImagePreviewFailed" class="text-danger small mb-0 mt-1">
                    <i class="bi bi-exclamation-triangle me-1"></i>Couldn't load this image — check the URL.
                  </p>
                </div>
              </div>
            </div>
            <div class="modal-footer bg-light">
              <button type="button" class="btn btn-outline-secondary" @click="editModal.show = false">Cancel</button>
              <button type="submit" class="btn btn-primary px-4" :disabled="editModal.isSubmitting">
                <span v-if="editModal.isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
                {{ editModal.isSubmitting ? 'Saving...' : 'Save Changes' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import api from '../services/api';
import AdminProductTable from '../components/AdminProductTable.vue';
import AddProductModal from '../components/AddProductModal.vue';

const products = ref([]);
const isLoading = ref(true);
const searchQuery = ref('');
const alert = reactive({ message: '', type: 'success' });


const editModal = reactive({ show: false, isSubmitting: false });
const editForm = reactive({ id: '', name: '', description: '', price: 0, stock: 0, image: '' });
const editImagePreviewFailed = ref(false);

const filteredProducts = computed(() => {
  if (!searchQuery.value) return products.value;
  return products.value.filter(p => 
    p.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const fetchInventory = async () => {
  isLoading.value = true;
  try {
    const response = await api.get('/products/all');
    products.value = response.data.products || response.data || [];
  } catch (error) {
    showAlert("Network error: Could not load inventory.", "danger");
  } finally {
    isLoading.value = false;
  }
};


const handleToggleStatus = async (id) => {
  try {
    const product = products.value.find(p => p._id === id);
    if (!product) return;

    const endpoint = product.isActive 
      ? `/products/${id}/archive` 
      : `/products/${id}/activate`;
    
    await api.patch(endpoint);
    showAlert(`Laptop successfully ${product.isActive ? 'archived' : 'activated'}!`, "success");
    fetchInventory();
  } catch (error) {
    showAlert("Failed to update laptop status.", "danger");
  }
};


const handleEditClick = (product) => {
  editForm.id = product._id;
  editForm.name = product.name;
  editForm.description = product.description;
  editForm.price = product.price;
  editForm.stock = product.stock ?? 0;
  editForm.image = product.image ?? '';
  editImagePreviewFailed.value = false;
  editModal.show = true;
};


const handleEditSubmit = async () => {
  editModal.isSubmitting = true;
  try {
    await api.patch(`/products/${editForm.id}/update`, {
      name: editForm.name,
      description: editForm.description,
      price: editForm.price,
      image: editForm.image
    });
    editModal.show = false;
    showAlert("Product updated successfully!", "success");
    fetchInventory();
  } catch (error) {
    showAlert("Failed to update product.", "danger");
  } finally {
    editModal.isSubmitting = false;
  }
};

const onProductAdded = () => {
  showAlert("New laptop added to catalog!", "success");
  fetchInventory();
};

const showAlert = (msg, type) => {
  alert.message = msg;
  alert.type = type;
  setTimeout(() => { alert.message = ''; }, 3000);
};

onMounted(fetchInventory);
</script>

<style scoped>
.container {
  min-height: 80vh;
}
</style>