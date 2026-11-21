import { inView } from 'motion';
import { animate } from 'motion/mini';

/** Enhance the static landing page without hiding content or moving focused controls. */
export function startSiteMotion(doc: Document): () => void {
  const view = doc.defaultView;
  if (!view) return () => {};

  const reduce = view.matchMedia('(prefers-reduced-motion: reduce)');
  const forced = view.matchMedia('(forced-colors: active)');
  const print = view.matchMedia('print');
  const active = new Map<ReturnType<typeof animate>, () => void>();
  const visited = new WeakSet<Element>();
  let stopObserving: (() => void) | undefined;
  let disposed = false;

  const cancel = () => {
    for (const [animation, restore] of active) {
      animation.cancel();
      restore();
    }
    active.clear();
  };
  const disabled = () =>
    reduce.matches ||
    forced.matches ||
    print.matches ||
    doc.hidden ||
    doc.documentElement.classList.contains('accessiblit-stop-animations');

  const update = () => {
    if (disposed) return;
    if (disabled()) {
      stopObserving?.();
      stopObserving = undefined;
      cancel();
      return;
    }
    if (stopObserving) return;
    const elements = doc.querySelectorAll<HTMLElement>(
      '.product-hero h1, .page-hero h1, .section-heading, .journey-card, ' +
        '.benefit-card, .focus-scene, .format-grid, .principle-quote, ' +
        '.privacy-visual, .free-plan, ' +
        'main.wrap > h1, main.wrap > section, .page-grid > article, .mosaic-tile, .inner-band .wrap',
    );
    const visit = (element: Element) => {
      if (disabled() || visited.has(element)) return;
      visited.add(element);
      // Keyboard focus can scroll a card into view after focusin has fired.
      if (element.contains(doc.activeElement)) return;
      const target = element as HTMLElement;
      const previous = target.getAttribute('style');
      const restore = () => {
        if (target.getAttribute('style') === previous) return;
        if (previous === null) target.removeAttribute('style');
        else target.setAttribute('style', previous);
      };
      // Side panels converge horizontally; the real toolkit rises between them.
      const desktop = view.matchMedia('(min-width: 49rem)').matches;
      const from =
        desktop && element.matches('.stage-reading')
          ? 'translateX(-80px)'
          : desktop && element.matches('.stage-studio')
            ? 'translateX(80px)'
            : element.matches('.toolkit-preview, .toolkit-detail-preview')
              ? desktop
                ? 'translateY(80px)'
                : 'translateY(12px)'
              : 'translateY(20px)';
      const product = element.matches(
        '.stage-satellite, .toolkit-preview, .toolkit-detail-preview, .store-browser',
      );
      const animation = animate(
        element,
        { transform: [from, 'translate(0px, 0px)'] },
        { duration: product ? 1 : 0.65, ease: [0.22, 1, 0.36, 1] },
      );
      active.set(animation, restore);
      void animation.then(() => {
        // Release the fill effect so author styles regain complete ownership.
        animation.cancel();
        // Native cancellation settles after the finish callback in WebKit/Chromium.
        view.requestAnimationFrame(() => {
          restore();
          active.delete(animation);
        });
      });
    };
    const products = doc.querySelectorAll<HTMLElement>(
      '.store-browser, .toolkit-preview, .toolkit-detail-preview, .stage-satellite',
    );
    const stopContent = inView(elements, visit);
    // Wait for deliberate product exposure rather than playing at the viewport edge.
    const stopProducts = inView(products, visit, { amount: 0.5 });
    stopObserving = () => {
      stopContent();
      stopProducts();
    };
  };

  const observer = new view.MutationObserver(update);
  observer.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  for (const media of [reduce, forced, print])
    media.addEventListener('change', update);
  doc.addEventListener('visibilitychange', update);
  doc.addEventListener('focusin', cancel);
  update();

  const dispose = () => {
    disposed = true;
    observer.disconnect();
    stopObserving?.();
    cancel();
    for (const media of [reduce, forced, print])
      media.removeEventListener('change', update);
    doc.removeEventListener('visibilitychange', update);
    doc.removeEventListener('focusin', cancel);
    view.removeEventListener('pagehide', dispose);
  };
  view.addEventListener('pagehide', dispose);
  return dispose;
}
