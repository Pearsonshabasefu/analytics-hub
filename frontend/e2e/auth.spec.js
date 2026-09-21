import { test, expect } from '@playwright/test'

test.describe('RefineIQ Authentication & Landing Page Flow', () => {
  test('Landing page loads and displays core headlines', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/RefineIQ/)
    await expect(page.locator('h1')).toContainText('Deploy predictive machine learning')
  })

  test('Public routes (Pricing, Terms) render cleanly', async ({ page }) => {
    await page.goto('/pricing')
    await expect(page.locator('h1')).toContainText('Pay Only for the Compute You Use')

    await page.goto('/terms')
    await expect(page.locator('h1')).toContainText('Terms and Conditions')
  })

  test('Auth page displays active Google and GitHub providers', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByRole('button', { name: 'Google' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'GitHub' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Launch Demo ⚡' })).toBeVisible()
  })

  test('Instant Demo Access logs in and redirects to Dashboard', async ({ page }) => {
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Launch Demo ⚡' }).click()

    // Expect navigation to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    await expect(page.locator('h1')).toContainText('Welcome back')
    await expect(page.getByRole('button', { name: 'Sign out' })).toBeVisible()

    // Sign out should return to home
    await page.getByRole('button', { name: 'Sign out' }).click()
    await expect(page).toHaveURL('/')
  })
})
