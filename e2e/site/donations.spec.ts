import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

test('planned donations explain availability without starting a payment', async ({
  page,
}) => {
  await loadSite(page, '', 'light');
  const donate = page.getByRole('button', { name: 'Donate', exact: true });
  await expect(donate).toHaveAttribute('aria-disabled', 'true');
  await expect(donate).toHaveAttribute('title', /Donations coming soon/);
  await expect(donate).toHaveAccessibleDescription(
    /does not collect a payment/,
  );
  const url = page.url();
  await donate.focus();
  await expect(donate).toBeFocused();
  await page.keyboard.press('Enter');
  await page.keyboard.press('Space');
  await expect(page).toHaveURL(url);
  await expect(page.locator('#donation-note')).toBeVisible();
});
