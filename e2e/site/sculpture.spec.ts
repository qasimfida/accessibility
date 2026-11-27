import { expect, test } from '@playwright/test';

test('dimensional planes assemble once and scrub only decorative depth', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Reflect.set(window, 'sculptureCalls', 0);
    Element.prototype.animate = function (...args) {
      if (this.classList.contains('sculpture-plane'))
        Reflect.set(
          window,
          'sculptureCalls',
          Reflect.get(window, 'sculptureCalls') + 1,
        );
      return animate.apply(this, args);
    };
  });
  await page.goto('./');
  await expect
    .poll(() => page.evaluate(() => Reflect.get(window, 'sculptureCalls')))
    .toBe(3);
  await expect(page.locator('.hero-sculpture')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          parseFloat(
            document.documentElement.style.getPropertyValue(
              '--site-hero-depth',
            ),
          ) || 0,
      ),
    )
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() =>
      page
        .locator('.sculpture-plane')
        .evaluateAll((es) =>
          es.reduce((n, e) => n + e.getAnimations().length, 0),
        ),
    )
    .toBe(0);
  expect(
    await page
      .locator('html')
      .evaluate((e) => e.style.getPropertyValue('--site-hero-depth')),
  ).toBe('');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.locator('header .brand').focus();
  expect(
    await page
      .locator('html')
      .evaluate((e) => e.style.getPropertyValue('--site-hero-depth')),
  ).toBe('');
  expect(await page.evaluate(() => Reflect.get(window, 'sculptureCalls'))).toBe(
    3,
  );
});

test('Stop animations removes active sculpture transforms', async ({
  page,
}) => {
  await page.goto('toolkit/');
  await page.evaluate(() =>
    Reflect.get(window, 'Accessiblit')
      .init()
      .setFeature('stopAnimations', true),
  );
  await expect
    .poll(() =>
      page
        .locator('.sculpture-plane')
        .evaluateAll((es) =>
          es.reduce((n, e) => n + e.getAnimations().length, 0),
        ),
    )
    .toBe(0);
  expect(
    await page
      .locator('html')
      .evaluate((e) => e.style.getPropertyValue('--site-hero-depth')),
  ).toBe('');
});
