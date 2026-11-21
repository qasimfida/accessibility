import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

for (const width of [1440, 390, 320])
  test(`toolkit preview stays in the showcase at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await loadSite(page, 'toolkit/', 'reduced');
    const geometry = await page
      .locator('.toolkit-detail-preview')
      .evaluate((element) => {
        const image = element.getBoundingClientRect();
        const showcase = element
          .closest('.toolkit-showcase')!
          .getBoundingClientRect();
        const header = document
          .querySelector('.page-hero')!
          .getBoundingClientRect();
        return {
          image: image.toJSON(),
          showcase: showcase.toJSON(),
          header: header.toJSON(),
          position: getComputedStyle(element).position,
        };
      });
    expect(geometry.position).toBe('static');
    expect(geometry.image.top).toBeGreaterThanOrEqual(geometry.showcase.top);
    expect(geometry.image.bottom).toBeLessThanOrEqual(geometry.showcase.bottom);
    expect(geometry.image.left).toBeGreaterThanOrEqual(geometry.showcase.left);
    expect(geometry.image.right).toBeLessThanOrEqual(geometry.showcase.right);
    expect(geometry.image.top).toBeGreaterThanOrEqual(geometry.header.bottom);
  });
