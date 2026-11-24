import { createScope } from '../core/scope';
import { createSheet } from '../core/sheet';

/** A lazy, owned top-layer tooltip escapes scrolling cards without covering its trigger. */
export function createTooltips(
  root: ShadowRoot,
  panel: HTMLElement,
  nonce?: string,
) {
  const doc = root.ownerDocument;
  const view = doc.defaultView!;
  const scope = createScope(() => {});
  const sheet = createSheet(root, nonce);
  const tip = doc.createElement('span');
  tip.className = 'accessiblit-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.setAttribute('popover', 'manual');
  const region = doc.createElement('aside');
  region.setAttribute(
    'aria-label',
    panel.getAttribute('aria-label') ?? 'Accessibility',
  );
  region.hidden = true;
  region.append(tip);
  root.append(region);
  let target: Element | undefined;
  const hide = () => {
    target = undefined;
    try {
      tip.hidePopover();
    } catch {
      /* Already closed during teardown. */
    }
    sheet.clear();
    region.hidden = true;
  };
  const show = (event: Pick<Event, 'target'>) => {
    const element = event.target;
    if (!(element instanceof view.Element)) return;
    const button = element.closest<HTMLElement>('[data-tooltip]');
    if (!button || button === target) return;
    hide();
    target = button;
    region.hidden = false;
    tip.textContent = button.dataset.tooltip ?? '';
    tip.setAttribute('aria-label', tip.textContent);
    const css =
      '.accessiblit-tooltip{all:initial;position:fixed;inset:auto;margin:0;padding:8px 12px;max-inline-size:220px;box-sizing:border-box;border:1px solid transparent;border-radius:8px;font:14px/1.5 Arial,system-ui,sans-serif;overflow-wrap:anywhere;color-scheme:var(--accessiblit-color-scheme,light dark);background:light-dark(#000,#fff);color:light-dark(#fff,#000);pointer-events:auto} @media(forced-colors:active){.accessiblit-tooltip{background:Canvas;color:CanvasText;border-color:CanvasText}}';
    sheet.set(css);
    try {
      tip.showPopover();
    } catch {
      hide();
      return;
    }
    const rect = button.getBoundingClientRect();
    const box = tip.getBoundingClientRect();
    const viewport = view.visualViewport;
    const x = viewport?.offsetLeft ?? 0,
      y = viewport?.offsetTop ?? 0;
    const width = viewport?.width ?? view.innerWidth,
      height = viewport?.height ?? view.innerHeight;
    const left = Math.max(
      x + 8,
      Math.min(rect.left, x + width - box.width - 8),
    );
    const top =
      rect.bottom + box.height + 14 <= y + height
        ? rect.bottom + 6
        : Math.max(y + 8, rect.top - box.height - 6);
    sheet.set(`${css}.accessiblit-tooltip{left:${left}px;top:${top}px}`);
  };
  const leave = (event: Event) => {
    // Pointer movement must not dismiss a hint that keyboard focus still owns.
    if (event.type === 'pointerout' && target?.contains(root.activeElement))
      return;
    const next = (event as MouseEvent).relatedTarget;
    if (
      next instanceof view.Node &&
      (target?.contains(next) || tip.contains(next))
    )
      return;
    hide();
  };
  scope.listen(root, 'pointerout', leave);
  scope.listen(root, 'focusout', leave);
  scope.listen(panel, 'scroll', hide, { capture: true });
  scope.listen(view, 'resize', hide);
  if (view.visualViewport) {
    scope.listen(view.visualViewport, 'resize', hide);
    scope.listen(view.visualViewport, 'scroll', hide);
  }
  scope.add(() => {
    hide();
    sheet.destroy();
    region.remove();
  });
  return { show, hide, destroy: scope.dispose };
}

/** Allocate hint DOM and CSS only after a labelled action receives pointer or keyboard attention. */
export function createTooltipTriggers(
  root: ShadowRoot,
  panel: HTMLElement,
  nonce?: string,
) {
  const scope = createScope(() => {});
  let hints: ReturnType<typeof createTooltips> | undefined;
  const view = root.ownerDocument.defaultView!;
  let focusFrame: number | undefined;
  scope.add(() => {
    if (focusFrame !== undefined) view.cancelAnimationFrame(focusFrame);
  });
  const display = (target: EventTarget | null) => {
    if (!(target instanceof view.Element) || !target.closest('[data-tooltip]'))
      return;
    if (!hints) {
      hints = createTooltips(root, panel, nonce);
      scope.add(hints.destroy);
    }
    hints.show({ target });
  };
  scope.listen(root, 'pointerover', (event) => display(event.target));
  scope.listen(root, 'focusin', (event) => {
    const target = event.target;
    if (focusFrame !== undefined) view.cancelAnimationFrame(focusFrame);
    // Allow focus scrolling to settle before its scroll event dismisses the new hint.
    focusFrame = view.requestAnimationFrame(() => {
      focusFrame = undefined;
      if (scope.active && root.activeElement === target) display(target);
    });
  });
  return {
    hide: () => {
      if (focusFrame !== undefined) view.cancelAnimationFrame(focusFrame);
      focusFrame = undefined;
      hints?.hide();
    },
    destroy: scope.dispose,
  };
}
