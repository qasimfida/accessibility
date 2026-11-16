import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

test('installation anchors leave heading clearance on a narrow screen', async ({
  page,
}) => {
  await loadSite(page, 'install/', 'small');
  await page.getByRole('link', { name: 'npm', exact: true }).click();
  await expect(page).toHaveURL(/#npm$/);
  const heading = page.getByRole('heading', {
    name: 'npm and ESM',
    exact: true,
  });
  await expect(heading).toBeInViewport();
  await expect
    .poll(() =>
      heading.evaluate((element) => {
        const clearance = parseFloat(
          getComputedStyle(document.documentElement).fontSize,
        );
        return element.getBoundingClientRect().top - clearance;
      }),
    )
    .toBeGreaterThanOrEqual(-1);
});
