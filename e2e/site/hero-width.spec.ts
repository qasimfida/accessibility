import { expect, test } from '@playwright/test';
import { SITE_PAGES } from './helpers';

test('every hero shares viewport-wide paper and the same orbital placement', async ({
  page,
}) => {
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of SITE_PAGES) {
      await page.goto(route || './');
      const hero = page.locator('.product-hero, .page-hero').first();
      const box = await hero.boundingBox();
      expect(box!.x).toBeCloseTo(0, 0);
      expect(box!.width).toBeCloseTo(width, 0);
      expect(
        await hero.evaluate((e) => getComputedStyle(e, '::after').top),
      ).toBe('48px');
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width);
    }
  }
});
