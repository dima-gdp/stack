import type { User, UserRole, UserStatus } from '@/types/user'

export function generateMockUsers(count: number): User[] {
  const roles: UserRole[] = ['admin', 'user', 'moderator']
  const statuses: UserStatus[] = ['active', 'inactive']
  const names = [
    'Иван Петров',
    'Мария Сидорова',
    'Алексей Иванов',
    'Елена Кузнецова',
    'Дмитрий Смирнов',
    'Ольга Попова',
    'Сергей Васильев',
    'Анна Соколова',
    'Николай Михайлов',
    'Татьяна Новикова',
  ]

  const usersList: User[] = []
  for (let i = 1; i <= count; i++) {
    const name = names[Math.floor(Math.random() * names.length)] + ' ' + i
    const registrationDate = new Date(
      2020,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28),
    )
    const lastActivity = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000))

    usersList.push({
      id: i,
      name: name,
      email: `user${i}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)]!,
      status: statuses[Math.floor(Math.random() * statuses.length)]!,
      registrationDate: registrationDate.toISOString(),
      lastActivity: lastActivity.toISOString(),
      avatar: null,
      loginCount: Math.floor(Math.random() * 500),
      postsCount: Math.floor(Math.random() * 100),
      commentsCount: Math.floor(Math.random() * 300),
    })
  }
  return usersList
}
