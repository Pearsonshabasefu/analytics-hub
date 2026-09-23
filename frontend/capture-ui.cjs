const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUT_DIR = 'C:/Users/BLACKBOLT/.gemini/antigravity/brain/3195e7f0-3dd4-4a11-bcf4-e2825c71f609';
const BASE_URL = 'https://refineiq.vercel.app';

async function captureScreenshots() {
  console.log('Launching browser to capture RefineIQ UI screenshots...');
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1.5,
  });
  const page = await context.newPage();

  // 1. Landing Page Hero & Sections
  console.log('Capturing Landing Page...');
  await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
  await page.screenshot({ path: path.join(OUT_DIR, '01_landing_hero.png'), fullPage: false });
  await page.screenshot({ path: path.join(OUT_DIR, '01_landing_full.png'), fullPage: true });

  // 2. Compliance Page
  console.log('Capturing Compliance Center...');
  await page.goto(`${BASE_URL}/compliance`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.screenshot({ path: path.join(OUT_DIR, '02_compliance_matrix.png'), fullPage: false });
  
  // Click 90-day calendar tab
  const calTab = page.getByRole('button', { name: /90-Day Calendar/i });
  if (await calTab.count() > 0) {
    await calTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, '02_compliance_calendar.png'), fullPage: false });
  }

  // 3. Auth Page
  console.log('Capturing Auth Page...');
  await page.goto(`${BASE_URL}/auth`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.screenshot({ path: path.join(OUT_DIR, '03_auth_page.png'), fullPage: false });

  // Authenticate via Demo
  console.log('Logging in with Demo access...');
  await page.getByRole('button', { name: 'Launch Demo ⚡' }).click();
  await page.waitForURL(/.*dashboard/, { timeout: 30000 });
  await page.waitForTimeout(1000);

  // 4. Dashboard
  console.log('Capturing Dashboard...');
  await page.screenshot({ path: path.join(OUT_DIR, '04_dashboard.png'), fullPage: false });

  // 5. Settings & Zambian Kwacha Billing Modal
  console.log('Capturing Settings & Multi-currency Checkout Modal...');
  await page.goto(`${BASE_URL}/settings`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(OUT_DIR, '05_settings_billing.png'), fullPage: false });

  // Open Checkout Modal
  const topUpBtn = page.getByRole('button', { name: 'Top-Up Now' }).first();
  if (await topUpBtn.count() > 0) {
    await topUpBtn.click();
    await page.waitForTimeout(600);
    
    // Switch to Zambian Kwacha
    const zmwBtn = page.getByRole('button', { name: /ZMW/i });
    if (await zmwBtn.count() > 0) {
      await zmwBtn.click();
      await page.waitForTimeout(300);
    }
    // Switch to Mobile Money
    const momoBtn = page.getByRole('button', { name: /Mobile Money/i });
    if (await momoBtn.count() > 0) {
      await momoBtn.click();
      await page.waitForTimeout(300);
    }
    await page.screenshot({ path: path.join(OUT_DIR, '05_checkout_modal_zambia.png'), fullPage: false });
    
    // Close modal
    const closeBtn = page.locator('button:has(svg.lucide-x)').first();
    if (await closeBtn.count() > 0) await closeBtn.click();
    await page.waitForTimeout(300);
  }

  // 6. Studio (AutoML Tournament & TreeSHAP Explainability)
  console.log('Capturing AutoML Studio & TreeSHAP Beeswarm...');
  await page.goto(`${BASE_URL}/project/proj-1/studio`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '06_studio_explainability.png'), fullPage: false });

  // 7. Deploy Page & Batch Predict
  console.log('Capturing Deploy & Batch Predict...');
  await page.goto(`${BASE_URL}/project/proj-1/deploy`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '07_deploy_live.png'), fullPage: false });

  // Click Batch Predict Tab
  const batchTab = page.getByRole('button', { name: /Batch Predict/i });
  if (await batchTab.count() > 0) {
    await batchTab.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(OUT_DIR, '07_deploy_batch.png'), fullPage: false });
  }

  // 8. Watchtower Pulse Monitor
  console.log('Capturing Watchtower Pulse Monitor...');
  await page.goto(`${BASE_URL}/project/proj-1/watchtower`, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(OUT_DIR, '08_watchtower_monitor.png'), fullPage: false });

  console.log('All screenshots captured successfully!');
  await browser.close();
}

captureScreenshots().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
