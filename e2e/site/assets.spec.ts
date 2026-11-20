import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

test('local editorial media and typography load with their real content types', async ({
  page,
  request,
}) => {
  const errors = await loadSite(page, '');
  for (const [path, mime] of [
    ['fonts/manrope-latin.woff2', 'font/woff2'],
    ['images/editorial-demo.webp', 'image/webp'],
    ['images/toolkit-white.png', 'image/png'],
  ]) {
    const response = await request.get(path!);
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain(mime);
  }
  await page.evaluate(() => document.fonts.ready);
  expect(
    await page.evaluate(() => document.fonts.check('500 48px Manrope')),
  ).toBe(true);
  expect(errors).toEqual([]);
});
