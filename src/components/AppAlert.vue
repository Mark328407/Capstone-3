<template>
  <div v-if="message" :class="['alert', alertClass, 'alert-dismissible', 'fade', 'show', 'custom-alert']" role="alert">
    <i :class="['bi', iconClass, 'me-2']"></i>
    {{ message }}
    <button type="button" class="btn-close" @click="$emit('clear')"></button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success' // success, danger, warning, info
  }
});

defineEmits(['clear']);

const alertClass = computed(() => `alert-${props.type}`);
const iconClass = computed(() => {
  if (props.type === 'success') return 'bi-check-circle-fill';
  if (props.type === 'danger') return 'bi-exclamation-triangle-fill';
  return 'bi-info-circle-fill';
});
</script>

<style scoped>
.custom-alert {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 1060;
  min-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
</style>