import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const width of [320, 440])
  test(`compact shortcuts and neutral switches work at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/qa/plain.html');
    await page
      .getByRole('button', { name: 'Open accessibility options', exact: true })
      .click();
    const panel = page.getByRole('dialog');
    await expect(panel.locator('.accessiblit-brand')).toHaveText(
      'Accessibility',
    );
    const shortcuts = panel.getByRole('group', {
      name: 'Quick controls',
      exact: true,
    });
    await expect(shortcuts.getByRole('button')).toHaveCount(6);
    // Keep semantic assertions separate from geometry: Gecko crashes when
    // evaluateAll bridges this nested role query across the open shadow root.
    const boxes = await panel
      .locator('.accessiblit-quick-action')
      .evaluateAll((buttons) =>
        buttons.map((b) => b.getBoundingClientRect().toJSON()),
      );
    expect(new Set(boxes.map((b) => b.y)).size).toBe(width === 320 ? 2 : 1);
    const groupBox = await panel
      .locator('.accessiblit-quick-actions')
      .boundingBox();
    expect(groupBox).not.toBeNull();
    for (const y of new Set(boxes.map((b) => b.y))) {
      const row = boxes.filter((b) => b.y === y);
      expect(row).toHaveLength(width === 320 ? 3 : 6);
      const left = Math.min(...row.map((b) => b.x));
      const right = Math.max(...row.map((b) => b.x + b.width));
      expect(
        Math.abs((left + right) / 2 - (groupBox!.x + groupBox!.width / 2)),
      ).toBeLessThanOrEqual(1);
    }
    expect(boxes.every((b) => b.width >= 44 && b.height >= 44)).toBe(true);
    const toggle = panel.getByRole('button', {
      name: 'Dark mode',
      exact: true,
    });
    const card = toggle.locator('..');
    const original = await card.evaluate(
      (e) => getComputedStyle(e).backgroundColor,
    );
    const before = await toggle.evaluate((e) => ({
      track: getComputedStyle(e, '::after').backgroundColor,
      knob: getComputedStyle(e, '::before').insetInlineStart,
    }));
    const quick = shortcuts.getByRole('button', {
      name: 'Quick controls: Dark mode',
      exact: true,
    });
    await quick.click();
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    await expect(toggle).toHaveText('');
    await expect(card).toHaveCSS('background-color', original);
    const after = await toggle.evaluate((e) => ({
      track: getComputedStyle(e, '::after').backgroundColor,
      knob: getComputedStyle(e, '::before').insetInlineStart,
    }));
    expect(after.track).not.toBe(before.track);
    expect(after.knob).not.toBe(before.knob);
    await toggle.click();
    await expect(quick).toHaveAttribute('aria-pressed', 'false');
    const close = panel.getByRole('button', { name: 'Close', exact: true });
    await close.focus();
    await expect(close).toHaveCSS('outline-style', 'none');
    await expect(close).toHaveCSS('border-top-width', '0px');
    await expect(close.locator('svg')).toHaveCSS('stroke-width', '3px');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.keyboard.press('Escape');
    await expect(panel).toBeHidden();
  });

test('alignment icon hints and cursor artwork preserve native option semantics', async ({
  page,
}) => {
  await page.goto('/qa/plain.html');
  await page
    .getByRole('button', { name: 'Open accessibility options', exact: true })
    .click();
  const panel = page.getByRole('dialog');
  const align = panel.getByRole('radiogroup', {
    name: 'Text alignment',
    exact: true,
  });
  const left = align.getByRole('radio', { name: 'Left', exact: true });
  await left.check();
  await left.focus();
  await expect(page.getByRole('tooltip')).toHaveText('Left');
  await expect(left.locator('..').locator('.accessiblit-step-text')).toHaveText(
    'Left',
  );
  await expect(left.locator('..').locator('svg')).toBeVisible();
  await page.keyboard.press('ArrowRight');
  await expect(
    align.getByRole('radio', { name: 'Center', exact: true }),
  ).toBeChecked();
  const cursor = panel.getByRole('radiogroup', {
    name: 'Larger cursor',
    exact: true,
  });
  const large = cursor.getByRole('radio', { name: 'Large', exact: true });
  await large.check();
  await expect(large.locator('..').locator('svg')).toBeVisible();
  expect(
    await large
      .locator('..')
      .locator('.accessiblit-choice-icon')
      .evaluate((e) => getComputedStyle(e, '::after').content),
  ).toBe('none');
  await panel.getByRole('button', { name: 'Reset all', exact: true }).click();
  await expect(
    align.getByRole('radio', { name: 'Off', exact: true }),
  ).toBeChecked();
  await expect(large).not.toBeChecked();
});

test('borderless close retains a visible focus change in forced colours', async ({
  page,
}) => {
  await page.emulateMedia({ forcedColors: 'active' });
  await page.goto('/qa/plain.html');
  await page
    .getByRole('button', { name: 'Open accessibility options', exact: true })
    .click();
  const close = page.getByRole('button', { name: 'Close', exact: true });
  await close.blur();
  const rest = await close.evaluate((e) => getComputedStyle(e).color);
  await close.focus();
  const focused = await close.evaluate((e) => getComputedStyle(e).color);
  expect(focused).not.toBe(rest);
  await expect(close).toHaveCSS('outline-style', 'none');
  await expect(close).toHaveCSS('border-top-width', '0px');
});

test('additional contrast and reading-mask shortcuts share state with the full controls', async ({
  page,
}) => {
  await page.goto('/qa/plain.html');
  await page
    .getByRole('button', { name: 'Open accessibility options', exact: true })
    .click();
  const panel = page.getByRole('dialog');
  for (const name of ['High contrast', 'Reading mask']) {
    const quick = panel.getByRole('button', {
      name: `Quick controls: ${name}`,
      exact: true,
    });
    await quick.click();
    await expect(quick).toHaveAttribute('aria-pressed', 'true');
    await expect(
      panel.getByRole('button', { name, exact: true }),
    ).toHaveAttribute('aria-pressed', 'true');
  }
  await panel.getByRole('button', { name: 'Reset all', exact: true }).click();
  for (const name of ['High contrast', 'Reading mask'])
    await expect(
      panel.getByRole('button', {
        name: `Quick controls: ${name}`,
        exact: true,
      }),
    ).toHaveAttribute('aria-pressed', 'false');
});
