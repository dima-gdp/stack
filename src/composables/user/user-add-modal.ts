import { ref, computed, watch, toValue } from 'vue'
import type { MaybeRefOrGetter } from 'vue'
import type { User, NewUserData, UserFormErrors } from '@/types/user'
import { validateEmail } from '@/utils/validate'

export function useUserAddModal(users: MaybeRefOrGetter<User[]>) {
  const showAddUserModal = ref(false)

  function getInitialUser(): NewUserData {
    return {
      name: '',
      email: '',
      role: 'user',
      sendWelcomeEmail: true,
    }
  }

  const newUser = ref<NewUserData>(getInitialUser())

  function resetNewUser() {
    newUser.value = getInitialUser()
  }

  const newUserErrors = ref<UserFormErrors>({
    name: '',
    email: '',
  })

  function resetErrors() {
    newUserErrors.value = {
      name: '',
      email: '',
    }
  }

  const isNewUserValid = computed(() => {
    return (
      newUser.value.name.trim().length > 0 &&
      newUser.value.email.trim().length > 0 &&
      validateEmail(newUser.value.email) &&
      !newUserErrors.value.name &&
      !newUserErrors.value.email
    )
  })

  // Неудобно сделана валидация
  function validateNewUserName() {
    if (newUser.value.name.trim().length === 0) {
      newUserErrors.value.name = 'Имя обязательно для заполнения'
    } else if (newUser.value.name.trim().length < 3) {
      newUserErrors.value.name = 'Имя должно содержать минимум 3 символа'
    } else {
      newUserErrors.value.name = ''
    }
  }

  function validateNewUserEmail() {
    if (newUser.value.email.trim().length === 0) {
      newUserErrors.value.email = 'Email обязателен для заполнения'
    } else if (!validateEmail(newUser.value.email)) {
      newUserErrors.value.email = 'Некорректный формат email'
    } else if (toValue(users).some((u) => u.email === newUser.value.email)) {
      newUserErrors.value.email = 'Пользователь с таким email уже существует'
    } else {
      newUserErrors.value.email = ''
    }
  }

  function openAddUserModal() {
    resetNewUser()
    resetErrors()
    showAddUserModal.value = true
  }

  function closeAddUserModal() {
    showAddUserModal.value = false
    resetNewUser()
    resetErrors()
  }

  // Watch для валидации в реальном времени
  watch(() => newUser.value.name, validateNewUserName)
  watch(() => newUser.value.email, validateNewUserEmail)

  return {
    showAddUserModal,
    newUser,
    newUserErrors,
    isNewUserValid,
    openAddUserModal,
    closeAddUserModal,
    validateNewUserName,
    validateNewUserEmail,
  }
}
