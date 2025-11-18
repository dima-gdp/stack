<template>
  <div class="filters-section">
    <div class="filter-group">
      <label>Статус:</label>
      <FilterButton :active="filterStatus === ''" @click="emit('update:filterStatus', '')">
        Все
      </FilterButton>
      <FilterButton
        :active="filterStatus === 'active'"
        @click="emit('update:filterStatus', 'active')"
      >
        Активные
      </FilterButton>
      <FilterButton
        :active="filterStatus === 'inactive'"
        @click="emit('update:filterStatus', 'inactive')"
      >
        Неактивные
      </FilterButton>
    </div>

    <div class="filter-group">
      <label>Дата регистрации:</label>
      <input
        :value="dateFrom"
        @input="emit('update:dateFrom', ($event.target as HTMLInputElement).value)"
        type="date"
        class="date-input"
      />
      <span>-</span>
      <input
        :value="dateTo"
        @input="emit('update:dateTo', ($event.target as HTMLInputElement).value)"
        type="date"
        class="date-input"
      />
      <button @click="emit('clear-date')" class="btn-clear">Очистить</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import FilterButton from './filter/FilterButton.vue'

defineProps<{
  filterStatus: string
  dateFrom: string
  dateTo: string
}>()

const emit = defineEmits<{
  'update:filterStatus': [value: string]
  'update:dateFrom': [value: string]
  'update:dateTo': [value: string]
  'clear-date': []
}>()
</script>

<style scoped>
.filters-section {
  background: white;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.filter-group:last-child {
  margin-bottom: 0;
}

.filter-group label {
  font-weight: 500;
  color: #555;
  min-width: 150px;
}

.date-input {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.btn-clear {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.btn-clear:hover {
  background: #f0f0f0;
}
</style>
