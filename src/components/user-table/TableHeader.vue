<template>
  <div class="table-header">
    <div class="header-left">
      <h2>{{ title }}</h2>
      <span class="total-count">{{ totalCount }} записей</span>
    </div>

    <div class="header-right">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по имени, email..."
        class="search-input"
      />

      <FilterRoleSelect v-model="filterRole" />

      <UiButton variant="primary" :disabled="isLoading" @click="emit('add-user')">
        + Добавить пользователя
      </UiButton>

      <UiButton
        variant="secondary"
        :disabled="isLoading || (selectedCount === 0 && !showAllUsers)"
        @click="emit('export')"
      >
        📥 Экспорт
      </UiButton>

      <UiButton v-if="selectedCount > 0" @click="emit('delete-selected')" variant="danger">
        🗑️ Удалить выбранные ({{ selectedCount }})
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { UserRole } from '@/types/user'
import FilterRoleSelect from './filter/FilterRoleSelect.vue'
import UiButton from '../ui/UiButton.vue'

const searchQuery = defineModel<string>('searchQuery', { default: '' })
const filterRole = defineModel<UserRole | ''>('filterRole', { default: '' })

defineProps<{
  title: string
  totalCount: number
  selectedCount: number
  isLoading: boolean
  showAllUsers?: boolean
}>()

const emit = defineEmits<{
  'add-user': []
  export: []
  'delete-selected': []
}>()
</script>

<style scoped>
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header-left h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.total-count {
  color: #666;
  font-size: 14px;
}

.header-right {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 250px;
  font-size: 14px;
}

.search-input:focus {
  outline: none;
  border-color: #4caf50;
}
</style>
