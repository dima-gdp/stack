export interface User {
  id: number
  name: string
  email: string
  role: UserRole
  status: UserStatus
  registrationDate: string
  lastActivity: string
  avatar: string | null
  loginCount: number
  postsCount: number
  commentsCount: number
}

export type UserRole = 'admin' | 'user' | 'moderator'
export type UserStatus = 'active' | 'inactive'

export interface UserFormData {
  name: string
  email: string
  role: UserRole
}

export interface NewUserData extends UserFormData {
  sendWelcomeEmail: boolean
}

export interface UserFormErrors {
  name: string
  email: string
}

export type SortDirection = 'asc' | 'desc'
export type SortColumn = 'id' | 'name' | 'email' | 'registrationDate' | 'lastActivity'
