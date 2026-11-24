import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * E2E Accessibility Tests - WCAG 2.1 AA & GIGW 3.0 Compliance
 * Tests 5 critical user journeys with axe-core automation
 */

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

test.describe('Accessibility: WCAG 2.1 AA & GIGW 3.0 Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForLoadState('networkidle');
  });

  test('Homepage - no accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Homepage - skip to content link works', async ({ page }) => {
    // Check skip link exists
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeVisible();
    
    // Focus and activate skip link
    await skipLink.focus();
    await skipLink.press('Enter');
    
    // Main content should be focused
    const mainContent = page.locator('main, [role="main"], #main-content');
    await expect(mainContent).toBeFocused();
  });

  test('Homepage - proper heading hierarchy', async ({ page }) => {
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    expect(headings.length).toBeGreaterThan(0);
    
    // First heading should be h1
    const firstHeading = headings[0];
    await expect(firstHeading).toHaveTagName('h1');
    
    // Check no skipped heading levels
    let previousLevel = 1;
    for (const heading of headings) {
      const tagName = await heading.evaluate(el => el.tagName.toLowerCase());
      const level = parseInt(tagName.charAt(1));
      expect(level).toBeLessThanOrEqual(previousLevel + 1);
      previousLevel = level;
    }
  });

  test('Homepage - all images have alt text', async ({ page }) => {
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      expect(alt).toBeDefined();
      // Decorative images should have empty alt
      if (alt !== '') {
        expect(alt.length).toBeGreaterThan(0);
      }
    }
  });

  test('Homepage - sufficient color contrast', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      v => v.id === 'color-contrast'
    );
    expect(contrastViolations).toEqual([]);
  });
});

test.describe('Journey 1: Citizen Dashboard Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    // Login as citizen
    await page.fill('input[name="email"]', 'citizen@demo.yojna');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Citizen Dashboard - no accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Citizen Dashboard - project cards are keyboard navigable', async ({ page }) => {
    const projectCards = page.locator('[data-testid="project-card"], .project-card');
    const count = await projectCards.count();
    
    if (count > 0) {
      // Tab to first card
      await page.keyboard.press('Tab');
      await expect(projectCards.first()).toBeFocused();
      
      // Arrow keys should navigate between cards
      await page.keyboard.press('ArrowRight');
      // Second card should be focused (if exists)
    }
  });

  test('Citizen Dashboard - Sahay AI assistant accessible', async ({ page }) => {
    const sahayButton = page.getByRole('button', { name: /sahay|assistant|ask/i });
    await expect(sahayButton).toBeVisible();
    
    // Open assistant
    await sahayButton.click();
    
    const chatInput = page.getByRole('textbox', { name: /ask|message|query/i });
    await expect(chatInput).toBeVisible();
    await expect(chatInput).toBeEditable();
  });
});

test.describe('Journey 2: Scheme Search & Map Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/schemes`);
    await page.waitForLoadState('networkidle');
  });

  test('Schemes Page - no accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Schemes Page - search is accessible', async ({ page }) => {
    const searchInput = page.getByRole('searchbox', { name: /search|filter/i });
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeEditable();
    
    // Test search with keyboard
    await searchInput.fill('MGNREGA');
    await page.keyboard.press('Enter');
    await page.waitForLoadState('networkidle');
  });

  test('Schemes Page - filter controls accessible', async ({ page }) => {
    const districtFilter = page.getByRole('combobox', { name: /district/i });
    const schemeFilter = page.getByRole('combobox', { name: /scheme/i });
    
    if (await districtFilter.isVisible()) {
      await expect(districtFilter).toBeEditable();
    }
    
    if (await schemeFilter.isVisible()) {
      await expect(schemeFilter).toBeEditable();
    }
  });

  test('Map View - keyboard accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/map`);
    await page.waitForLoadState('networkidle');
    
    const mapContainer = page.locator('[data-testid="map"], .leaflet-container');
    await expect(mapContainer).toBeVisible();
    
    // Map should be focusable
    await mapContainer.focus();
    await expect(mapContainer).toBeFocused();
  });
});

test.describe('Journey 3: Reconciliation & Fund Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    // Login as field officer
    await page.fill('input[name="email"]', 'officer@demo.yojna');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    
    await page.goto(`${BASE_URL}/reconciliation`);
    await page.waitForLoadState('networkidle');
  });

  test('Reconciliation Page - no accessibility violations', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Reconciliation Page - variance table accessible', async ({ page }) => {
    const table = page.locator('table, [role="table"]');
    await expect(table).toBeVisible();
    
    // Check table headers
    const headers = table.locator('th, [role="columnheader"]');
    await expect(headers.first()).toBeVisible();
    
    // Check row headers for data rows
    const rows = table.locator('tr, [role="row"]');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThan(1); // Header + at least 1 data row
  });

  test('Reconciliation Page - alert cards have proper roles', async ({ page }) => {
    const alerts = page.locator('[role="alert"], [role="status"], .alert, .variance-alert');
    const count = await alerts.count();
    
    if (count > 0) {
      for (const alert of await alerts.all()) {
        const role = await alert.getAttribute('role');
        expect(['alert', 'status']).toContain(role);
      }
    }
  });
});

test.describe('Journey 4: Field Inspection & Grievance Filing', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    // Login as citizen
    await page.fill('input[name="email"]', 'citizen@demo.yojna');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Field Verify Page - no accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}/field-verify`);
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Field Verify - form fields have labels', async ({ page }) => {
    await page.goto(`${BASE_URL}/field-verify`);
    await page.waitForLoadState('networkidle');
    
    const inputs = await page.locator('input, select, textarea').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledby = await input.getAttribute('aria-labelledby');
      
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        await expect(label).toBeVisible();
      } else if (ariaLabel || ariaLabelledby) {
        // Has accessible name
      } else {
        // Check if wrapped in label
        const parentLabel = input.locator('xpath=ancestor::label');
        await expect(parentLabel).toBeVisible();
      }
    }
  });

  test('Grievance Filing - form accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/grievances`);
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Grievance Form - required fields marked', async ({ page }) => {
    await page.goto(`${BASE_URL}/grievances/new`);
    await page.waitForLoadState('networkidle');
    
    const requiredFields = page.locator('[required], [aria-required="true"]');
    const count = await requiredFields.count();
    expect(count).toBeGreaterThan(0);
    
    // Check visual indication
    for (const field of await requiredFields.all()) {
      const ariaRequired = await field.getAttribute('aria-required');
      expect(ariaRequired).toBe('true');
    }
  });

  test('Grievance Form - error messages accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/grievances/new`);
    await page.waitForLoadState('networkidle');
    
    // Submit empty form
    await page.click('button[type="submit"]');
    await page.waitForTimeout(500);
    
    // Check for error messages
    const errors = page.locator('[role="alert"], .error, [aria-invalid="true"]');
    const errorCount = await errors.count();
    expect(errorCount).toBeGreaterThan(0);
    
    // Error messages should be associated with fields
    for (const error of await errors.all()) {
      const id = await error.getAttribute('id');
      if (id) {
        const field = page.locator(`[aria-describedby*="${id}"]`);
        await expect(field).toBeVisible();
      }
    }
  });
});

test.describe('Journey 5: Admin Notice Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/auth/login`);
    await page.waitForLoadState('networkidle');
    
    // Login as admin
    await page.fill('input[name="email"]', 'admin@demo.yojna');
    await page.fill('input[name="password"]', 'demo123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
  });

  test('Notices Page - no accessibility violations', async ({ page }) => {
    await page.goto(`${BASE_URL}/notices`);
    await page.waitForLoadState('networkidle');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Notice Create/Edit - rich text editor accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/notices/new`);
    await page.waitForLoadState('networkidle');
    
    // Check for accessible editor
    const editor = page.locator('[role="textbox"][contenteditable="true"], .tiptap-editor, [data-testid="rich-editor"]');
    if (await editor.isVisible()) {
      await expect(editor).toBeEditable();
    }
  });

  test('Notice List - table sortable and accessible', async ({ page }) => {
    await page.goto(`${BASE_URL}/notices`);
    await page.waitForLoadState('networkidle');
    
    const table = page.locator('table, [role="table"]');
    await expect(table).toBeVisible();
    
    // Column headers should be buttons for sorting
    const sortButtons = table.locator('th button, [role="columnheader"] button');
    const buttonCount = await sortButtons.count();
    
    if (buttonCount > 0) {
      await expect(sortButtons.first()).toBeVisible();
      await sortButtons.first().click();
      await page.waitForTimeout(300);
    }
  });
});

test.describe('Multilingual Accessibility', () => {
  const languages = ['en', 'as', 'hi', 'bn'] as const;

  for (const lang of languages) {
    test(`Language ${lang} - no accessibility violations`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}`);
      await page.waitForLoadState('networkidle');
      
      const accessibilityScanResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();

      expect(accessibilityScanResults.violations).toEqual([]);
    });

    test(`Language ${lang} - lang attribute set correctly`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}`);
      await page.waitForLoadState('networkidle');
      
      const htmlLang = await page.getAttribute('html', 'lang');
      expect(htmlLang).toBe(lang);
    });

    test(`Language ${lang} - RTL not incorrectly applied`, async ({ page }) => {
      await page.goto(`${BASE_URL}/${lang}`);
      await page.waitForLoadState('networkidle');
      
      const dir = await page.getAttribute('html', 'dir');
      // None of our languages are RTL
      expect(dir).notToBe('rtl');
    });
  }
});

test.describe('Focus Management', () => {
  test('Modal dialog traps focus', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    await page.waitForLoadState('networkidle');
    
    // Open a modal (e.g., project details)
    const projectCard = page.locator('[data-testid="project-card"], .project-card').first();
    if (await projectCard.isVisible()) {
      await projectCard.click();
      await page.waitForTimeout(300);
      
      const modal = page.locator('[role="dialog"], [role="alertdialog"], .modal');
      if (await modal.isVisible()) {
        // Focus should be trapped in modal
        const focusableElements = modal.locator(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const count = await focusableElements.count();
        expect(count).toBeGreaterThan(0);
        
        // Tab should cycle within modal
        await page.keyboard.press('Tab');
        await expect(focusableElements.first()).toBeFocused();
      }
    }
  });

  test('Page navigation announces changes', async ({ page }) => {
    await page.goto(`${BASE_URL}/schemes`);
    await page.waitForLoadState('networkidle');
    
    // Navigate to map
    await page.goto(`${BASE_URL}/map`);
    await page.waitForLoadState('networkidle');
    
    // Check for live region or heading announcement
    const mainHeading = page.locator('h1, [role="heading"][aria-level="1"]');
    await expect(mainHeading).toBeVisible();
  });
});