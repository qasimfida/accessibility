import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

test.beforeEach(async ({ page }) => {
  // Observe real WAAPI calls without replacing or delaying the animation engine.
  await page.addInitScript(() => {
    const animate = Element.prototype.animate;
    Object.defineProperty(window, '__siteMotionCalls', { value: [] });
    Element.prototype.animate = function (...args) {
      if (this.closest('.marketing-main')) {
        const calls = Reflect.get(window, '__siteMotionCalls') as unknown[];
        calls.push({
          element: this.className,
          text: this.textContent,
          frames: args[0],
        });
      }
      return animate.apply(this, args);
    };
  });
});

test('Motion animates once on entry and releases its fill effects', async ({
  page,
}) => {
  const errors = await loadSite(page, '');
  await expect
    .poll(() =>
      page.evaluate(() => Reflect.get(window, '__siteMotionCalls').length),
    )
    .toBeGreaterThan(0);
  const card = page.locator('.journey-card').first();
  await card.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      page.evaluate(() =>
        Reflect.get(window, '__siteMotionCalls').some(
          (call: { element: string }) => call.element === 'journey-card',
        ),
      ),
    )
    .toBe(true);
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().length))
    .toBe(0);
  await expect(card).not.toHaveAttribute('style');
  const entries = () =>
    page.evaluate(() => {
      const calls = Reflect.get(window, '__siteMotionCalls') as {
        element: string;
        text: string;
      }[];
      return calls.filter(
        (call) =>
          call.element === 'journey-card' && call.text.includes('Add it once'),
      ).length;
    });
  expect(await entries()).toBe(1);
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('h1')).toBeInViewport();
  await card.scrollIntoViewIfNeeded();
  await expect(card).toBeInViewport();
  expect(await entries()).toBe(1);
  expect(errors).toEqual([]);
});

for (const profile of ['reduced', 'forced'] as const) {
  test(`${profile} preference keeps all content static and visible`, async ({
    page,
  }) => {
    const errors = await loadSite(page, '', profile);
    await page.locator('.journey-card').first().scrollIntoViewIfNeeded();
    await expect(page.locator('.journey-card').first()).toBeInViewport();
    expect(
      await page.evaluate(() => Reflect.get(window, '__siteMotionCalls')),
    ).toEqual([]);
    await expect(page.locator('h1')).toHaveCSS('opacity', '1');
    expect(errors).toEqual([]);
  });
}

test('Stop animations cancels site motion and prevents later entries', async ({
  page,
}) => {
  await loadSite(page, '');
  await page.evaluate(() => {
    const api = Reflect.get(window, 'Accessiblit');
    api.init().setFeature('stopAnimations', true);
  });
  await expect(page.locator('html')).toHaveClass(/accessiblit-stop-animations/);
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().length))
    .toBe(0);
  const count = await page.evaluate(
    () => Reflect.get(window, '__siteMotionCalls').length,
  );
  await page.locator('.free-plan').scrollIntoViewIfNeeded();
  await expect(page.locator('.free-plan')).toBeInViewport();
  expect(
    await page.evaluate(() => Reflect.get(window, '__siteMotionCalls').length),
  ).toBe(count);
});

test('changing reduced-motion preference cancels current and pending motion', async ({
  page,
}) => {
  await loadSite(page, '');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect
    .poll(() => page.evaluate(() => document.getAnimations().length))
    .toBe(0);
  const count = await page.evaluate(
    () => Reflect.get(window, '__siteMotionCalls').length,
  );
  await page.locator('.free-plan').scrollIntoViewIfNeeded();
  await expect(page.locator('.free-plan')).toBeInViewport();
  expect(
    await page.evaluate(() => Reflect.get(window, '__siteMotionCalls').length),
  ).toBe(count);
});

test('keyboard entry keeps the focused card stationary', async ({
  page,
  browserName,
}) => {
  await loadSite(page, '');
  const tab =
    browserName === 'webkit' && process.platform === 'darwin'
      ? 'Alt+Tab'
      : 'Tab';
  const card = page.locator('.journey-card').first();
  const link = card.getByRole('link');
  for (let count = 0; count < 30; count++) {
    if (await link.evaluate((element) => document.activeElement === element))
      break;
    await page.keyboard.press(tab);
  }
  await expect(link).toBeFocused();
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
      }),
  );
  await expect(card).toHaveCSS('transform', 'none');
  expect(await card.evaluate((element) => element.getAnimations().length)).toBe(
    0,
  );
});
