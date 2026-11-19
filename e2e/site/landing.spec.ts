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
