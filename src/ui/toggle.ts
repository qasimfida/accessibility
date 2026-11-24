import { controlShell, makeButton } from './presentation';
import type { ControlContext, RenderedControl } from './control-types';

/** A stable button name plus aria-pressed exposes state without color-only cues. */
export function createToggle(context: ControlContext): RenderedControl {
  const shell = controlShell(context);
  shell.element.classList.add('accessiblit-binary-feature');
  const button = makeButton(context.document, '');
  button.className = 'accessiblit-toggle';
  // Gecko can retain stale external name references after palette rollback.
  button.setAttribute('aria-label', shell.text.label);
  button.setAttribute('aria-describedby', shell.descriptionId);
  shell.element.append(button);
  shell.scope.listen(button, 'click', () =>
    context.setValue(context.getValue() !== true),
  );
  const update = (value: unknown) => {
    if (!shell.scope.active) return;
    button.setAttribute('aria-pressed', String(value === true));
  };
  update(context.getValue());
  return { element: shell.element, update, destroy: shell.scope.dispose };
}
