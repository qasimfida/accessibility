import { createIcon } from './icon';
import { controlShell, valueText } from './presentation';
import type { ControlContext, RenderedControl } from './control-types';

/** Native radios provide the expected arrow/Space behavior and one tab stop per group. */
export function createRadios(context: ControlContext): RenderedControl {
  const control = context.feature.control;
  if (
    control.type !== 'select' ||
    !Array.isArray(control.values) ||
    !control.values.length ||
    control.values.some(
      (value) =>
        typeof value !== 'string' &&
        typeof value !== 'boolean' &&
        !Number.isFinite(value),
    ) ||
    new Set(control.values).size !== control.values.length
  )
    throw new Error('Invalid option metadata');
  const shell = controlShell(context);
  const group = context.document.createElement('div');
  group.className = 'accessiblit-options';
  group.setAttribute('role', 'radiogroup');
  group.setAttribute('aria-labelledby', shell.labelId);
  group.setAttribute('aria-describedby', shell.descriptionId);
  const inputs = control.values.map((value, index) => {
    const label = context.document.createElement('label');
    label.className = 'accessiblit-choice';
    if (control.retainIcon)
      label.classList.add('accessiblit-choice--retain-icon');
    if (control.iconOnly) label.classList.add('accessiblit-choice--icon-only');
    const input = context.document.createElement('input');
    input.type = 'radio';
    input.name = `${context.prefix}-${context.feature.id}`;
    input.id = `${input.name}-${index}`;
    input.value = String(value);
    const text = context.document.createElement('span');
    text.textContent = valueText(context.feature, value, context.messages);
    if (control.iconOnly) {
      text.className = 'accessiblit-step-text';
      input.setAttribute('aria-label', text.textContent);
      label.dataset.tooltip = text.textContent;
    }
    const mark = context.document.createElement('span');
    mark.className = 'accessiblit-choice-icon';
    mark.setAttribute('aria-hidden', 'true');
    mark.append(
      createIcon(
        context.document,
        control.optionIcons?.[index] ?? context.feature.icon ?? ['M6 12h12'],
      ),
    );
    label.append(input, mark, text);
    group.append(label);
    shell.scope.listen(input, 'change', () => {
      if (input.checked) context.setValue(value);
    });
    return { input, value };
  });
  shell.element.append(group);
  const update = (value: unknown) => {
    if (shell.scope.active)
      for (const entry of inputs)
        entry.input.checked = Object.is(value, entry.value);
  };
  update(context.getValue());
  return { element: shell.element, update, destroy: shell.scope.dispose };
}
