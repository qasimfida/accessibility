import { inView } from 'motion';
import { animate } from 'motion/mini';

/** Enhance the static landing page without hiding content or moving focused controls. */
export function startSiteMotion(doc: Document): () => void {
  const view = doc.defaultView;
  if (!view || !doc.body.classList.contains('landing-page')) return () => {};

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
      '.product-hero h1, .product-stage, .section-heading, .journey-card, ' +
        '.benefit-card, .focus-scene, .format-grid, .principle-quote, ' +
        '.privacy-visual, .free-plan',
    );
    stopObserving = inView(elements, (element) => {
      if (disabled() || visited.has(element)) return;
      visited.add(element);
      const target = element as HTMLElement;
      const previous = target.getAttribute('style');
      const restore = () => {
        if (target.getAttribute('style') === previous) return;
        if (previous === null) target.removeAttribute('style');
        else target.setAttribute('style', previous);
      };
      // Translation preserves text contrast; content is readable before JS runs.
      const animation = animate(
        element,
        { transform: ['translateY(18px)', 'translateY(0px)'] },
        { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
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
    });
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
