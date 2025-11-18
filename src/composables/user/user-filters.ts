import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { User, UserRole, UserStatus } from '@/types/user'

export function useUserFilters(users: Ref<User[]>) {
  const searchQuery = ref('')
  const filterRole = ref<UserRole | ''>('')
  const filterStatus = ref<UserStatus | ''>('')
  const dateFrom = ref('')
  const dateTo = ref('')

  // Фильтрация по роли
  const roleFilteredUsers = computed(() => {
    if (!filterRole.value) {
      return users.value
    }
    return users.value.filter((user) => user.role === filterRole.value)
  })

  // Фильтрация по статусу
  const statusFilteredUsers = computed(() => {
    if (!filterStatus.value) {
      return roleFilteredUsers.value
    }
    return roleFilteredUsers.value.filter((user) => user.status === filterStatus.value)
  })

  // Фильтрация по датам
  const dateFilteredUsers = computed(() => {
    let filtered = statusFilteredUsers.value

    if (dateFrom.value) {
      const fromDate = new Date(dateFrom.value)
      filtered = filtered.filter((user) => {
        const userDate = new Date(user.registrationDate)
        return userDate >= fromDate
      })
    }

    if (dateTo.value) {
      const toDate = new Date(dateTo.value)
      toDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((user) => {
        const userDate = new Date(user.registrationDate)
        return userDate <= toDate
      })
    }

    return filtered
  })

  // Поиск
  const filteredUsers = computed(() => {
    if (!searchQuery.value.trim()) {
      return dateFilteredUsers.value
    }

    const query = searchQuery.value.toLowerCase().trim()
    return dateFilteredUsers.value.filter((user) => {
      return (
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.id.toString().includes(query)
      )
    })
  })

  function clearDateFilter() {
    dateFrom.value = ''
    dateTo.value = ''
  }

  function clearAllFilters() {
    searchQuery.value = ''
    filterRole.value = ''
    filterStatus.value = ''
    dateFrom.value = ''
    dateTo.value = ''
  }

  return {
    searchQuery,
    filterRole,
    filterStatus,
    dateFrom,
    dateTo,
    filteredUsers,
    clearDateFilter,
    clearAllFilters,
  }
}
