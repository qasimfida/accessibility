import { expect, test } from '@playwright/test';
import { loadSite } from './helpers';

test('scales text data filled after an empty node before its first frame', async ({
  page,
}, info) => {
  await loadSite(page, '');
  await page
    .getByRole('button', { name: 'Open live demo options', exact: true })
    .click();
  const increase = page.getByRole('button', {
    name: 'Increase Font size',
    exact: true,
  });
  await increase.click();
  await increase.click();
  await expect(page.getByRole('status')).toHaveText('Font size 120 percent');
  await page.getByRole('button', { name: 'Close', exact: true }).click();
  const probe = page.locator('[data-site-sample]').first();
  await probe.evaluate((element) =>
    element.replaceChildren(document.createTextNode('')),
  );
  // Semantic blocks retain their baseline even while the parser has not filled their text.
  await expect(probe).toHaveAttribute('data-accessiblit-font-size', /.+/);
  const frames = await probe.evaluate(
    (element) =>
      new Promise<number[]>((resolve) => {
        const samples: number[] = [];
        const sample = () => {
          samples.push(parseFloat(getComputedStyle(element).fontSize));
          if (samples.length === 5) resolve(samples);
          else requestAnimationFrame(sample);
        };
        requestAnimationFrame(sample);
        // Parsers and frameworks may fill an existing Text node without a childList mutation.
        (element.firstChild as Text).appendData(
          'Text filled without inserting another node.',
        );
      }),
  );
  console.log(
    'SITE_TEXT_DATA_FRAME',
    JSON.stringify({ project: info.project.name, frames }),
  );
  for (const fontSize of frames) expect(fontSize).toBeCloseTo(19.2, 1);
});
