import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const source = await readFile(new URL('src/ui/brand.ts', root), 'utf8');
const data = source.match(/BRAND_PATH_DATA\s*=\s*['"]([^'"]+)['"]/)?.[1];
if (!data || !/^[a-zA-Z0-9., |-]+$/.test(data))
  throw new Error('Invalid brand path data');
const paths = data
  .split('|')
  .map((d) => `<path d="${d}"/>`)
  .join('');
const mark = `<svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
for (const file of [
  'index.html',
  '404.html',
  ...[
    'about',
    'contact',
    'faq',
    'install',
    'options',
    'pricing',
    'toolkit',
  ].map((s) => `${s}/index.html`),
]) {
  const url = new URL(`site/${file}`, root);
  const html = await readFile(url, 'utf8');
  await writeFile(
    url,
    html.replace(
      /(<a\b[^>]*class="brand"[^>]*>)([\s\S]*?)(<\/a\s*>)/g,
      (_, open, body, close) =>
        open + mark + body.replace(/<svg\b[\s\S]*?<\/svg\s*>/g, '') + close,
    ),
  );
}
await writeFile(
  new URL('site/public/favicon.svg', root),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0047d8"/><g transform="translate(4 4)" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>\n`,
);
const ogUrl = new URL('site/public/og.svg', root);
const og = await readFile(ogUrl, 'utf8');
await writeFile(
  ogUrl,
  og
    .replace(/<g id="brand-mark"[\s\S]*?<\/g>/, '')
    .replace(
      '</svg>',
      `<g id="brand-mark" transform="translate(1040 64) scale(4)" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</g></svg>`,
    ),
);

const { chromium } = await import('@playwright/test');
const { fileURLToPath } = await import('node:url');
const browser = await chromium.launch();
try {
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
  });
  await page.goto(ogUrl.href);
  await page.screenshot({
    path: fileURLToPath(new URL('site/public/og.png', root)),
  });
} finally {
  await browser.close();
}
