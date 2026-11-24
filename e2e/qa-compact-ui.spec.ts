import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

for (const width of [390, 320])
  test(`compact binary cards and icon choices work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/qa/plain.html');
    await page
      .getByRole('button', { name: 'Open accessibility options', exact: true })
      .click();
    const panel = page.getByRole('dialog');
    const cards = panel
      .locator('.accessiblit-group')
      .nth(1)
      .locator('.accessiblit-binary-feature');
    const boxes = await cards.evaluateAll((es) =>
      es.slice(0, 2).map((e) => e.getBoundingClientRect().toJSON()),
    );
    expect(boxes[0]!.top).toBe(boxes[1]!.top);
    expect(boxes[1]!.left).toBeGreaterThan(boxes[0]!.right);
    const toggle = panel.getByRole('button', {
      name: 'Dark mode',
      exact: true,
    });
    const card = toggle.locator('..');
    const neutral = await card.evaluate(
      (e) => getComputedStyle(e).backgroundColor,
    );
    await toggle.click();
    await expect(card).toHaveCSS('background-color', neutral);
    await expect(toggle).toHaveText('');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle.locator('..').locator('h4')).toHaveText('Dark mode');
    await toggle.click();
    await expect(toggle).toHaveText('');
    const close = panel.getByRole('button', { name: 'Close', exact: true });
    await close.focus();
    await expect(page.getByRole('tooltip')).toBeVisible();
    await expect(page.getByRole('tooltip')).toHaveText('Close');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

test('action tooltips invert with the system scheme', async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto('/qa/plain.html');
    await page
      .getByRole('button', { name: 'Open accessibility options', exact: true })
      .click();
    const tip = page.getByRole('tooltip');
    await expect(tip).toBeVisible();
    await expect(tip).toHaveCSS(
      'background-color',
      colorScheme === 'light' ? 'rgb(0, 0, 0)' : 'rgb(255, 255, 255)',
    );
  }
});

test('launcher hints dismiss with Escape and leave no region after destroy', async ({
  page,
}) => {
  await page.goto('/qa/plain.html');
  const launcher = page.getByRole('button', {
    name: 'Open accessibility options',
    exact: true,
  });
  await launcher.focus();
  await expect(page.getByRole('tooltip')).toHaveText(
    'Open accessibility options',
  );
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toBeHidden();
  await launcher.click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toBeHidden();
  await launcher.blur();
  await launcher.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await page.evaluate(() => window.qaInstance.destroy());
  await expect(page.locator('[data-accessiblit-host]')).toHaveCount(0);
});
