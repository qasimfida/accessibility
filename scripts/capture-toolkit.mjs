import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { createSiteServer } from './site/serve.mjs';

// Capture the working local build, rather than maintaining a second illustrative UI.
const server = createSiteServer();
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
let browser;
try {
  browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.goto(
    `http://127.0.0.1:${server.address().port}/accessibility/toolkit/`,
  );
  await page
    .getByRole('button', { name: 'Open live demo options', exact: true })
    .click();
  const panel = page.getByRole('dialog', {
    name: 'Accessibility options',
    exact: true,
  });
  await panel
    .getByRole('button', { name: 'Close', exact: true })
    .evaluate((e) => e.blur());
  const box = await panel.boundingBox();
  assert.equal(box.width, 440);
  assert.equal(box.height, 760);
  await panel.screenshot({
    path: fileURLToPath(
      new URL('../site/public/images/toolkit-white.png', import.meta.url),
    ),
  });
  console.log('Captured real toolkit: 440 × 760');
} finally {
  await browser?.close();
  await new Promise((resolve) => server.close(resolve));
}
