import { execFileSync } from 'node:child_process';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { createSiteServer } from './site/serve.mjs';

// Fail before changing assets when the optional maintainer-only encoder is absent.
execFileSync('cwebp', ['-version'], { stdio: 'ignore' });
const temporary = await mkdtemp(join(tmpdir(), 'accessibility-preview-'));

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
  assert.equal(box.width, 400);
  assert.equal(box.height, 680);
  await panel.screenshot({
    path: join(temporary, 'panel.png'),
  });
  execFileSync(
    'cwebp',
    [
      '-lossless',
      '-z',
      '9',
      join(temporary, 'panel.png'),
      '-o',
      fileURLToPath(
        new URL('../site/public/images/toolkit-white.webp', import.meta.url),
      ),
    ],
    { stdio: 'ignore' },
  );
  console.log('Captured real toolkit: 400 × 680, lossless WebP');
} finally {
  await browser?.close();
  await rm(temporary, { recursive: true, force: true });
  await new Promise((resolve) => server.close(resolve));
}
