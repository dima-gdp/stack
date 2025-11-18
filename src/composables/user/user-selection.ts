import { ref, computed } from 'vue'
import type { Ref } from 'vue'
import type { User } from '@/types/user'

export function useUserSelection(paginatedUsers: Ref<User[]>) {
  const selectedUsers = ref<number[]>([])

  const isAllSelected = computed(() => {
    return (
      paginatedUsers.value.length > 0 &&
      paginatedUsers.value.every((user) => selectedUsers.value.includes(user.id))
    )
  })

  function toggleSelectUser(userId: number) {
    const index = selectedUsers.value.indexOf(userId)
    if (index > -1) {
      selectedUsers.value.splice(index, 1)
    } else {
      selectedUsers.value.push(userId)
    }
  }

  function toggleSelectAll() {
    if (isAllSelected.value) {
      paginatedUsers.value.forEach((user) => {
        const index = selectedUsers.value.indexOf(user.id)
        if (index > -1) {
          selectedUsers.value.splice(index, 1)
        }
      })
    } else {
      paginatedUsers.value.forEach((user) => {
        if (!selectedUsers.value.includes(user.id)) {
          selectedUsers.value.push(user.id)
        }
      })
    }
  }

  function clearSelection() {
    selectedUsers.value = []
  }

  function removeFromSelection(userId: number) {
    const index = selectedUsers.value.indexOf(userId)
    if (index > -1) {
      selectedUsers.value.splice(index, 1)
    }
  }

  return {
    selectedUsers,
    isAllSelected,
    toggleSelectUser,
    toggleSelectAll,
    clearSelection,
    removeFromSelection,
  }
}
