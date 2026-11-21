/** Expand the selected product card with a compositor-only FLIP transition. */
export function startJourney(doc: Document): () => void {
  const view = doc.defaultView;
  const grid = doc.querySelector<HTMLElement>('.journey-grid');
  if (!view || !grid) return () => {};
  const cards = [...grid.querySelectorAll<HTMLElement>('.journey-card')];
  const buttons = [
    ...doc.querySelectorAll<HTMLButtonElement>('[data-journey]'),
  ];
  const reduce = view.matchMedia('(prefers-reduced-motion: reduce)');
  const forced = view.matchMedia('(forced-colors: active)');
  const wide = view.matchMedia('(min-width: 49rem)');
  const fine = view.matchMedia('(hover: hover) and (pointer: fine)');
  const active = new Set<Animation>();
  const cancel = () => {
    for (const animation of active) animation.cancel();
    active.clear();
  };
  const disabled = () =>
    reduce.matches ||
    forced.matches ||
    !wide.matches ||
    doc.hidden ||
    doc.documentElement.classList.contains('accessiblit-stop-animations');
  const select = (index: number, motion: boolean) => {
    if (
      grid.dataset.active === String(index) ||
      grid.contains(doc.activeElement)
    )
      return;
    cancel();
    // Batch reads before the single layout change; no reads occur in animation frames.
    const before =
      motion && !disabled()
        ? cards.map((card) => card.getBoundingClientRect())
        : [];
    grid.dataset.active = String(index);
    buttons.forEach((button, i) =>
      button.setAttribute('aria-pressed', String(i === index)),
    );
    if (!before.length) return;
    const after = cards.map((card) => card.getBoundingClientRect());
    cards.forEach((card, i) => {
      const first = before[i];
      const last = after[i];
      if (!first || !last || !last.width) return;
      const animation = card.animate(
        [
          {
            transform: `translateX(${first.left - last.left}px) scaleX(${first.width / last.width})`,
          },
          { transform: 'translateX(0px) scaleX(1)' },
        ],
        { duration: 450, easing: 'cubic-bezier(.22,1,.36,1)' },
      );
      active.add(animation);
      animation.onfinish = () => {
        animation.cancel();
        active.delete(animation);
      };
    });
  };
  const cleanups: (() => void)[] = [];
  cards.forEach((card, index) => {
    const enter = () => {
      if (fine.matches && wide.matches) select(index, true);
    };
    card.addEventListener('pointerenter', enter);
    cleanups.push(() => card.removeEventListener('pointerenter', enter));
  });
  buttons.forEach((button, index) => {
    const click = (event: MouseEvent) => select(index, event.detail > 0);
    button.addEventListener('click', click);
    cleanups.push(() => button.removeEventListener('click', click));
  });
  const update = () => {
    if (disabled()) cancel();
  };
  const observer = new view.MutationObserver(update);
  observer.observe(doc.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  for (const media of [reduce, forced, wide])
    media.addEventListener('change', update);
  doc.addEventListener('focusin', cancel);
  doc.addEventListener('visibilitychange', update);
  const dispose = () => {
    cancel();
    observer.disconnect();
    cleanups.forEach((cleanup) => cleanup());
    for (const media of [reduce, forced, wide])
      media.removeEventListener('change', update);
    doc.removeEventListener('focusin', cancel);
    doc.removeEventListener('visibilitychange', update);
    view.removeEventListener('pagehide', dispose);
  };
  view.addEventListener('pagehide', dispose);
  return dispose;
}
