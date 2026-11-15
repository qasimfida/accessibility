import { expect, test } from '@playwright/test';

test('parser completion reconciles text before delayed mutation delivery', async ({
  page,
}) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'accessiblit:v1',
      JSON.stringify({ version: 1, state: { fontSize: 120 } }),
    );
    const NativeObserver = window.MutationObserver;
    const pending: (() => void)[] = [];
    // Reproduce the observed interactive-frame gap without relying on runner speed.
    window.MutationObserver = class extends NativeObserver {
      constructor(callback: MutationCallback) {
        super((records, observer) => {
          if (document.readyState !== 'complete')
            pending.push(() => callback(records, observer));
          else callback(records, observer);
        });
      }
    };
    document.addEventListener('readystatechange', () => {
      if (document.readyState === 'interactive')
        queueMicrotask(() => {
          const probe = document.querySelector('.demo-copy p');
          Reflect.set(
            window,
            'parserBoundaryFont',
            probe ? parseFloat(getComputedStyle(probe).fontSize) : null,
          );
        });
      else if (document.readyState === 'complete') {
        for (const deliver of pending.splice(0)) deliver();
      }
    });
  });
  await page.goto('');
  const fontSize = await page.evaluate(
    () => Reflect.get(window, 'parserBoundaryFont') as number,
  );
  expect(fontSize).toBeCloseTo(19.2, 1);
  console.log(
    'SITE_PARSER_BOUNDARY',
    JSON.stringify({ project: test.info().project.name, fontSize }),
  );
});
