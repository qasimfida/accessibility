import { createIcon } from './icon';

/** Single editable source for the original layered accessibility mark. */
export const BRAND_PATH_DATA =
  'M12 3 3 7.5 12 12l9-4.5L12 3Z|M3 12l9 4.5 9-4.5|M3 16.5l9 4.5 9-4.5';

/** Inline vectors keep widget branding independent from networks and host assets. */
export function createBrand(doc: Document): SVGSVGElement {
  return createIcon(doc, BRAND_PATH_DATA.split('|'));
}
