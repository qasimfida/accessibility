import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('top drawer opens, closes, restores focus and yields to desktop navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto('toolkit/');
  const menu = page.locator('.mobile-menu');
  const toggle = menu.locator('summary');
  await expect(
    page.getByRole('navigation', { name: 'Breadcrumb' }),
  ).toHaveCount(0);
  await expect(
    page.getByRole('navigation', { name: 'Main navigation', exact: true }),
  ).toHaveCount(0);
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(menu).toHaveJSProperty('open', true);
  const navigation = page.getByRole('navigation', {
    name: 'Main navigation',
    exact: true,
  });
  await expect(navigation).toBeVisible();
  await expect(navigation).toHaveCSS('opacity', '1');
  await expect
    .poll(async () => {
      const header = await page.locator('header').boundingBox();
      const drawer = await navigation.boundingBox();
      return drawer!.y - header!.y - header!.height;
    })
    .toBeGreaterThanOrEqual(0);
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await navigation
    .getByRole('link', { name: 'Documentation', exact: true })
    .focus();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveJSProperty('open', false);
  await expect(toggle).toBeFocused();
  await toggle.click();
  // The drawer overlays the hero; click the visible page gutter outside it.
  await page.mouse.click(4, 650);
  await expect(menu).toHaveJSProperty('open', false);
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(menu).toHaveJSProperty('open', false);
  await expect(
    page.getByRole('navigation', { name: 'Main navigation', exact: true }),
  ).toBeVisible();
  await expect(toggle).toBeHidden();
});

test('short-screen drawer scrolls and following a link preserves native navigation', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 256 });
  await page.goto('');
  const menu = page.locator('.mobile-menu');
  await menu.locator('summary').click();
  const navigation = menu.getByRole('navigation');
  expect(
    await navigation.evaluate((e) => e.scrollHeight > e.clientHeight),
  ).toBe(true);
  const faq = navigation.getByRole('link', { name: 'FAQ', exact: true });
  await faq.click();
  await expect(page).toHaveURL(/\/faq\/$/);
  await expect(page.locator('.mobile-menu')).toHaveJSProperty('open', false);
});

test('mobile links work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 320, height: 700 },
  });
  try {
    const page = await context.newPage();
    await page.goto(baseURL!);
    const menu = page.locator('.mobile-menu');
    await menu.locator('summary').click();
    await expect(menu.getByRole('navigation')).toBeVisible();
    await menu
      .getByRole('link', { name: 'Documentation', exact: true })
      .click();
    await expect(page).toHaveURL(/\/install\/$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  } finally {
    await context.close();
  }
});
