<template>
  <div class="modal fade" id="addProductModal" tabindex="-1" aria-labelledby="addProductModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog modal-dialog-centered modal-lg"> 
      <div class="modal-content border-0 shadow">
        <div class="modal-header bg-dark text-white">
          <h5 class="modal-title" id="addProductModalLabel">
            <i class="bi bi-laptop me-2"></i>Add New Laptop
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        
        <form @submit.prevent="handleSubmit">
          <div class="modal-body p-4">
            <div class="row g-3 mb-4">
              <div class="col-md-6">
                <label class="form-label fw-bold">Laptop Model Name</label>
                <input v-model="formData.name" type="text" class="form-control" placeholder="e.g. HP EliteBook 840 G8" required>
              </div>
              
              <div class="col-md-3">
                <label class="form-label fw-bold">Price (PHP)</label>
                <div class="input-group">
                  <span class="input-group-text">₱</span>
                  <input v-model.number="formData.price" type="number" class="form-control" placeholder="0" required>
                </div>
              </div>

              <div class="col-md-3">
                <label class="form-label fw-bold">Stocks</label>
                <input v-model.number="formData.stocks" type="number" class="form-control" placeholder="0" min="0" required>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-bold">Technical Specifications</label>
              <textarea v-model="formData.description" class="form-control" rows="4" placeholder="Detailed specs: CPU, RAM, SSD, Display..." required></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label fw-bold">Image URL</label>
              <div class="input-group">
                <span class="input-group-text"><i class="bi bi-image"></i></span>
                <input
                  v-model="formData.image"
                  type="url"
                  class="form-control"
                  placeholder="https://example.com/laptop-photo.jpg"
                >
              </div>
              <div class="form-text">
                Paste a direct link to an image (e.g. from an image hosting site). Leave blank to use a placeholder.
              </div>
            </div>

            <div v-if="formData.image" class="mb-2">
              <label class="form-label fw-bold small text-muted text-uppercase">Preview</label>
              <div class="border rounded p-2 bg-light" style="max-width: 220px;">
                <img
                  :src="formData.image"
                  class="img-fluid rounded"
                  alt="Preview"
                  @error="imagePreviewFailed = true"
                  @load="imagePreviewFailed = false"
                  style="max-height: 150px; object-fit: contain; width: 100%;"
                >
                <p v-if="imagePreviewFailed" class="text-danger small mb-0 mt-1">
                  <i class="bi bi-exclamation-triangle me-1"></i>Couldn't load this image — check the URL.
                </p>
              </div>
            </div>
          </div>
          
          <div class="modal-footer bg-light">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" id="closeModalBtn">Cancel</button>
            <button type="submit" class="btn btn-primary px-4" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Saving...' : 'Save Laptop Product' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import api from '../services/api';

const emit = defineEmits(['productAdded']);
const isSubmitting = ref(false);
const imagePreviewFailed = ref(false);

const formData = reactive({
  name: '',
  description: '',
  price: null,
  stocks: 0,
  image: ''
});

const handleSubmit = async () => {
  isSubmitting.value = true;

  try {
    await api.post('/products/', {
      name: formData.name,
      description: formData.description,
      price: formData.price,
      stock: formData.stocks,
      image: formData.image
    });

    // Success - Reset form
    Object.assign(formData, { name: '', description: '', price: null, stocks: 0, image: '' });

    emit('productAdded'); 

    document.getElementById('closeModalBtn').click();
    alert('Laptop added successfully to the collection!');
  } catch (error) {
    console.error("Submission Error:", error);
    const errorMsg = error.response?.data?.message || 'Check terminal for server-side errors.';
    alert(`Failed to add product: ${errorMsg}`);
  } finally {
    isSubmitting.value = false;
  }
};
</script>