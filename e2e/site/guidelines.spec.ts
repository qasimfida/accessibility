import { expect, test } from '@playwright/test';
import { loadSite, siteMetrics } from './helpers';

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

test('forced-color hover states retain readable text in both schemes', async ({
  page,
}) => {
  await loadSite(page, '', 'forced');
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme, forcedColors: 'active' });
    await page
      .getByRole('link', { name: 'Explore the live demo', exact: true })
      .hover();
    const metrics = await siteMetrics(page);
    expect(
      metrics.minimumTextContrast,
      JSON.stringify(metrics.lowContrastText),
    ).toBeGreaterThanOrEqual(4.5);
  }
});

test('pressed actions keep visible feedback in forced colors', async ({
  page,
}) => {
  await loadSite(page, '', 'forced');
  const action = page.getByRole('link', {
    name: 'Explore the live demo',
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

test('hosted demo stays light with the brand under a dark OS', async ({
  page,
}) => {
  await loadSite(page, '', 'dark');
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(250, 248, 245)',
  );
  await expect(page.locator('h1')).toHaveCSS('font-weight', '400');
  await page.keyboard.press('Alt+KeyA');
  await expect(page.getByRole('dialog')).toHaveCSS(
    'background-color',
    'rgb(255, 255, 255)',
  );
});
