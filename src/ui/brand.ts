import { createIcon } from './icon';

/** Single editable source for the original open-orbit accessibility mark. */
export const BRAND_PATH_DATA =
  'M17 3.5a9.5 9.5 0 1 0 3.5 4|M10.5 6.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z|M6.5 10.5l5.5 1 5.5-1M12 11.5v4m0 0-3.5 4m3.5-4 3.5 4';

/** Inline vectors keep widget branding independent from networks and host assets. */
export function createBrand(doc: Document): SVGSVGElement {
  return createIcon(doc, BRAND_PATH_DATA.split('|'));
}
