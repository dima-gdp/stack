<template>
  <div class="modal-overlay">
    <div class="modal" data-testid="user-add-modal">
      <div class="modal-header">
        <h3>Добавить нового пользователя</h3>
        <button @click="emit('close')" class="btn-close">✕</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label>Имя*</label>
          <input v-model="newUser.name" type="text" :class="{ error: errors.name }" />
          <span v-if="errors.name" class="error-text">
            {{ errors.name }}
          </span>
        </div>

        <div class="form-group">
          <label>Email*</label>
          <input v-model="newUser.email" type="email" :class="{ error: errors.email }" />
          <span v-if="errors.email" class="error-text">
            {{ errors.email }}
          </span>
        </div>

        <div class="form-group">
          <label>Роль*</label>
          <UserRoleSelect v-model="newUser.role" />
        </div>

        <div class="form-group">
          <label>
            <input v-model="newUser.sendWelcomeEmail" type="checkbox" />
            Отправить приветственное письмо
          </label>
        </div>
      </div>

      <div class="modal-footer">
        <UiButton variant="secondary" @click="emit('close')"> Отмена </UiButton>
        <UiButton variant="primary" :disabled="!isValid || isSaving" @click="emit('submit')">
          {{ isSaving ? 'Сохранение...' : 'Добавить' }}
        </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewUserData, UserFormErrors } from '@/types/user'
import UserRoleSelect from './UserRoleSelect.vue'
import UiButton from '../ui/UiButton.vue'

const { errors, isValid, isSaving } = defineProps<{
  errors: UserFormErrors
  isValid: boolean
  isSaving: boolean
}>()

const newUser = defineModel<NewUserData>('newUser', { required: true })

const emit = defineEmits<{
  close: []
  submit: []
}>()
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.btn-close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
}

.form-group input[type='text'],
.form-group input[type='email'],
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.form-group input.error {
  border-color: #f44336;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
