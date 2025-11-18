import { test, expect } from '@playwright/test'

const MATH_RANDOM_MOCK_VALUE = 0.124

// Добавил снапшоты чтобы не отломить стили
test.describe('UserTable snapshots', () => {
  test('Should take a snapshot of UserTable', async ({ page }) => {
    await page.addInitScript((value) => {
      Math.random = () => value
    }, MATH_RANDOM_MOCK_VALUE)
    await page.clock.setFixedTime(new Date('2024-01-15T12:00:00Z'))

    await page.goto('/')

    // Дождемся загрузки пользователей
    const firstUserCell = page.getByTestId('user-row').getByRole('cell').nth(2)
    await expect(firstUserCell).toHaveText('Мария Сидорова 1')

    await expect(page).toHaveScreenshot('user-table.png', { fullPage: true })
  })

  test('Should take a snapshot of modal add user', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('button', { name: ' + Добавить пользователя ' }).click()
    const userAddModal = page.getByTestId('user-add-modal')

    await expect(userAddModal).toBeVisible()
    await expect(userAddModal).toHaveScreenshot('user-add-modal.png')
  })

  test('Should take a snapshot of modal detail user', async ({ page }) => {
    await page.addInitScript((value) => {
      Math.random = () => value
    }, MATH_RANDOM_MOCK_VALUE)
    await page.clock.setFixedTime(new Date('2024-01-15T12:00:00Z'))

    await page.goto('/')

    const firstUserRow = page.getByTestId('user-row').first()
    await firstUserRow.getByTitle('Подробнее').click()

    const userDetailsModal = page.getByTestId('user-details-modal')
    await expect(userDetailsModal).toBeVisible()
    await expect(userDetailsModal).toHaveScreenshot('user-detail-modal.png')
  })
})
