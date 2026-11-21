import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

test('product cards expand through hover and stable keyboard controls', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await loadSite(page, '');
  const grid = page.locator('.journey-grid');
  const controls = page.getByRole('group', { name: 'Preview a toolkit step' });
  await controls.scrollIntoViewIfNeeded();
  const privacy = controls.getByRole('button', {
    name: 'Privacy',
    exact: true,
  });
  await privacy.focus();
  await page.keyboard.press('Enter');
  await expect(privacy).toHaveAttribute('aria-pressed', 'true');
  await expect(privacy).toBeFocused();
  const widths = await grid
    .locator('.journey-card')
    .evaluateAll((nodes) => nodes.map((n) => n.getBoundingClientRect().width));
  expect(widths[2]!).toBeGreaterThan(widths[0]! * 1.8);
  await page.getByRole('button', { name: 'Setup', exact: true }).click();
  await expect(grid).toHaveAttribute('data-active', '0');
  if (
    await page.evaluate(
      () => matchMedia('(hover: hover) and (pointer: fine)').matches,
    )
  ) {
    await grid.locator('.journey-card').nth(1).hover();
    await expect(grid).toHaveAttribute('data-active', '1');
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => grid.evaluate((n) => n.getAnimations({ subtree: true }).length))
    .toBe(0);
});

test('mobile cards remain a single column with every description visible', async ({
  page,
}) => {
  await loadSite(page, '', 'small');
  const cards = page.locator('.journey-card');
  const boxes = await cards.evaluateAll((nodes) =>
    nodes.map((n) => n.getBoundingClientRect().toJSON()),
  );
  expect(boxes[1]!.top).toBeGreaterThan(boxes[0]!.bottom);
  for (const paragraph of await cards.locator('.journey-copy p').all())
    await expect(paragraph).toBeVisible();
});

for (const preference of ['print', 'stopAnimations'] as const) {
  test(`${preference} cancels an active product-card expansion`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await loadSite(page, '');
    const controls = page.getByRole('group', {
      name: 'Preview a toolkit step',
    });
    await controls
      .getByRole('button', { name: 'Privacy', exact: true })
      .click();
    if (preference === 'print') await page.emulateMedia({ media: 'print' });
    else
      await page.evaluate(() =>
        Reflect.get(window, 'Accessiblit')
          .init()
          .setFeature('stopAnimations', true),
      );
    await expect
      .poll(() =>
        page
          .locator('.journey-grid')
          .evaluate((n) => n.getAnimations({ subtree: true }).length),
      )
      .toBe(0);
  });
}
