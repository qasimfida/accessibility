import { expect, it } from 'vitest';
import { createIcon } from '../../src/ui/icon';
import { createFeatures } from '../../src/features';
import { resolveOptions } from '../../src/core/options';

it('gives every built-in feature original decorative metadata', () => {
  const features = createFeatures(resolveOptions());
  expect(features).toHaveLength(18);
  for (const feature of features) {
    expect(feature.icon?.length).toBeGreaterThan(0);
    const icon = createIcon(document, feature.icon!);
    expect(icon.namespaceURI).toBe('http://www.w3.org/2000/svg');
    expect(icon.getAttribute('aria-hidden')).toBe('true');
    expect(icon.getAttribute('focusable')).toBe('false');
    expect(icon.querySelectorAll('path')).toHaveLength(feature.icon!.length);
    expect(icon.textContent).toBe('');
  }
});
