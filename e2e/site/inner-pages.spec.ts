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

test('About facts have a named semantic group', async ({ page }) => {
  await loadSite(page, 'about/', 'reduced');
  const facts = page.getByRole('group', {
    name: 'Accessibility at a glance',
    exact: true,
  });
  await expect(facts).toHaveCount(1);
  await expect(facts).toContainText('18');
  await expect(facts).toContainText('runtime dependencies');
  await expect(facts).toContainText('MIT');
});

test('documentation sidebar keeps keyboard focus visible in a short viewport', async ({
  page,
  browserName,
}) => {
  await page.setViewportSize({ width: 1440, height: 256 });
  await loadSite(page, 'install/', 'reduced');
  const links = page
    .getByRole('navigation', { name: 'Installation methods', exact: true })
    .getByRole('link');
  const tab =
    browserName === 'webkit' && process.platform === 'darwin'
      ? 'Alt+Tab'
      : 'Tab';
  await links.first().focus();
  for (let index = 0; index < (await links.count()); index++) {
    await expect(links.nth(index)).toBeFocused();
    const rect = await links.nth(index).boundingBox();
    expect(rect!.y).toBeGreaterThanOrEqual(3);
    expect(rect!.y + rect!.height).toBeLessThanOrEqual(253);
    if (index + 1 < (await links.count())) await page.keyboard.press(tab);
  }
});
