import { test, expect } from '@playwright/test'

test.describe('RefineIQ Compliance Governance & Multi-Currency Billing Suite', () => {
  test.setTimeout(60000)

  test('Compliance Center (/compliance) renders tabs, regulatory matrix, and 90-day roadmap', async ({ page }) => {
    await page.goto('/compliance')
    await expect(page).toHaveURL(/.*compliance/)
    await expect(page.locator('h1')).toContainText('Enterprise Governance, Privacy & Security')

    // Tab 1: Regulatory Matrix (default)
    await expect(page.getByText('Global Jurisdiction Matrix & Review Dates')).toBeVisible()
    await expect(page.getByRole('cell', { name: /Zambia/ })).toBeVisible()
    await expect(page.getByText('Data Protection Act No. 3 of 2021')).toBeVisible()
    await expect(page.getByRole('cell', { name: /European Union/ })).toBeVisible()

    // Tab 2: 90-Day Calendar
    await page.getByRole('button', { name: '📅 90-Day Calendar' }).click()
    await expect(page.getByText('90-Day Compliance Roadmap')).toBeVisible()
    await expect(page.getByText('Phase 1: Foundation & Transparency')).toBeVisible()
    await expect(page.getByText('Phase 2: Subprocessor & Cross-Border Auditing')).toBeVisible()
    await expect(page.getByText('Phase 3: SOC 2 Readiness & Continuous Telemetry')).toBeVisible()

    // Tab 3: Subprocessors & Residency
    await page.getByRole('button', { name: '🏢 Subprocessors & Residency' }).click()
    await expect(page.getByText('Authorized Subprocessor Transparency')).toBeVisible()
    await expect(page.getByText('Supabase Inc.')).toBeVisible()
    await expect(page.getByText('Modal Labs Inc.')).toBeVisible()

    // Tab 4: Compliance Automation (Vanta)
    await page.getByRole('button', { name: '🛡️ Compliance Automation (Vanta)' }).click()
    await expect(page.getByText('Compliance Automation Assessment')).toBeVisible()
    await expect(page.getByText('Vanta', { exact: true })).toBeVisible()
    await expect(page.getByText('Drata', { exact: true })).toBeVisible()
    await expect(page.getByText('Secureframe', { exact: true })).toBeVisible()
  })

  test('Settings (/settings) displays billing, launches multi-currency modal with ZMW and Mobile Money', async ({ page }) => {
    // Authenticate via demo
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Launch Demo ⚡' }).click()
    await expect(page).toHaveURL(/.*dashboard/)

    // Navigate to settings
    await page.goto('/settings')
    await expect(page).toHaveURL(/.*settings/)
    await expect(page.getByText('Current OCU Balance')).toBeVisible()
    await expect(page.getByText('Operations Compute Units')).toBeVisible()

    // Top-up packages section
    await expect(page.getByText('Top-Up OCUs')).toBeVisible()
    const topUpButtons = page.getByRole('button', { name: 'Top-Up Now' })
    await expect(topUpButtons.first()).toBeVisible()

    // Open RefineIQ Checkout Modal
    await topUpButtons.first().click()
    await expect(page.getByText('RefineIQ Secure Checkout')).toBeVisible()

    // Verify multi-currency switching to ZMW (Zambian Kwacha)
    const zmwButton = page.getByRole('button', { name: 'ZMW (K)' })
    await expect(zmwButton).toBeVisible()
    await zmwButton.click()
    await expect(page.getByText(/K.*ZMW/).first()).toBeVisible()

    // Switch payment method to Mobile Money
    const mobileMoneyBtn = page.getByRole('button', { name: /Mobile Money/i })
    await expect(mobileMoneyBtn).toBeVisible()
    await mobileMoneyBtn.click()

    // Verify Zambian carriers (MTN and Airtel)
    await expect(page.getByText(/MTN MoMo/i)).toBeVisible()
    await expect(page.getByText(/Airtel Money/i)).toBeVisible()

    // Close checkout modal
    const closeBtn = page.locator('button:has(svg.lucide-x)').first()
    await closeBtn.click()
    await expect(page.getByText('RefineIQ Secure Checkout')).not.toBeVisible()
  })

  test('Settings tabs navigate cleanly: Theme toggle, Privacy Shield, and API Keys', async ({ page }) => {
    // Authenticate via demo
    await page.goto('/auth')
    await page.getByRole('button', { name: 'Launch Demo ⚡' }).click()
    await expect(page).toHaveURL(/.*dashboard/)

    await page.goto('/settings')

    // Switch to Appearance tab
    await page.getByRole('button', { name: 'Appearance & Theme' }).click()
    await expect(page.getByText('Interface Theme')).toBeVisible()
    await expect(page.getByRole('button', { name: /Dark Canvas/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /Light Mode/i })).toBeVisible()

    // Switch to Privacy Shield tab
    await page.getByRole('button', { name: 'Privacy Shield' }).click()
    await expect(page.getByText('Privacy Shield Policy')).toBeVisible()
    await expect(page.getByText('Presidio Analyzer engine active')).toBeVisible()

    // Switch to API Keys tab
    await page.getByRole('button', { name: 'API Keys' }).click()
    await expect(page.getByText('Developer API Access')).toBeVisible()
    await expect(page.getByText('riq_live_9b4e82f1c0d57a3e8')).toBeVisible()
  })
})
