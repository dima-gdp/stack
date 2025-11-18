import { ref } from 'vue'
import type { User } from '@/types/user'

export function useUserDetailsModal() {
  const showDetailsModal = ref(false)
  const selectedUser = ref<User | null>(null)

  function openUserDetails(user: User) {
    selectedUser.value = user
    showDetailsModal.value = true
  }

  function closeDetailsModal() {
    showDetailsModal.value = false
    selectedUser.value = null
  }

  return {
    showDetailsModal,
    selectedUser,
    openUserDetails,
    closeDetailsModal,
  }
}
