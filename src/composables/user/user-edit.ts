import { ref } from 'vue'
import type { User, UserFormData } from '@/types/user'

export function useUserEdit() {
  const editingUserId = ref<number | null>(null)
  const editForm = ref<UserFormData>({
    name: '',
    email: '',
    role: 'user',
  })

  function startEdit(user: User) {
    editingUserId.value = user.id
    editForm.value = {
      name: user.name,
      email: user.email,
      role: user.role,
    }
  }

  function cancelEdit() {
    editingUserId.value = null
    editForm.value = {
      name: '',
      email: '',
      role: 'user',
    }
  }

  return {
    editingUserId,
    editForm,
    startEdit,
    cancelEdit,
  }
}
