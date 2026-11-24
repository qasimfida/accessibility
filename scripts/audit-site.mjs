import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { chromium } from '@playwright/test';
import { format } from 'prettier';
import { createSiteServer } from './site/serve.mjs';

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 19))
  throw new Error(
    'The optional Lighthouse 13.6 audit needs Node 22.19+; library/site builds still support Node 20.',
  );
const { values } = parseArgs({
  options: {
    url: { type: 'string' },
    output: {
      type: 'string',
      default: 'reports/assets/site-performance/local-mobile',
    },
    runs: { type: 'string', default: '1' },
    desktop: { type: 'boolean', default: false },
    page: { type: 'string' },
  },
});
const runs = Number(values.runs);
if (!Number.isInteger(runs) || runs < 1 || runs > 10)
  throw new Error('--runs must be an integer between 1 and 10.');
const pages = [
  ['home', ''],
  ['install', 'install/'],
  ['options', 'options/'],
  ['faq', 'faq/'],
  ['about', 'about/'],
  ['contact', 'contact/'],
  ['toolkit', 'toolkit/'],
  ['404', '404.html'],
].filter(([name]) => values.page === undefined || name === values.page);
if (!pages.length) throw new Error('Unknown --page.');
const folder = pathToFileURL(resolve(values.output) + '/');
await mkdir(folder, { recursive: true });
const server = values.url ? undefined : createSiteServer();
if (server)
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = values.url
  ? new URL(values.url.endsWith('/') ? values.url : values.url + '/')
  : new URL(`http://127.0.0.1:${server.address().port}/accessibility/`);
if (!['http:', 'https:'].includes(base.protocol))
  throw new Error('Expected an HTTP(S) URL.');
const originalChrome = process.env.CHROME_PATH;
// Chrome Launcher uses this documented path; never inspect or reuse a personal browser profile.
process.env.CHROME_PATH = chromium.executablePath();
const rows = [];
try {
  for (const [name, path] of pages)
    for (let run = 1; run <= runs; run++) {
      const output = fileURLToPath(new URL(`${name}-${run}.json`, folder));
      const url = new URL(path, base).href;
      const args = [
        'exec',
        '--yes',
        '--package=lighthouse@13.6.0',
        '--',
        'lighthouse',
        url,
        '--quiet',
        '--chrome-flags=--headless --disable-extensions',
        '--no-enable-error-reporting',
        '--only-categories=performance,accessibility,best-practices,seo',
        '--output=json',
        `--output-path=${output}`,
      ];
      if (values.desktop) args.push('--preset=desktop');
      await new Promise((resolve, reject) => {
        const child = spawn('npm', args, { stdio: 'inherit' });
        child.once('error', reject);
        child.once('exit', (code) =>
          code === 0
            ? resolve()
            : reject(new Error(`Lighthouse ${name} exited ${code}`)),
        );
      });
      const result = JSON.parse(await readFile(output, 'utf8'));
      await writeFile(
        output,
        await format(JSON.stringify(result), { parser: 'json' }),
      );
      const scores = Object.fromEntries(
        Object.entries(result.categories).map(([key, value]) => [
          key,
          value.score * 100,
        ]),
      );
      const metrics = Object.fromEntries(
        [
          'first-contentful-paint',
          'largest-contentful-paint',
          'total-blocking-time',
          'cumulative-layout-shift',
          'total-byte-weight',
        ].map((key) => [key, result.audits[key]?.numericValue ?? null]),
      );
      rows.push({
        name,
        run,
        url,
        mode: values.desktop ? 'desktop' : 'mobile',
        version: result.lighthouseVersion,
        scores,
        metrics,
      });
      console.log('SITE_LIGHTHOUSE', JSON.stringify(rows.at(-1)));
    }
  await writeFile(
    new URL('summary.json', folder),
    await format(
      JSON.stringify({
        rows,
        notes: [
          'Pinned ephemeral Lighthouse; no new root dependency or runtime code.',
          'Default Lighthouse mobile simulation unless --desktop is explicit; raw configuration is retained per page.',
          'Each run launches a fresh browser profile with extensions disabled. All samples are retained; compare repeated runs, not a single best score.',
          'Performance scores depend on the machine, network and hosting. GitHub Pages cache headers cannot be changed by this build.',
          '404 intentionally uses noindex and is excluded from the sitemap.',
        ],
      }),
      { parser: 'json' },
    ),
  );
} finally {
  if (originalChrome === undefined) delete process.env.CHROME_PATH;
  else process.env.CHROME_PATH = originalChrome;
  if (server) await new Promise((resolve) => server.close(resolve));
}
