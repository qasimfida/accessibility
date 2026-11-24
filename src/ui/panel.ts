import { createBrand } from './brand';
import { createOptionStepper } from './option-stepper';
import { createIcon } from './icon';
import { createReporter } from '../core/diagnostics';
import { createScope } from '../core/scope';
import { createToggle } from './toggle';
import { createStepper } from './stepper';
import { createRadios } from './radios';
import { makeButton } from './presentation';
import type { Feature, FeatureId, Messages } from '../core/types';
import type { ControlContext, RenderedControl } from './control-types';

/** State callbacks keep the panel independent from the concrete store and feature implementations. */
export interface PanelActions {
  getState(): Record<FeatureId, unknown>;
  setFeature(id: FeatureId, value: unknown): void;
  close(): void;
  reset(): void;
}

function render(context: ControlContext): RenderedControl {
  switch (context.feature.control.type) {
    case 'toggle':
      return createToggle(context);
    case 'range':
      return createStepper(context);
    case 'select':
      return context.feature.control.presentation === 'stepper'
        ? createOptionStepper(context)
        : createRadios(context);
    default:
      throw new Error('Unknown control type');
  }
}

/** Registry metadata generates every control while headings preserve the three stable groups. */
export function createPanel(
  doc: Document,
  features: readonly Feature[],
  messages: Messages,
  prefix: string,
  actions: PanelActions,
  deferControls = false,
) {
  const report = createReporter();
  const scope = createScope(() => report('panel', 'Panel cleanup failed.'));
  const element = doc.createElement('section');
  element.className = 'accessiblit-surface accessiblit-panel';
  element.id = `${prefix}-panel`;
  element.hidden = true;
  element.setAttribute('role', 'dialog');
  element.setAttribute('aria-modal', 'false');
  // An explicit name avoids Firefox's post-audit crash when resolving a hidden title reference.
  element.setAttribute('aria-label', messages.panelTitle);
  element.setAttribute('aria-describedby', `${prefix}-intro`);
  scope.add(() => element.remove());
  const header = doc.createElement('div');
  header.className = 'accessiblit-header';
  const title = doc.createElement('h2');
  title.id = `${prefix}-title`;
  title.textContent = messages.panelTitle;
  const closeButton = makeButton(doc, messages.close);
  closeButton.className = 'accessiblit-close';
  closeButton.dataset.tooltip = messages.close;
  const closeText = doc.createElement('span');
  closeText.className = 'accessiblit-step-text';
  closeText.textContent = messages.close;
  closeButton.replaceChildren(
    closeText,
    createIcon(doc, ['M6 6l12 12M18 6 6 18']),
  );
  const emblem = doc.createElement('span');
  emblem.className = 'accessiblit-emblem';
  emblem.setAttribute('aria-hidden', 'true');
  const brand = doc.createElement('span');
  brand.className = 'accessiblit-brand';
  brand.textContent = 'Accessibility';
  brand.setAttribute('translate', 'no');
  header.append(emblem, closeButton, title, brand);
  const intro = doc.createElement('p');
  intro.id = `${prefix}-intro`;
  intro.className = 'accessiblit-intro';
  intro.textContent = messages.panelDescription;
  header.append(intro);
  const body = doc.createElement('div');
  body.className = 'accessiblit-body';
  // Firefox otherwise inserts a redundant tab stop before the first native control.
  body.tabIndex = -1;
  const footer = doc.createElement('div');
  footer.className = 'accessiblit-footer';
  element.append(header, body, footer);
  scope.listen(closeButton, 'click', actions.close);
  const records = new Map<FeatureId, RenderedControl>();
  const resetButton = makeButton(doc, messages.reset);
  let prepared = false;
  const prepare = () => {
    if (prepared || !scope.active) return;
    prepared = true;
    emblem.append(createBrand(doc));
    const groups = [
      ['content', 'contentGroup'],
      ['colour', 'colourGroup'],
      ['navigation', 'navigationGroup'],
    ] as const;
    for (const [id, key] of groups) {
      const group = doc.createElement('section');
      group.className = 'accessiblit-group';
      group.setAttribute('aria-labelledby', `${prefix}-${id}`);
      const heading = doc.createElement('h3');
      heading.id = `${prefix}-${id}`;
      heading.textContent = messages[key];
      group.append(heading);
      if (id === 'colour') {
        const note = doc.createElement('p');
        note.className = 'accessiblit-forced-colours-note';
        note.textContent = messages.forcedColoursNote ?? '';
        group.append(note);
      }
      for (const feature of features.filter(
        (feature) => feature.group === id,
      )) {
        try {
          if (records.has(feature.id)) continue;
          const control = render({
            document: doc,
            feature,
            messages,
            prefix,
            getValue: () => actions.getState()[feature.id],
            setValue: (value) => actions.setFeature(feature.id, value),
          });
          scope.add(control.destroy);
          control.update(actions.getState()[feature.id]);
          records.set(feature.id, control);
          group.append(control.element);
        } catch {
          report(
            `control:${feature.id}`,
            `Control for ${feature.id} could not render; other controls remain available.`,
          );
        }
      }
      if (!features.some((feature) => feature.group === id)) {
        const empty = doc.createElement('p');
        empty.className = 'accessiblit-empty';
        empty.textContent = messages.emptyGroup;
        group.append(empty);
      }
      body.append(group);
    }
    resetButton.className = 'accessiblit-reset';
    footer.append(resetButton);
    scope.listen(resetButton, 'click', actions.reset);
  };
  if (!deferControls) prepare();
  return {
    element,
    body,
    closeButton,
    resetButton,
    prepare,
    update(state: Record<FeatureId, unknown>) {
      if (scope.active)
        for (const [id, control] of records) control.update(state[id]);
    },
    destroy: scope.dispose,
  };
}
