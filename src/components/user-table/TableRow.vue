<template>
  <tr
    :class="{
      selected: isSelected,
      editing: isEditing,
      inactive: user.status === 'inactive',
    }"
    data-testid="user-row"
  >
    <td>
      <input type="checkbox" :checked="isSelected" @change="emit('toggle-select', user.id)" />
    </td>
    <td>{{ user.id }}</td>
    <td>
      <div v-if="isEditing">
        <input v-model="editForm.name" type="text" class="edit-input" />
      </div>
      <div v-else class="user-name-cell">
        <UserAvatar :avatar="user.avatar" :name="user.name" />
        <span>{{ user.name }}</span>
      </div>
    </td>
    <td>
      <div v-if="isEditing">
        <input v-model="editForm.email" type="email" class="edit-input" />
      </div>
      <div v-else>{{ user.email }}</div>
    </td>
    <td>
      <div v-if="isEditing">
        <UserRoleSelect v-model="editForm.role" class="edit-select" />
      </div>
      <div v-else>
        <UserRoleBadge :role="user.role" />
      </div>
    </td>
    <td>
      <UserStatusBadge :status="user.status" clickable @click="emit('toggle-status', user.id)" />
    </td>
    <td>{{ formattedRegistrationDate }}</td>
    <td>
      <span :class="activityClass">
        {{ formattedLastActivity }}
      </span>
    </td>
    <td>
      <div class="action-buttons">
        <UiButtonIcon v-if="!isEditing" @click="emit('start-edit', user)" title="Редактировать">
          ✏️
        </UiButtonIcon>
        <UiButtonIcon
          v-if="isEditing"
          @click="emit('save-edit', user.id)"
          variant="success"
          title="Сохранить"
        >
          ✓
        </UiButtonIcon>
        <UiButtonIcon v-if="isEditing" @click="emit('cancel-edit')" variant="cancel" title="Отмена">
          ✗
        </UiButtonIcon>
        <UiButtonIcon v-if="!isEditing" @click="emit('view-details', user)" title="Подробнее">
          👁️
        </UiButtonIcon>
        <UiButtonIcon
          v-if="!isEditing"
          @click="emit('delete-user', user.id)"
          variant="danger"
          title="Удалить"
        >
          🗑️
        </UiButtonIcon>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User, UserFormData } from '@/types/user'
import { formatDate, formatRelativeTime, getActivityClass } from '@/utils/date'
import UserAvatar from '../user/UserAvatar.vue'
import UserRoleBadge from '../user/UserRoleBadge.vue'
import UserRoleSelect from '../user/UserRoleSelect.vue'
import UserStatusBadge from '../user/UserStatusBadge.vue'
import UiButtonIcon from '../ui/UiButtonIcon.vue'

const { user, isSelected, isEditing } = defineProps<{
  user: User
  isSelected: boolean
  isEditing: boolean
}>()

const editForm = defineModel<UserFormData>('editForm', { required: true })

const emit = defineEmits<{
  'toggle-select': [id: number]
  'toggle-status': [id: number]
  'start-edit': [user: User]
  'save-edit': [id: number]
  'cancel-edit': []
  'view-details': [user: User]
  'delete-user': [id: number]
}>()

const formattedRegistrationDate = computed(() => formatDate(user.registrationDate))
const formattedLastActivity = computed(() => formatRelativeTime(user.lastActivity))
const activityClass = computed(() => getActivityClass(user.lastActivity))
</script>

<style scoped>
tr {
  transition: background 0.2s;
}

tr:hover {
  background: #fafafa;
}

tr.selected {
  background: #e8f5e9;
}

tr.editing {
  background: #fff9c4;
}

tr.inactive {
  opacity: 0.6;
}

td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.user-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.activity-recent {
  color: #2e7d32;
  font-weight: 500;
}

.activity-week {
  color: #1565c0;
}

.activity-month {
  color: #e65100;
}

.activity-old {
  color: #757575;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.edit-input,
.edit-select {
  padding: 6px 10px;
  border: 1px solid #4caf50;
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
}
</style>
