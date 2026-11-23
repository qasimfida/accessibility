import { createBrand } from './brand';
import { createReporter } from '../core/diagnostics';
import { createScope } from '../core/scope';
import { makeButton } from './presentation';
import type { Messages } from '../core/types';

/** An original, decorative person glyph leaves the native button's name unambiguous. */
export function createLauncher(
  doc: Document,
  messages: Messages,
  panelId: string,
  toggle: () => void,
) {
  const element = makeButton(doc, '');
  element.className = 'accessiblit-surface accessiblit-launcher';
  element.setAttribute('aria-label', messages.launcher);
  element.setAttribute('aria-expanded', 'false');
  element.setAttribute('aria-controls', panelId);
  const icon = createBrand(doc);
  icon.setAttribute('width', '26');
  icon.setAttribute('height', '26');
  element.append(icon);
  const report = createReporter();
  const scope = createScope(() =>
    report('launcher', 'Launcher cleanup failed.'),
  );
  scope.add(() => element.remove());
  scope.listen(element, 'click', toggle);
  return {
    element,
    update(expanded: boolean) {
      if (scope.active) element.setAttribute('aria-expanded', String(expanded));
    },
    destroy: scope.dispose,
  };
}
