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

            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label fw-bold">Product Images (Max 30)</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-images"></i></span>
                  <input type="file" @change="handleImageUpload" class="form-control" accept="image/*" multiple required>
                </div>
                <div class="form-text mt-1 text-primary">Selected: {{ imageFiles.length }} images</div>
              </div>

              <div class="col-md-6">
                <label class="form-label fw-bold">Product Video (Optional)</label>
                <div class="input-group">
                  <span class="input-group-text"><i class="bi bi-play-video"></i></span>
                  <input type="file" @change="handleVideoUpload" class="form-control" accept="video/*">
                </div>
              </div>
            </div>
          </div>
          
          <div class="modal-footer bg-light">
            <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal" id="closeModalBtn">Cancel</button>
            <button type="submit" class="btn btn-primary px-4" :disabled="isSubmitting">
              <span v-if="isSubmitting" class="spinner-border spinner-border-sm me-2"></span>
              {{ isSubmitting ? 'Uploading...' : 'Save Laptop Product' }}
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
const imageFiles = ref([]);
const videoFile = ref(null);

const formData = reactive({
  name: '',
  description: '',
  price: null,
  stocks: 0
});

const handleImageUpload = (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 30) {
    alert("You can only upload a maximum of 30 images.");
    event.target.value = ""; 
    imageFiles.value = [];
    return;
  }
  imageFiles.value = files;
};

const handleVideoUpload = (event) => {
  videoFile.value = event.target.files[0];
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  
  const data = new FormData();
  data.append('name', formData.name);
  data.append('description', formData.description);
  data.append('price', formData.price);
  data.append('stock', formData.stocks); // Matches typical backend schema 'stock'

  // CRITICAL: Ensure 'productImages' matches your backend Multer setup
  imageFiles.value.forEach((file) => {
    data.append('productImages', file); 
  });

  if (videoFile.value) {
    data.append('productVideo', videoFile.value);
  }

  try {
    // Note: The /products/ endpoint should handle both data and files
    await api.post('/products/', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // Success - Reset form
    Object.assign(formData, { name: '', description: '', price: null, stocks: 0 });
    imageFiles.value = [];
    videoFile.value = null;
    
    emit('productAdded'); // Refresh the list in the parent component
    
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