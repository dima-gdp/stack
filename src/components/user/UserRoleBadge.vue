<template>
  <span :class="['role-badge', 'role-' + role]">
    {{ getRoleLabel(role) }}
  </span>
</template>

<script setup lang="ts">
import type { UserRole } from '@/types/user'
import { getRoleLabel } from '@/utils/user'

defineProps<{
  role: UserRole
}>()
</script>

<style scoped>
.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.role-admin {
  background: #ffebee;
  color: #c62828;
}

.role-user {
  background: #e3f2fd;
  color: #1565c0;
}

.role-moderator {
  background: #fff3e0;
  color: #e65100;
}
</style>
