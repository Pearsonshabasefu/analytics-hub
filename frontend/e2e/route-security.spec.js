import { test, expect } from '@playwright/test'

test.describe('RefineIQ Route Security & Middleware Interception Suite', () => {

  test('Public legal & product routes remain accessible without authentication', async ({ page }) => {
    const publicRoutes = ['/pricing', '/terms', '/privacy', '/dpa']
    for (const route of publicRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page).not.toHaveURL(/\/auth/)
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('Standard protected routes intercept unauthenticated sessions to /auth', async ({ page }) => {
    const protectedRoutes = [
      '/dashboard',
      '/settings',
      '/project/proj-999/studio',
      '/project/proj-999/deploy',
    ]

    for (const route of protectedRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      // Must intercept to /auth with redirect preserved
      await expect(page).toHaveURL(/\/auth/)
    }
  })

  test('Path variation: trailing slashes are intercepted to /auth', async ({ page }) => {
    const trailingSlashRoutes = [
      '/dashboard/',
      '/settings/',
      '/project/demo-123/studio/',
    ]

    for (const route of trailingSlashRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page).toHaveURL(/\/auth/)
    }
  })

  test('Path variation: case variations (/DASHBOARD, /Settings) are intercepted to /auth', async ({ page }) => {
    const caseVariationRoutes = [
      '/DASHBOARD',
      '/Dashboard',
      '/SETTINGS',
      '/Settings',
    ]

    for (const route of caseVariationRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page).toHaveURL(/\/auth/)
    }
  })

  test('Path variation: redundant slashes (//dashboard, ///settings) are intercepted to /auth', async ({ page }) => {
    const redundantSlashRoutes = [
      '//dashboard',
      '///settings',
    ]

    for (const route of redundantSlashRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' })
      await expect(page).toHaveURL(/\/auth/)
    }
  })

  test('Path variation: URL-encoded paths (%64ashboard) and query strings are intercepted to /auth', async ({ page }) => {
    // %64 = 'd' -> /dashboard
    await page.goto('/%64ashboard', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)

    // Query parameters & hash variations
    await page.goto('/dashboard?tab=analytics&sort=desc#metrics', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

  test('Incomplete project routes (/project, /project/) are intercepted to /auth', async ({ page }) => {
    await page.goto('/project', { waitUntil: 'domcontentloaded' })
    await expect(page).toHaveURL(/\/auth/)
  })

})
