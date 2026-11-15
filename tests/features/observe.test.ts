import { afterEach, expect, it, vi } from 'vitest';
import { observeContent } from '../../src/features/observe';
import { createScope } from '../../src/core/scope';
const cleanups: (() => void)[] = [];
afterEach(() => {
  cleanups.forEach((fn) => fn());
  cleanups.length = 0;
  document.body.replaceChildren();
  document.documentElement.removeAttribute('class');
  document.documentElement.removeAttribute('style');
  document
    .querySelectorAll('[data-accessiblit-style]')
    .forEach((n) => n.remove());
  vi.restoreAllMocks();
});
function setup(refresh: () => void) {
  const scope = createScope(() => {});
  cleanups.push(scope.dispose);
  return observeContent(
    { document, listen: scope.listen, onCleanup: scope.add },
    refresh,
  );
}
const tick = async () => {
  await Promise.resolve();
  await Promise.resolve();
};
it('ignores owned changes but refreshes external content, styles, resize and load', async () => {
  const refresh = vi.fn(() =>
    document.documentElement.classList.add('accessiblit-example'),
  );
  document.documentElement.classList.add('accessiblit-font-size');
  document.documentElement.style.setProperty('--accessiblit-example', '2');
  const stop = setup(refresh);
  const host = document.createElement('div');
  host.setAttribute('data-accessiblit-host', '');
  document.body.append(host);
  const style = document.createElement('style');
  style.setAttribute('data-accessiblit-style', '');
  document.head.append(style);
  style.textContent = 'body{}';
  await tick();
  expect(refresh).not.toHaveBeenCalled();
  const p = document.createElement('p');
  p.textContent = 'New';
  document.body.append(p);
  await tick();
  expect(refresh).toHaveBeenCalledTimes(1);
  document.documentElement.classList.add('owner-theme');
  await tick();
  expect(refresh).toHaveBeenCalledTimes(2);
  p.hidden = true;
  await tick();
  expect(refresh).toHaveBeenCalledTimes(3);
  document.documentElement.style.color = 'red';
  await tick();
  expect(refresh).toHaveBeenCalledTimes(4);
  window.dispatchEvent(new Event('resize'));
  expect(refresh).toHaveBeenCalledTimes(5);
  const link = document.createElement('link');
  document.head.append(link);
  await tick();
  link.dispatchEvent(new Event('load'));
  expect(refresh).toHaveBeenCalledTimes(7);
  link.remove();
  await tick();
  stop();
  const count = refresh.mock.calls.length;
  document.body.append(document.createElement('p'));
  window.dispatchEvent(new Event('resize'));
  await tick();
  expect(refresh).toHaveBeenCalledTimes(count);
});
it('contains callback errors and logs once', async () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  setup(() => {
    throw new Error('feature');
  });
  window.dispatchEvent(new Event('resize'));
  window.dispatchEvent(new Event('resize'));
  expect(warn).toHaveBeenCalledTimes(1);
});
it('observes text data edits while ignoring private text and stopping cleanly', async () => {
  const p = document.createElement('p');
  const text = document.createTextNode('');
  p.append(text);
  const host = document.createElement('div');
  host.setAttribute('data-accessiblit-host', '');
  const privateText = document.createTextNode('');
  host.append(privateText);
  document.body.append(p, host);
  const refresh = vi.fn();
  const stop = setup(refresh);
  privateText.appendData('Private');
  await tick();
  expect(refresh).not.toHaveBeenCalled();
  text.appendData('Visible');
  await tick();
  expect(refresh).toHaveBeenCalledTimes(1);
  text.data = 'Revised';
  await tick();
  expect(refresh).toHaveBeenCalledTimes(2);
  stop();
  text.data = 'After cleanup';
  await tick();
  expect(refresh).toHaveBeenCalledTimes(2);
});
it('does not acquire resources for a document without a Window', () => {
  const listen = vi.fn();
  const stop = observeContent(
    {
      document: document.implementation.createHTMLDocument('Detached'),
      listen,
      onCleanup: () => {},
    },
    () => {},
  );
  stop();
  expect(listen).not.toHaveBeenCalled();
});

it('refreshes for another feature while ignoring temporary root-state round trips', async () => {
  const root = document.documentElement;
  root.classList.add('accessiblit-font-size');
  const refresh = vi.fn(() => {
    root.classList.remove('accessiblit-font-size');
    root.classList.add('accessiblit-font-size');
  });
  setup(refresh);
  root.style.setProperty('--accessiblit-content-scale', '2');
  await tick();
  expect(refresh).toHaveBeenCalledTimes(1);
  root.style.setProperty('--accessiblit-content-scale', '2');
  await tick();
  expect(refresh).toHaveBeenCalledTimes(1);
});

it('reconciles synchronously at parser completion and releases the boundary listener', () => {
  const state = vi.spyOn(document, 'readyState', 'get');
  state.mockReturnValue('loading');
  const refresh = vi.fn();
  const sampled: number[] = [];
  const sample = () => sampled.push(refresh.mock.calls.length);
  // An owner listener registered first must still observe reconciled content.
  document.addEventListener('readystatechange', sample);
  cleanups.push(() => document.removeEventListener('readystatechange', sample));
  const stop = setup(refresh);
  document.dispatchEvent(new Event('readystatechange'));
  expect(refresh).not.toHaveBeenCalled();
  state.mockReturnValue('interactive');
  document.dispatchEvent(new Event('readystatechange'));
  expect(refresh).toHaveBeenCalledTimes(1);
  expect(sampled).toEqual([0, 1]);
  state.mockReturnValue('complete');
  document.dispatchEvent(new Event('readystatechange'));
  expect(refresh).toHaveBeenCalledTimes(1);
  stop();
  state.mockReturnValue('interactive');
  document.dispatchEvent(new Event('readystatechange'));
  expect(refresh).toHaveBeenCalledTimes(1);
});
