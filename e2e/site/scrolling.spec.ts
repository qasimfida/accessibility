import { expect, test } from '@playwright/test';

test('fragment scrolling is smooth, while motion preferences retain priority', async ({
  page,
}) => {
  await page.emulateMedia({
    reducedMotion: 'no-preference',
    forcedColors: 'none',
  });
  await page.goto('install/');
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'smooth');
  await page
    .locator('.on-this-page')
    .getByRole('link', { name: 'npm', exact: true })
    .click();
  await expect(page).toHaveURL(/#npm$/);
  await expect(
    page.getByRole('heading', { name: 'npm and ESM', exact: true }),
  ).toBeInViewport();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await page.emulateMedia({
    reducedMotion: 'no-preference',
    forcedColors: 'active',
  });
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
  await page.emulateMedia({ forcedColors: 'none' });
  await page.evaluate(() =>
    Reflect.get(window, 'Accessiblit')
      .init()
      .setFeature('stopAnimations', true),
  );
  await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
});
