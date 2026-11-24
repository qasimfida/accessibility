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

test('one head request loads the real widget and restores its settings before body parsing', async ({
  page,
}) => {
  const scripts: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'script') scripts.push(request.url());
  });
  await page.goto('');
  const entry = page.locator('head script[src$="/widget-bootstrap.js"]');
  await expect(entry).toHaveCount(1);
  expect(await entry.getAttribute('async')).toBeNull();
  expect(await entry.getAttribute('defer')).toBeNull();
  expect(
    scripts.filter((url) => url.endsWith('/widget-bootstrap.js')),
  ).toHaveLength(1);
  expect(
    scripts.some((url) => /\/(?:accessiblit\.min|bootstrap)\.js$/.test(url)),
  ).toBe(false);
  await expect(
    page.getByRole('button', {
      name: 'Open accessibility options',
      exact: true,
    }),
  ).toBeVisible();
});

test('production CSS preserves logical properties without legacy expansions', async ({
  page,
  request,
}) => {
  await page.goto('');
  const href = await page
    .locator('link[rel="stylesheet"]')
    .first()
    .getAttribute('href');
  expect(href).toBeTruthy();
  const response = await request.get(href!);
  expect(response.ok()).toBe(true);
  const css = await response.text();
  expect(css).toContain('inset-inline-start:');
  expect(css).not.toMatch(/:-(?:webkit|moz)-any\(/);
});
