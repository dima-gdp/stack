<template>
  <select v-model="selectedRole" class="role-filter">
    <option value="">Все роли</option>
    <option v-for="(value, key) in ROLE_NAMES" :key="key" :value="key">
      {{ value }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { UserRole } from '@/types/user.ts'
import { ROLE_NAMES } from '@/constants/user.ts'

const selectedRole = defineModel<UserRole | ''>({ default: '' })
</script>

<style scoped>
.role-filter {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  outline: none;
}

.role-filter:focus {
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}
</style>
