<template>
  <select v-model="selectedRole">
    <option v-for="(value, key) in ROLE_NAMES" :key="key" :value="key">
      {{ value }}
    </option>
  </select>
</template>

<script setup lang="ts">
import type { UserRole } from '@/types/user'
import { ROLE_NAMES } from '@/constants/user'

const selectedRole = defineModel<UserRole>({ required: true })
</script>
