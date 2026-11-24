import type { Feature } from '../core/types';
import { cssEffect } from './effect';
import { NAVIGATION_SELECTOR, ROOT_SELECTOR } from './dom';
/** Embedded, original two-tone pointers never request an image; native auto remains the CSP fallback. */
export const bigCursor: Feature = {
  id: 'bigCursor',
  group: 'navigation',
  label: 'Larger cursor',
  description: 'Choose a larger pointer for a mouse or trackpad.',
  requiresFinePointer: true,
  control: {
    type: 'select',
    values: [false, true, 2],
    labels: ['Off', 'Large', 'Extra large'],
    retainIcon: true,
    optionIcons: [
      ['M8 6v12l4-4 3 6 2-1-3-6h5L8 6Z'],
      ['M5 3v17l5-5 4 7 3-2-4-7h7L5 3Z'],
      ['M3 2v20l6-6 4 7 4-2-4-7h9L3 2Z'],
    ],
  },
  apply(value, api) {
    if (value !== true && value !== 2) return () => {};
    const size = value === 2 ? 48 : 32;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><path d="M3 2v25l7-7 5 10 5-2-5-10h10Z" fill="white" stroke="black" stroke-width="2" stroke-linejoin="round"/></svg>`;
    const uri = 'data:image/svg+xml,' + encodeURIComponent(svg);
    return cssEffect(
      api,
      'accessiblit-big-cursor',
      {},
      `@media screen and (any-pointer:fine) and (forced-colors:none){${ROOT_SELECTOR}.accessiblit-big-cursor ${NAVIGATION_SELECTOR}{cursor:url("${uri}") ${size === 48 ? '4 3' : '3 2'},auto!important}}`,
    );
  },
};
