export const INITIAL_PAGE_SIZE = 25

export const ROLE_NAMES = {
  admin: 'Администратор',
  user: 'Пользователь',
  moderator: 'Модератор',
} as const

export type UserRoleNames = (typeof ROLE_NAMES)[keyof typeof ROLE_NAMES]
