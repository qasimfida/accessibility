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

for (const route of ['toolkit/', 'install/', 'contact/', 'faq/'])
  test(`${route} has the shared editorial hero and a working section action`, async ({
    page,
  }) => {
    await page.goto(route);
    const hero = page.locator('.product-page-hero');
    await expect(hero.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(hero.locator('.eyebrow')).toBeVisible();
    for (const width of [1440, 320]) {
      await page.setViewportSize({ width, height: 900 });
      const centres = await hero
        .locator('.eyebrow,h1,.lede')
        .evaluateAll((elements) =>
          elements.map((e) => {
            const box = e.getBoundingClientRect();
            return box.left + box.width / 2;
          }),
        );
      expect(Math.max(...centres) - Math.min(...centres)).toBeLessThanOrEqual(
        1,
      );
    }
    const action = hero.getByRole('link');
    await expect(action).toHaveCount(1);
    const href = await action.getAttribute('href');
    expect(href).toMatch(/^#/);
    await action.click();
    await expect(page.locator(href!)).toBeInViewport();
  });
