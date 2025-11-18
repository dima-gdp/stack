<template>
  <div class="table-wrapper">
    <table class="user-table">
      <thead>
        <tr>
          <th>
            <input type="checkbox" :checked="isAllSelected" @change="emit('toggle-select-all')" />
          </th>
          <th
            @click="emit('sort', 'id')"
            class="sortable"
            :class="{ active: sortColumn === 'id' }"
            data-testid="table-header-id"
          >
            ID
            <span v-if="sortColumn === 'id'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th
            @click="emit('sort', 'name')"
            class="sortable"
            :class="{ active: sortColumn === 'name' }"
          >
            Имя
            <span v-if="sortColumn === 'name'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th
            @click="emit('sort', 'email')"
            class="sortable"
            :class="{ active: sortColumn === 'email' }"
          >
            Email
            <span v-if="sortColumn === 'email'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th>Роль</th>
          <th>Статус</th>
          <th
            @click="emit('sort', 'registrationDate')"
            class="sortable"
            :class="{ active: sortColumn === 'registrationDate' }"
          >
            Дата регистрации
            <span v-if="sortColumn === 'registrationDate'">
              {{ sortDirection === 'asc' ? '↑' : '↓' }}
            </span>
          </th>
          <th>Последняя активность</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <TableRow
          v-for="user in paginatedUsers"
          :key="user.id"
          v-model:edit-form="editForm"
          :user="user"
          :is-selected="selectedUsers.includes(user.id)"
          :is-editing="editingUserId === user.id"
          @toggle-select="emit('toggle-select', $event)"
          @toggle-status="emit('toggle-status', $event)"
          @start-edit="emit('start-edit', $event)"
          @save-edit="emit('save-edit', $event)"
          @cancel-edit="emit('cancel-edit')"
          @view-details="emit('view-details', $event)"
          @delete-user="emit('delete-user', $event)"
        />
      </tbody>
    </table>

    <!-- Сообщение если нет данных -->
    <div v-if="paginatedUsers.length === 0" class="no-data">
      <p>😔 Нет данных для отображения</p>
      <UiButton @click="emit('clear-filters')" variant="primary">Сбросить фильтры</UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User, UserFormData, SortColumn, SortDirection } from '@/types/user'
import TableRow from './TableRow.vue'
import UiButton from '../ui/UiButton.vue'

const { paginatedUsers, selectedUsers, isAllSelected, editingUserId, sortColumn, sortDirection } =
  defineProps<{
    paginatedUsers: User[]
    selectedUsers: number[]
    isAllSelected: boolean
    editingUserId: number | null
    sortColumn: SortColumn
    sortDirection: SortDirection
  }>()

const editForm = defineModel<UserFormData>('editForm', { required: true })

const emit = defineEmits<{
  'toggle-select-all': []
  sort: [column: SortColumn]
  'toggle-select': [id: number]
  'toggle-status': [id: number]
  'start-edit': [user: User]
  'save-edit': [id: number]
  'cancel-edit': []
  'view-details': [user: User]
  'delete-user': [id: number]
  'clear-filters': []
}>()
</script>

<style scoped>
.table-wrapper {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-table {
  width: 100%;
  border-collapse: collapse;
}

.user-table thead {
  background: #f5f5f5;
  border-bottom: 2px solid #ddd;
}

.user-table th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

.user-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.user-table th.sortable:hover {
  background: #eeeeee;
}

.user-table th.active {
  color: #4caf50;
}

.no-data {
  padding: 40px;
  text-align: center;
  color: #666;
}

.no-data p {
  font-size: 18px;
  margin-bottom: 20px;
}
</style>
