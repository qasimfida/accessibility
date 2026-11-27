/** Assemble original decorative planes, then scrub depth only on visible scroll updates. */
export function startSculpture(doc: Document): () => void {
  const view = doc.defaultView;
  const scene = doc.querySelector<HTMLElement>('.hero-sculpture');
  const hero = scene?.parentElement;
  if (!view || !scene || !hero) return () => {};
  const root = doc.documentElement;
  const property = '--site-hero-depth';
  const previous = root.style.getPropertyValue(property);
  const priority = root.style.getPropertyPriority(property);
  const hadStyle = root.hasAttribute('style');
  const controller = new view.AbortController();
  const options = { signal: controller.signal };
  const media = [
    view.matchMedia('(prefers-reduced-motion: reduce)'),
    view.matchMedia('(forced-colors: active)'),
    view.matchMedia('print'),
  ];
  const animations = new Set<Animation>();
  let frame = 0;
  let visible = false;
  let visited = false;
  let interrupted = false;
  let dirty = true;
  let top = 0;
  let height = 1;
  let current = '';
  const disabled = () =>
    interrupted ||
    doc.hidden ||
    media.some((m) => m.matches) ||
    root.classList.contains('accessiblit-stop-animations');
  const cancel = () => {
    if (frame) view.cancelAnimationFrame(frame);
    frame = 0;
    for (const animation of animations) animation.cancel();
    animations.clear();
    if (previous) root.style.setProperty(property, previous, priority);
    else root.style.removeProperty(property);
    if (!hadStyle && root.getAttribute('style') === '')
      root.removeAttribute('style');
    current = '';
  };
  const schedule = () => {
    if (frame || !visible || disabled()) return;
    frame = view.requestAnimationFrame(() => {
      frame = 0;
      if (!visible || disabled()) return;
      if (dirty) {
        // Geometry changes only on setup/resize, never on each scroll event.
        const bounds = hero.getBoundingClientRect();
        top = bounds.top + view.scrollY;
        height = Math.max(1, bounds.height);
        dirty = false;
      }
      const next = Math.max(
        0,
        Math.min(1, (view.scrollY - top) / height),
      ).toFixed(4);
      if (next !== current) {
        root.style.setProperty(property, next);
        current = next;
      }
    });
  };
  const enter = () => {
    if (!visible || disabled() || visited) return;
    visited = true;
    const planes = [...scene.querySelectorAll<HTMLElement>('.sculpture-plane')];
    const resting = planes.map(
      (plane) => view.getComputedStyle(plane).transform,
    );
    planes.forEach((plane, index) => {
      const animation = plane.animate(
        [
          {
            transform: `translate3d(0,${110 + index * 35}px,0) rotateX(85deg) rotateZ(-55deg) scale(.65)`,
          },
          { transform: resting[index] },
        ],
        {
          duration: 1100,
          delay: index * 90,
          easing: 'cubic-bezier(.22,1,.36,1)',
        },
      );
      animations.add(animation);
      animation.onfinish = () => {
        animation.cancel();
        animations.delete(animation);
      };
    });
  };
  const intersection = new view.IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (!visible) cancel();
    else {
      enter();
      schedule();
    }
  });
  intersection.observe(hero);
  const update = () => {
    if (disabled()) cancel();
    else {
      enter();
      schedule();
    }
  };
  for (const query of media) query.addEventListener('change', update, options);
  doc.addEventListener('visibilitychange', update, options);
  doc.addEventListener(
    'focusin',
    () => {
      interrupted = true;
      cancel();
    },
    options,
  );
  view.addEventListener('scroll', schedule, { ...options, passive: true });
  view.addEventListener(
    'resize',
    () => {
      dirty = true;
      schedule();
    },
    options,
  );
  const observer = new view.MutationObserver(update);
  observer.observe(root, { attributes: true, attributeFilter: ['class'] });
  const dispose = () => {
    cancel();
    intersection.disconnect();
    observer.disconnect();
    controller.abort();
  };
  view.addEventListener('pagehide', dispose, options);
  return dispose;
}
