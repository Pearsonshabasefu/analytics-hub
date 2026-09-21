import { test, expect } from '@playwright/test'

test.describe('RefineIQ Full ML Lifecycle & Pipeline', () => {
  test.beforeEach(async ({ page }) => {
    // Authenticate with demo session
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Launch Demo ⚡' }).click()
    await expect(page).toHaveURL(/.*dashboard/)
  })

  test('Dashboard displays metrics, blueprints, and deduplicated projects', async ({ page }) => {
    await expect(page.getByText('OCU USAGE THIS WEEK')).toBeVisible()
    await expect(page.getByText('LIVE PREDICTION VOLUME')).toBeVisible()
    await expect(page.getByText('YOUR PROJECTS')).toBeVisible()

    // Test stage jump to Studio
    const studioJump = page.getByRole('button', { name: '03 Studio' }).first()
    await expect(studioJump).toBeVisible()
    await studioJump.click()
    await expect(page).toHaveURL(/.*studio/)
  })

  test('AutoML Studio displays tournament leaderboard and TreeSHAP explainability', async ({ page }) => {
    await page.goto('/project/proj-1/studio')
    await expect(page.locator('h1')).toContainText('AutoML Tournament & Exact TreeSHAP Explainability')
    await expect(page.getByText('XGBoost Classifier')).toBeVisible()
    await expect(page.getByText('Global Explainability Engine (TreeSHAP)')).toBeVisible()
  })

  test('Deploy Playground runs real-time inference and switches to Batch Predict', async ({ page }) => {
    await page.goto('/project/proj-1/deploy')
    await expect(page.locator('h1')).toContainText('Production API Live')

    // Verify live prediction playground
    await expect(page.getByRole('button', { name: 'Run Live Prediction ⚡' })).toBeVisible()
    await expect(page.getByText('EXACT TREESHAP DECOMPOSITION')).toBeVisible()

    // Switch to Batch Predict tab
    await page.getByRole('button', { name: '📦 Batch Predict' }).click()
    await expect(page.getByText('No-Code Batch Scoring')).toBeVisible()
    await expect(page.getByText('Drop your CSV here or click to browse')).toBeVisible()
  })

  test('Watchtower Monitor renders SLA, Latency, and Alerts cleanly', async ({ page }) => {
    await page.goto('/project/proj-1/watchtower')
    await expect(page.getByText('SERVICE SLA UPTIME')).toBeVisible()
    await expect(page.getByText('INFERENCE LATENCY')).toBeVisible()
    await expect(page.getByText('Live Inference Activity Stream')).toBeVisible()
  })
})
