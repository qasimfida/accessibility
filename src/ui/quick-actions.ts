import { createIcon } from './icon';
import { featureText, makeButton } from './presentation';
import { createScope } from '../core/scope';
import type { Feature, FeatureId, Messages } from '../core/types';
import type { PanelActions } from './panel';

/** Registry opt-ins expose four frequent actions without duplicating their state. */
export function createQuickActions(
  doc: Document,
  features: readonly Feature[],
  messages: Messages,
  actions: PanelActions,
) {
  const scope = createScope(() => {});
  const element = doc.createElement('div');
  element.className = 'accessiblit-quick-actions';
  element.setAttribute('role', 'group');
  const name = messages.quickControls ?? 'Quick controls';
  element.setAttribute('aria-label', name);
  const entries = features
    .filter(
      (feature) => feature.quickAccess && feature.control.type === 'toggle',
    )
    .slice(0, 4)
    .map((feature) => {
      const label = featureText(feature, messages).label;
      const button = makeButton(doc, '');
      button.className = 'accessiblit-quick-action';
      button.setAttribute('aria-label', `${name}: ${label}`);
      button.dataset.tooltip = label;
      button.append(createIcon(doc, feature.icon ?? ['M6 12h12']));
      scope.listen(button, 'click', () =>
        actions.setFeature(feature.id, actions.getState()[feature.id] !== true),
      );
      element.append(button);
      return { id: feature.id, button };
    });
  element.hidden = entries.length === 0;
  scope.add(() => element.remove());
  return {
    element,
    update(state: Record<FeatureId, unknown>) {
      if (scope.active)
        for (const { id, button } of entries)
          button.setAttribute('aria-pressed', String(state[id] === true));
    },
    destroy: scope.dispose,
  };
}
