import { ref, computed } from 'vue'
import type { User } from '@/types/user'
import {
  getUsers,
  createUser,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
  deleteMultipleUsers as deleteMultipleUsersApi,
} from '@/api/user'

export function useUserData() {
  const users = ref<User[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadUsers() {
    isLoading.value = true
    error.value = null

    try {
      users.value = await getUsers()
    } catch (err) {
      error.value = 'Ошибка загрузки данных: ' + (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  // TODO: Обработка ошибок в последующих методах?
  async function addUser(user: User) {
    await createUser()
    users.value.unshift(user)
  }

  async function updateUser(userId: number, userData: Partial<User>) {
    await updateUserApi()

    const userIndex = users.value.findIndex((u) => u.id === userId)
    if (userIndex !== -1) {
      users.value[userIndex] = {
        ...users.value[userIndex],
        ...userData,
      } as User
    }
  }

  async function deleteUser(userId: number) {
    await deleteUserApi()

    const index = users.value.findIndex((u) => u.id === userId)
    if (index !== -1) {
      users.value.splice(index, 1)
    }
  }

  async function deleteMultipleUsers(userIds: number[]) {
    await deleteMultipleUsersApi()
    users.value = users.value.filter((user) => !userIds.includes(user.id))
  }

  function toggleUserStatus(userId: number) {
    const user = users.value.find((u) => u.id === userId)
    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active'
    }
  }

  const getNextUserId = computed(() => {
    if (users.value.length === 0) return 1
    return Math.max(...users.value.map((u) => u.id)) + 1
  })

  return {
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
  }
}
