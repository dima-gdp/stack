import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { User, SortColumn, SortDirection } from '@/types/user'

export function useUserSorting(users: Ref<User[]>) {
  const sortColumn = ref<SortColumn>('id')
  const sortDirection = ref<SortDirection>('asc')

  const sortedUsers = computed(() => {
    const usersList = [...users.value]

    usersList.sort((a, b) => {
      let aVal = a[sortColumn.value]
      let bVal = b[sortColumn.value]

      if (sortColumn.value === 'registrationDate' || sortColumn.value === 'lastActivity') {
        aVal = new Date(aVal).getTime()
        bVal = new Date(bVal).getTime()
      } else if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase()
        bVal = bVal.toLowerCase()
      }

      if (aVal < bVal) {
        return sortDirection.value === 'asc' ? -1 : 1
      }
      if (aVal > bVal) {
        return sortDirection.value === 'asc' ? 1 : -1
      }
      return 0
    })

    return usersList
  })

  function sortBy(column: SortColumn) {
    if (sortColumn.value === column) {
      sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
    } else {
      sortColumn.value = column
      sortDirection.value = 'asc'
    }
  }

  return {
    sortColumn,
    sortDirection,
    sortedUsers,
    sortBy,
  }
}
