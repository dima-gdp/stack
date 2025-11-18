import type { User } from '@/types/user'
import { generateMockUsers } from './mockData'

/**
 * API для работы с пользователями
 */

export async function getUsers(): Promise<User[]> {
  // Симуляция API запроса
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return generateMockUsers(100)
}

export async function createUser(): Promise<void> {
  // Симуляция API запроса
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

export async function updateUser(): Promise<void> {
  // Симуляция API запроса
  await new Promise((resolve) => setTimeout(resolve, 500))
}

export async function deleteUser(): Promise<void> {
  // Симуляция API запроса
  await new Promise((resolve) => setTimeout(resolve, 300))
}

export async function deleteMultipleUsers(): Promise<void> {
  // Симуляция API запроса
  await new Promise((resolve) => setTimeout(resolve, 500))
}
