import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

test('landing disclosures expose every feature and answer by keyboard', async ({
  page,
}) => {
  const errors = await loadSite(page, '');
  await expect(
    page.getByRole('complementary', { name: 'Toolkit announcement' }),
  ).toContainText('Free, open source and private');
  const catalogue = page.locator('.full-catalogue');
  await catalogue.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(catalogue).toHaveAttribute('open', '');
  await expect(catalogue.locator('[data-feature]')).toHaveCount(18);
  for (const feature of await catalogue.locator('[data-feature]').all())
    await expect(feature).toBeVisible();
  const question = page
    .locator('.faq-section details')
    .filter({ hasText: 'Is it really free for commercial websites?' });
  await question.locator('summary').focus();
  await page.keyboard.press('Space');
  await expect(question).toHaveAttribute('open', '');
  await expect(question.locator('p')).toContainText('MIT license');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press('Space');
  await expect(question).not.toHaveAttribute('open');
  await expect(question.locator('summary')).toBeFocused();
  expect(errors).toEqual([]);
});

test('hero artwork leaves its caption clear on mobile and desktop', async ({
  page,
}) => {
  await loadSite(page, '');
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const caption = await page
      .locator('.product-stage figcaption')
      .boundingBox();
    for (const selector of ['.store-browser', '.toolkit-preview']) {
      const art = await page.locator(selector).boundingBox();
      expect(art!.y + art!.height).toBeLessThanOrEqual(caption!.y - 8);
    }
  }
});
