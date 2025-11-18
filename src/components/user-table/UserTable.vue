<template>
  <div class="user-table-container">
    <!-- Хедер с действиями -->
    <TableHeader
      v-model:search-query="searchQuery"
      v-model:filter-role="filterRole"
      :title="title"
      :total-count="filteredUsers.length"
      :selected-count="selectedUsers.length"
      :is-loading="isLoading"
      @add-user="openAddUserModal"
      @export="exportToCSV"
      @delete-selected="deleteSelectedUsers"
    />

    <!-- Фильтры -->
    <TableFilters
      v-model:filter-status="filterStatus"
      v-model:date-from="dateFrom"
      v-model:date-to="dateTo"
      @clear-date="clearDateFilter"
    />

    <!-- Загрузка -->
    <LoadingOverlay v-if="isLoading" />

    <!-- Ошибка -->
    <ErrorMessage v-if="error" :error="error" @retry="loadUsers" />

    <!-- Таблица -->
    <TableUsers
      v-if="!isLoading && !error"
      :paginated-users="paginatedUsers"
      :selected-users="selectedUsers"
      :is-all-selected="isAllSelected"
      :editing-user-id="editingUserId"
      v-model:edit-form="editForm"
      :sort-column="sortColumn"
      :sort-direction="sortDirection"
      @toggle-select-all="toggleSelectAll"
      @sort="sortBy"
      @toggle-select="toggleSelectUser"
      @toggle-status="toggleUserStatus"
      @start-edit="startEdit"
      @save-edit="saveEdit"
      @cancel-edit="cancelEdit"
      @view-details="openUserDetails"
      @delete-user="onDeleteUser"
      @clear-filters="clearAllFilters"
    />

    <!-- Пагинация -->
    <TablePagination
      v-if="!isLoading"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :total-pages="totalPages"
      :total-count="filteredUsers.length"
      :pagination-start="paginationStart"
      :pagination-end="paginationEnd"
      :visible-pages="visiblePages"
    />

    <!-- Модальное окно добавления пользователя -->
    <UserAddModal
      v-if="showAddUserModal"
      v-model:new-user="newUser"
      :errors="newUserErrors"
      :is-valid="isNewUserValid"
      :is-saving="isSavingNewUser"
      @click.self="closeAddUserModal"
      @close="closeAddUserModal"
      @submit="addNewUser"
    />

    <!-- Модальное окно просмотра пользователя -->
    <UserDetailsModal
      v-if="showDetailsModal && selectedUser"
      :user="selectedUser"
      @close="closeDetailsModal"
      @click.self="closeDetailsModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineAsyncComponent, watch } from 'vue'
import { useUserData } from '@/composables/user/user-data.ts'
import { useUserFilters } from '@/composables/user/user-filters.ts'
import { useUserSorting } from '@/composables/user/user-sorting.ts'
import { useUserPagination } from '@/composables/user/user-pagination.ts'
import { useUserSelection } from '@/composables/user/user-selection.ts'
import { useUserEdit } from '@/composables/user/user-edit.ts'
import { useUserAddModal } from '@/composables/user/user-add-modal.ts'
import { useUserDetailsModal } from '@/composables/user/user-details-modal.ts'
import { prepareUsersForCSV, getNewUser } from '@/utils/user.ts'
import { downloadCSV } from '@/utils/export.ts'
import TableHeader from './TableHeader.vue'
import TableFilters from './TableFilters.vue'
import LoadingOverlay from './LoadingOverlay.vue'
import ErrorMessage from './ErrorMessage.vue'
import TableUsers from './TableUsers.vue'
import TablePagination from './TablePagination.vue'
import { INITIAL_PAGE_SIZE } from '@/constants/user.ts'

// Ленивая загрузка модальных окон
const UserAddModal = defineAsyncComponent(() => import('../user/UserAddModal.vue'))
const UserDetailsModal = defineAsyncComponent(() => import('../user/UserDetailsModal.vue'))

const {
  title = 'Управление пользователями',
  initialPageSize = INITIAL_PAGE_SIZE,
  // TODO: не используется
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  apiEndpoint = '/api/users',
} = defineProps<{
  title?: string
  initialPageSize?: number
  apiEndpoint?: string
}>()

const {
  users,
  isLoading,
  error,
  loadUsers,
  addUser,
  updateUser,
  deleteUser,
  deleteMultipleUsers,
  toggleUserStatus,
  getNextUserId,
} = useUserData()

const {
  searchQuery,
  filterRole,
  filterStatus,
  dateFrom,
  dateTo,
  filteredUsers,
  clearDateFilter,
  clearAllFilters,
} = useUserFilters(users)

const { sortColumn, sortDirection, sortedUsers, sortBy } = useUserSorting(filteredUsers)

const {
  currentPage,
  pageSize,
  totalPages,
  paginationStart,
  paginationEnd,
  paginatedUsers,
  visiblePages,
  resetCurrentPage,
} = useUserPagination(sortedUsers, initialPageSize)

const {
  selectedUsers,
  isAllSelected,
  toggleSelectUser,
  toggleSelectAll,
  clearSelection,
  removeFromSelection,
} = useUserSelection(paginatedUsers)

const { editingUserId, editForm, startEdit, cancelEdit } = useUserEdit()

const {
  showAddUserModal,
  newUser,
  newUserErrors,
  isNewUserValid,
  openAddUserModal,
  closeAddUserModal,
  validateNewUserName,
  validateNewUserEmail,
} = useUserAddModal(users)

const { showDetailsModal, selectedUser, openUserDetails, closeDetailsModal } = useUserDetailsModal()

const isSavingEdit = ref(false)
const isSavingNewUser = ref(false)

// Watchers для сброса страницы при изменении фильтров
watch([searchQuery, filterRole, filterStatus, dateFrom, dateTo], () => {
  resetCurrentPage()
})

async function saveEdit(userId: number) {
  isSavingEdit.value = true
  try {
    await updateUser(userId, editForm.value)
    cancelEdit()
  } catch (err) {
    alert('Ошибка сохранения: ' + (err as Error).message)
  } finally {
    isSavingEdit.value = false
  }
}

async function onDeleteUser(userId: number) {
  if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) {
    return
  }
  try {
    await deleteUser(userId)
    removeFromSelection(userId)
  } catch (err) {
    alert('Ошибка удаления: ' + (err as Error).message)
  }
}

async function deleteSelectedUsers() {
  if (!confirm(`Вы уверены, что хотите удалить ${selectedUsers.value.length} пользователей?`)) {
    return
  }
  try {
    await deleteMultipleUsers(selectedUsers.value)
    clearSelection()
  } catch (err) {
    alert('Ошибка удаления: ' + (err as Error).message)
  }
}

// Modal methods
async function addNewUser() {
  validateNewUserName()
  validateNewUserEmail()

  if (!isNewUserValid.value) {
    return
  }

  isSavingNewUser.value = true
  try {
    const user = getNewUser({
      id: getNextUserId.value,
      name: newUser.value.name,
      email: newUser.value.email,
      role: newUser.value.role,
    })

    await addUser(user)
    closeAddUserModal()
  } catch (err) {
    alert('Ошибка создания пользователя: ' + (err as Error).message)
  } finally {
    isSavingNewUser.value = false
  }
}

// Export
function exportToCSV() {
  const usersToExport =
    selectedUsers.value.length > 0
      ? users.value.filter((u) => selectedUsers.value.includes(u.id))
      : sortedUsers.value

  const csvContent = prepareUsersForCSV(usersToExport)
  const filename = `users_export_${new Date().getTime()}.csv`
  downloadCSV(csvContent, filename)
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.user-table-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}
</style>
