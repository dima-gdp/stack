<template>
  <button :class="['filter-btn', { active }]" @click="emit('click', $event)">
    <slot />
  </button>
</template>

<script setup lang="ts">
const { active = false } = defineProps<{
  active?: boolean
}>()

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>

<style scoped>
.filter-btn {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.filter-btn:hover {
  background: #f0f0f0;
}

.filter-btn.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}
</style>
