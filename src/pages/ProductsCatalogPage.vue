<template>
  <div class="container my-5">
    <div class="row mb-4">
      <div class="col-12 text-center">
        <h2 class="display-5 fw-bold text-dark">Premium Laptops</h2>
        <p class="lead text-muted">Explore our high-performance collection for work and play.</p>
        <hr class="w-25 mx-auto border-primary border-2 opacity-75">
      </div>
    </div>

    <div class="row">
      <aside class="col-lg-3 mb-4">
        <div class="card border-0 shadow-sm sticky-top" style="top: 100px;">
          <div class="card-body p-4">
            <h5 class="fw-bold mb-4"><i class="bi bi-filter-left me-2"></i>Filters</h5>
            <div class="mb-4">
              <label class="form-label fw-semibold small text-uppercase text-muted">Brand</label>
              <select v-model="filters.brand" class="form-select border-light bg-light">
                <option value="">All Brands</option>
                <option v-for="brand in uniqueBrands" :key="brand" :value="brand">
                  {{ brand }}
                </option>
              </select>
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold small text-uppercase text-muted">Price Range</label>
              <div class="d-flex align-items-center gap-2 mb-2">
                <input v-model.number="filters.minPrice" type="number" class="form-control form-control-sm" placeholder="Min">
                <span class="text-muted">-</span>
                <input v-model.number="filters.maxPrice" type="number" class="form-control form-control-sm" placeholder="Max">
              </div>
              <div class="d-grid mt-2">
                <button @click="clearPrice" class="btn btn-link btn-sm text-decoration-none p-0 text-start">Clear Price</button>
              </div>
            </div>

            <div class="mb-4">
              <label class="form-label fw-semibold small text-uppercase text-muted">Sort By</label>
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="filters.sort" value="low" id="sortLow">
                <label class="form-check-label small" for="sortLow">Lowest Price</label>
              </div>
              <div class="form-check">
                <input class="form-check-input" type="radio" v-model="filters.sort" value="high" id="sortHigh">
                <label class="form-check-label small" for="sortHigh">Highest Price</label>
              </div>
            </div>

            <button @click="resetFilters" class="btn btn-outline-primary btn-sm w-100 mt-2">
              Reset All
            </button>
          </div>
        </div>
      </aside>

      <main class="col-lg-9">
        <div v-if="isLoading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading laptops...</span>
          </div>
        </div>

        <div v-else>
          <div class="row g-4">
            <div v-for="laptop in filteredProducts" :key="laptop._id" class="col-12 col-md-6 col-xl-4">
              <ProductCard :product="laptop" />
            </div>

            <div v-if="filteredProducts.length === 0" class="col-12 text-center py-5">
              <i class="bi bi-search text-muted" style="font-size: 3rem;"></i>
              <h4 class="mt-3 text-muted">No matches found.</h4>
              <p>Try adjusting your filters or search query.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { getActiveProducts } from '../services/api';

const products = ref([]);
const isLoading = ref(true);

// Reactive filters object
const filters = reactive({
  brand: '',
  minPrice: null,
  maxPrice: null,
  sort: ''
});

// Get unique brands for the dropdown automatically from your product list
const uniqueBrands = computed(() => {
  const brands = products.value.map(p => p.name.split(' ')[0]); // Assuming name starts with brand like "Dell XPS"
  return [...new Set(brands)].sort();
});

// FILTERING LOGIC
const filteredProducts = computed(() => {
  let list = [...products.value];

  // Filter by Brand
  if (filters.brand) {
    list = list.filter(p => p.name.toLowerCase().includes(filters.brand.toLowerCase()));
  }

  // Filter by Min Price
  if (filters.minPrice !== null && filters.minPrice !== '') {
    list = list.filter(p => p.price >= filters.minPrice);
  }

  // Filter by Max Price
  if (filters.maxPrice !== null && filters.maxPrice !== '') {
    list = list.filter(p => p.price <= filters.maxPrice);
  }

  // Sorting
  if (filters.sort === 'low') {
    list.sort((a, b) => a.price - b.price);
  } else if (filters.sort === 'high') {
    list.sort((a, b) => b.price - a.price);
  }

  return list;
});

const clearPrice = () => {
  filters.minPrice = null;
  filters.maxPrice = null;
};

const resetFilters = () => {
  filters.brand = '';
  filters.minPrice = null;
  filters.maxPrice = null;
  filters.sort = '';
};

const fetchLaptops = async () => {
  isLoading.value = true;
  try {
    const response = await getActiveProducts();
    const data = response.data.products || response.data;
    
    // Map through products to ensure a working placeholder image exists
    products.value = data.map(product => ({
      ...product,
      // If image is missing or uses the broken placeholder, replace it
      image: product.image && !product.image.includes('placeholder.com') 
             ? product.image 
             : `https://placehold.jp/24/2563EB/ffffff/300x200.png?text=${encodeURIComponent(product.name)}`
    }));
  } catch (error) {
    console.error("Error loading products:", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchLaptops);
</script>

<style scoped>
.form-select, .form-control {
  font-size: 0.9rem;
}
.sticky-top {
  z-index: 1010; /* Ensures it stays below the Navbar */
}
</style>