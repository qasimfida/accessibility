import { expect, it, vi } from 'vitest';
import { keepPanelFocusVisible } from '../../src/ui/focus';

it('keeps focus clear of fixed chrome by scrolling the independent content viewport', () => {
  const panel = document.createElement('section');
  const body = document.createElement('div');
  const target = document.createElement('button');
  panel.append(body);
  body.append(target);
  vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 440, 760),
  );
  vi.spyOn(body, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 220, 440, 460),
  );
  Object.defineProperties(body, {
    scrollHeight: { value: 3000 },
    clientHeight: { value: 460 },
  });
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(20, 200, 44, 44),
  );
  body.scrollTop = 100;
  keepPanelFocusVisible(panel, body, target);
  expect(body.scrollTop).toBe(70);
  expect(panel.scrollTop).toBe(0);
  vi.mocked(target.getBoundingClientRect).mockReturnValue(
    new DOMRect(20, 660, 44, 44),
  );
  keepPanelFocusVisible(panel, body, target);
  expect(body.scrollTop).toBe(104);
});

it('uses the outer scroller for compact layouts and header controls', () => {
  const panel = document.createElement('section');
  const body = document.createElement('div');
  const target = document.createElement('button');
  panel.append(target, body);
  vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(0, 0, 304, 176),
  );
  vi.spyOn(target, 'getBoundingClientRect').mockReturnValue(
    new DOMRect(20, 180, 44, 44),
  );
  keepPanelFocusVisible(panel, body, target);
  expect(panel.scrollTop).toBe(58);
});
