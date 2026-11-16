import { expect, test } from '@playwright/test';
import { loadSite, SITE_PAGES } from './helpers';
import { FEATURE_IDS } from '../../src/core/schema';

test('catalogue, public options and search metadata describe the actual build', async ({
  page,
  request,
}) => {
  await loadSite(page, '');
  expect(
    await page
      .getByRole('main')
      .locator('[data-feature]')
      .evaluateAll((nodes) =>
        nodes.map((n) => n.getAttribute('data-feature')).sort(),
      ),
  ).toEqual([...FEATURE_IDS].sort());
  await loadSite(page, 'options/');
  expect(await page.locator('tbody th code').allTextContents()).toEqual([
    'position',
    'features',
    'exclude',
    'storageKey',
    'persist',
    'shortcut',
    'zIndex',
    'offset',
    'nonce',
    'messages',
    'dyslexiaFontUrl',
    'onChange',
  ]);
  for (const path of SITE_PAGES) {
    await loadSite(page, path);
    await expect(page).toHaveTitle(/\S/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /\S/,
    );
    const canonical = `https://qasimfida.github.io/accessiblit/${path}`;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      canonical,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      canonical,
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://qasimfida.github.io/accessiblit/og.png',
    );
    for (const colorScheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme });
      const colors = await page.evaluate(() => {
        const themes = [
          ...document.querySelectorAll<HTMLMetaElement>(
            'meta[name="theme-color"]',
          ),
        ]
          .filter((meta) => matchMedia(meta.media).matches)
          .map((meta) => meta.content.toLowerCase());
        const channels =
          getComputedStyle(document.body).backgroundColor.match(/\d+/g) ?? [];
        const background =
          '#' +
          channels
            .slice(0, 3)
            .map((value) => Number(value).toString(16).padStart(2, '0'))
            .join('');
        return { themes, background };
      });
      expect(colors.themes).toEqual([colors.background]);
    }
  }
  const sitemap = await (await request.get('sitemap.xml')).text();
  for (const path of SITE_PAGES.filter((p) => p !== '404.html'))
    expect(sitemap).toContain(
      `https://qasimfida.github.io/accessiblit/${path}`,
    );
  expect(sitemap).not.toContain('404.html');
  expect(await (await request.get('robots.txt')).text()).toContain(
    'https://qasimfida.github.io/accessiblit/sitemap.xml',
  );
  expect((await request.get('og.png')).headers()['content-type']).toContain(
    'image/png',
  );
});
