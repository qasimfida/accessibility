import { expect, test } from '@playwright/test';
import { SITE_PAGES } from './helpers';

test('every route renders the same footer with working framework destinations', async ({
  page,
  request,
}) => {
  let previous: string | undefined;
  for (const path of SITE_PAGES) {
    await page.goto(path || './');
    const footer = page.locator('footer');
    await expect(footer).toHaveCount(1);
    const html = await footer.innerHTML();
    if (previous) expect(html).toBe(previous);
    previous = html;
    const integrations = footer.getByRole('navigation', {
      name: 'Integration footer',
    });
    for (const name of [
      'React',
      'Next.js',
      'Vue',
      'Angular',
      'WordPress',
      'Shopify',
      'TypeScript',
      'JavaScript / HTML',
    ]) {
      const link = integrations.getByRole('link', { name, exact: true });
      const href = await link.getAttribute('href');
      expect(href).toMatch(/\/accessibility\/install\/#/);
      const response = await request.get(href!);
      expect(response.ok()).toBe(true);
    }
    expect(
      await footer
        .getByRole('heading', { name: 'Integrations' })
        .evaluate((e) => getComputedStyle(e).fontSize),
    ).toBe('16px');
  }
});
