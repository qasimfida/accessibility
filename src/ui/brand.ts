import { createIcon } from './icon';

/** Single editable source for the original open-orbit accessibility mark. */
export const BRAND_PATH_DATA =
  'M8 3a9.5 9.5 0 1 0 8 0|M10.5 7a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z|M6 11l6 1 6-1M12 12v4m0 0-3 4m3-4 3 4';

/** Inline vectors keep widget branding independent from networks and host assets. */
export function createBrand(doc: Document): SVGSVGElement {
  return createIcon(doc, BRAND_PATH_DATA.split('|'));
}
