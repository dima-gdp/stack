<template>
  <div class="modal-overlay">
    <div class="modal modal-large" data-testid="user-details-modal">
      <div class="modal-header">
        <h3>Информация о пользователе</h3>
        <button @click="emit('close')" class="btn-close">✕</button>
      </div>

      <div class="modal-body">
        <div class="user-details">
          <div class="detail-section">
            <UserAvatar :avatar="user.avatar" :name="user.name" large />
            <h2>{{ user.name }}</h2>
            <p class="user-email">{{ user.email }}</p>
          </div>

          <div class="detail-section">
            <h4>Основная информация</h4>
            <div class="detail-row">
              <span class="label">ID:</span>
              <span>{{ user.id }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Роль:</span>
              <UserRoleBadge :role="user.role" />
            </div>
            <div class="detail-row">
              <span class="label">Статус:</span>
              <UserStatusBadge :status="user.status" />
            </div>
            <div class="detail-row">
              <span class="label">Дата регистрации:</span>
              <span>{{ formattedRegistrationDate }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Последняя активность:</span>
              <span>{{ formattedLastActivity }}</span>
            </div>
          </div>

          <div class="detail-section">
            <h4>Статистика</h4>
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-value">{{ user.loginCount || 0 }}</div>
                <div class="stat-label">Входов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ user.postsCount || 0 }}</div>
                <div class="stat-label">Постов</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">{{ user.commentsCount || 0 }}</div>
                <div class="stat-label">Комментариев</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <UiButton @click="emit('close')" variant="secondary"> Закрыть </UiButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { User } from '@/types/user'
import { formatDate, formatRelativeTime } from '@/utils/date'
import UserAvatar from './UserAvatar.vue'
import UserRoleBadge from './UserRoleBadge.vue'
import UserStatusBadge from './UserStatusBadge.vue'
import UiButton from '../ui/UiButton.vue'

const { user } = defineProps<{
  user: User
}>()

const emit = defineEmits<{
  close: []
}>()

const formattedRegistrationDate = computed(() => formatDate(user.registrationDate))
const formattedLastActivity = computed(() => formatRelativeTime(user.lastActivity))
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

.modal.modal-large {
  max-width: 700px;
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

.user-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detail-section {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.user-email {
  color: #666;
  text-align: center;
  margin: 5px 0 0 0;
}

.detail-section h2 {
  text-align: center;
  margin: 0 0 5px 0;
  font-size: 22px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-row .label {
  font-weight: 500;
  color: #666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.stat-card {
  background: white;
  padding: 15px;
  border-radius: 6px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #4caf50;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
