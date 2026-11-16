import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

test('installation anchors leave heading clearance on a narrow screen', async ({
  page,
}) => {
  await loadSite(page, 'install/', 'small');
  await page.getByRole('link', { name: 'npm', exact: true }).click();
  await expect(page).toHaveURL(/#npm$/);
  const heading = page.getByRole('heading', {
    name: 'npm and ESM',
    exact: true,
  });
  await expect(heading).toBeInViewport();
  await expect
    .poll(() =>
      heading.evaluate((element) => {
        const clearance = parseFloat(
          getComputedStyle(document.documentElement).fontSize,
        );
        return element.getBoundingClientRect().top - clearance;
      }),
    )
    .toBeGreaterThanOrEqual(-1);
});

test('pressed actions keep visible feedback in forced colors', async ({
  page,
}) => {
  await loadSite(page, '', 'forced');
  const action = page.getByRole('link', {
    name: 'Try the live demo',
    exact: true,
  });
  await action.hover();
  await page.mouse.down();
  try {
    const pressed = await action.evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        active: element.matches(':active'),
        width: parseFloat(style.outlineWidth),
        style: style.outlineStyle,
      };
    });
    expect(pressed.active).toBe(true);
    expect(pressed.width).toBeGreaterThanOrEqual(2);
    expect(pressed.style).toBe('solid');
  } finally {
    await page.mouse.move(0, 0);
    await page.mouse.up();
  }
});
