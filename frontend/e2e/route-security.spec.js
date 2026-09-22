import { test, expect } from '@playwright/test'

test.describe('RefineIQ Route Security & Middleware Interception Suite', () => {
  test.setTimeout(60000)

  test('Public routes (Privacy, DPA, Compliance) render cleanly without auth', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/.*privacy/)
    await expect(page.locator('h1')).toContainText('Global Privacy Policy')

    await page.goto('/dpa', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/.*dpa/)
    await expect(page.locator('h1')).toContainText('Data Processing Agreement')

    await page.goto('/compliance', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/.*compliance/)
    await expect(page.locator('h1')).toContainText('Enterprise Governance, Privacy & Security')
  })

  test('Standard protected route (/dashboard) intercepts unauthenticated sessions to /auth', async ({ page }) => {
    await page.goto('/dashboard', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Standard protected route (/settings) intercepts unauthenticated sessions to /auth', async ({ page }) => {
    await page.goto('/settings', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Path variation: trailing slash (/dashboard/) is intercepted to /auth', async ({ page }) => {
    await page.goto('/dashboard/', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Path variation: case variation (/DASHBOARD) is intercepted to /auth', async ({ page }) => {
    await page.goto('/DASHBOARD', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Path variation: redundant slashes (/settings//) are intercepted to /auth', async ({ page }) => {
    await page.goto('/settings//', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Path variation: URL-encoded path (/%64ashboard) is intercepted to /auth', async ({ page }) => {
    await page.goto('/%64ashboard', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Path variation: query params (/dashboard?tab=models) are intercepted to /auth', async ({ page }) => {
    await page.goto('/dashboard?tab=models', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Incomplete project route (/project) is intercepted to /auth', async ({ page }) => {
    await page.goto('/project', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })
})
