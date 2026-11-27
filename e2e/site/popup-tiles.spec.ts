import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('body tiles form two columns without changing header structure or actions', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('./');
  await page
    .getByRole('button', { name: 'Open accessibility options', exact: true })
    .click();
  const panel = page.getByRole('dialog');
  const header = panel.locator('.accessiblit-header');
  await expect(header.getByRole('heading', { level: 2 })).toHaveText(
    'Accessibility options',
  );
  await expect(header.locator('.accessiblit-quick-action')).toHaveCount(6);
  const cards = panel
    .locator('.accessiblit-group')
    .first()
    .locator('.accessiblit-feature');
  const a = await cards.nth(0).boundingBox();
  const b = await cards.nth(1).boundingBox();
  expect(Math.abs(a!.y - b!.y)).toBeLessThan(1);
  expect(b!.x).toBeGreaterThan(a!.x);
  await panel
    .getByRole('button', { name: 'Increase Font size', exact: true })
    .click();
  await expect(page.getByRole('status')).toHaveText('Font size 110 percent');
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 700 });
  await expect
    .poll(() =>
      panel
        .locator('.accessiblit-body')
        .evaluate((e) => e.scrollWidth - e.clientWidth),
    )
    .toBeLessThanOrEqual(1);
  const first = await cards.nth(0).boundingBox();
  const second = await cards.nth(1).boundingBox();
  expect(second!.y).toBeGreaterThanOrEqual(first!.y + first!.height);
});
