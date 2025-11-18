<template>
  <div class="error-message">
    <span>❌ {{ error }}</span>
    <button @click="emit('retry')" class="btn-retry">Повторить</button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  error: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<style scoped>
.error-message {
  padding: 20px;
  background: #ffebee;
  color: #c62828;
  border-radius: 8px;
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.btn-retry {
  padding: 8px 16px;
  background: #c62828;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-retry:hover {
  background: #b71c1c;
}
</style>
