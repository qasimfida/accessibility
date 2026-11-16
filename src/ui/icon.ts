/** Registry-owned path data keeps decorative icons local and out of accessible names. */
export function createIcon(
  doc: Document,
  paths: readonly string[],
): SVGSVGElement {
  const ns = 'http://www.w3.org/2000/svg';
  const icon = doc.createElementNS(ns, 'svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('width', '28');
  icon.setAttribute('height', '28');
  icon.setAttribute('aria-hidden', 'true');
  icon.setAttribute('focusable', 'false');
  icon.setAttribute('fill', 'none');
  icon.setAttribute('stroke', 'currentColor');
  icon.setAttribute('stroke-width', '1.8');
  icon.setAttribute('stroke-linecap', 'round');
  icon.setAttribute('stroke-linejoin', 'round');
  for (const data of paths) {
    const path = doc.createElementNS(ns, 'path');
    path.setAttribute('d', data);
    icon.append(path);
  }
  return icon;
}
