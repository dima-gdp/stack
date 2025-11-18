<template>
  <!--  тут должна быть кнопка-->
  <span
    :class="['status-badge', status === 'active' ? 'status-active' : 'status-inactive']"
    :style="clickable ? { cursor: 'pointer' } : undefined"
    @click="clickable && emit('click')"
  >
    {{ status === 'active' ? '✓ Активен' : '✗ Неактивен' }}
  </span>
</template>

<script setup lang="ts">
import type { UserStatus } from '@/types/user'

defineProps<{
  status: UserStatus
  clickable?: boolean
}>()

const emit = defineEmits<{
  click: []
}>()
</script>

<style scoped>
.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #e8f5e9;
  color: #2e7d32;
}

.status-inactive {
  background: #ffebee;
  color: #c62828;
}
</style>
