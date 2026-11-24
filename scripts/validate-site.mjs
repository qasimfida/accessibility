import { execFile } from 'node:child_process';
import { mkdir, readdir, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { format } from 'prettier';

const validator = process.argv[2];
if (!validator)
  throw new Error(
    'Pass the path to the official Nu checker executable: npm run validate:site -- /path/to/vnu',
  );
const root = resolve('site/dist');
const folder = resolve('reports/assets/site-performance');
const files = [];
// Pass explicit document types: the checker must never parse fonts or images as HTML.
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (['.html', '.css', '.svg'].includes(extname(path)))
      files.push(path);
  }
}
await collect(root);
if (!files.some((path) => path.endsWith('index.html')))
  throw new Error('Build the site before validating it.');
let output;
let exitCode = 0;
try {
  output = await promisify(execFile)(
    validator,
    [
      '--stdout',
      '--format',
      'json',
      '--also-check-css',
      '--also-check-svg',
      ...files.sort(),
    ],
    { maxBuffer: 20 * 1024 * 1024 },
  );
} catch (error) {
  // Retain the checker's real failures as evidence; never filter diagnostics to get a pass.
  if (!error.stdout) throw error;
  output = error;
  exitCode = 1;
}
const result = JSON.parse(output.stdout);
const errors = result.messages.filter((message) => message.type === 'error');
const warnings = result.messages.filter(
  (message) => message.type === 'warning' || message.subType === 'warning',
);
await mkdir(folder, { recursive: true });
await writeFile(
  join(folder, 'standards.json'),
  await format(
    JSON.stringify({
      date: new Date().toISOString(),
      files: files.map((path) => relative(root, path)),
      errors: errors.length,
      warnings: warnings.length,
      ...result,
    }),
    { parser: 'json' },
  ),
);
console.log(
  `Nu ${result.version}: ${files.length} HTML/CSS/SVG files; ${errors.length} errors, ${warnings.length} warnings.`,
);
process.exitCode = exitCode || (errors.length || warnings.length ? 1 : 0);
