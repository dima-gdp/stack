import type { User, UserRole } from '@/types/user'
import { formatDate } from '@/utils/date'
import { ROLE_NAMES } from '@/constants/user'

export function getRoleLabel(role: UserRole): string {
  return ROLE_NAMES[role] || role
}

export function getNewUser(params: {
  id: number
  name: string
  email: string
  role: UserRole
}): User {
  return {
    id: params.id,
    name: params.name,
    email: params.email,
    role: params.role,
    status: 'active',
    registrationDate: new Date().toISOString(),
    lastActivity: new Date().toISOString(),
    avatar: null,
    loginCount: 0,
    postsCount: 0,
    commentsCount: 0,
  }
}

export function prepareUsersForCSV(users: User[]): string {
  const headers = ['ID', 'Имя', 'Email', 'Роль', 'Статус', 'Дата регистрации']
  const rows = users.map((user) => [
    user.id,
    user.name,
    user.email,
    getRoleLabel(user.role),
    user.status === 'active' ? 'Активен' : 'Неактивен',
    formatDate(user.registrationDate),
  ])

  let csv = headers.join(',') + '\n'
  rows.forEach((row) => {
    csv += row.map((cell) => `"${cell}"`).join(',') + '\n'
  })

  return csv
}
