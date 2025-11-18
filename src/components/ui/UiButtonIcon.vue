<template>
  <button
    :class="['btn-icon', variant && `btn-${variant}`]"
    :title="title"
    @click="emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
type ButtonIconVariant = 'success' | 'cancel' | 'danger'

const { variant, title } = defineProps<{
  variant?: ButtonIconVariant
  title?: string
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.btn-icon {
  padding: 6px 10px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f0f0f0;
  transform: scale(1.1);
}

.btn-success {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.btn-cancel {
  background: #ff9800;
  color: white;
  border-color: #ff9800;
}

.btn-danger {
  border-color: #f44336;
}

.btn-danger:hover {
  background: #f44336;
  color: white;
}
</style>
