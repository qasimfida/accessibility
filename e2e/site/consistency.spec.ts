import { expect, test } from '@playwright/test';

test('FAQ uses the home disclosure appearance and native keyboard behaviour', async ({
  page,
}) => {
  await page.goto('');
  const appearance = (element: Element) => {
    const style = getComputedStyle(element);
    return {
      size: style.fontSize,
      weight: style.fontWeight,
      padding: style.paddingBlock,
      marker: style.listStyleType,
    };
  };
  const home = await page
    .locator('.faq-section .accordion summary')
    .first()
    .evaluate(appearance);
  await page.goto('faq/');
  const summary = page.locator('.faq-list summary').first();
  expect(await summary.evaluate(appearance)).toEqual(home);
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.faq-list details').first()).toHaveJSProperty(
    'open',
    true,
  );
  await expect(page.locator('.faq-list .faq-answer').first()).toBeVisible();
  await page.keyboard.press('Space');
  await expect(page.locator('.faq-list details').first()).toHaveJSProperty(
    'open',
    false,
  );
  await expect(summary).toBeFocused();
});
