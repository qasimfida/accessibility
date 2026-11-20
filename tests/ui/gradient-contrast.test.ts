import { expect, it } from 'vitest';
import { bannerContrast } from '../../e2e/helpers/gradient-contrast';

it('measures the foreground instead of assuming white banner text', () => {
  const white = 'linear-gradient(rgb(255,255,255),rgb(255,255,255))';
  expect(bannerContrast(white, 'rgb(0,0,0)')).toBe(21);
  expect(bannerContrast(white, 'rgb(255,255,255)')).toBe(1);
  const pale = 'linear-gradient(rgb(255,255,255),rgb(241,243,247))';
  expect(bannerContrast(pale, 'rgb(66,86,108)')).toBeGreaterThan(4.5);
});

it('keeps conservative bounds for translucent layers and rejects missing colours', () => {
  expect(
    bannerContrast(
      'radial-gradient(rgba(255,255,255,0.1),rgba(0,0,0,0)),linear-gradient(rgb(25,75,197),rgb(37,99,235))',
      'rgb(255,255,255)',
    ),
  ).toBeLessThan(4.5);
  expect(() => bannerContrast('none', 'rgb(0,0,0)')).toThrow();
  expect(() =>
    bannerContrast('linear-gradient(rgb(0,0,0),rgb(0,0,0))', 'invalid'),
  ).toThrow();
});
