/** Enhance a native disclosure without replacing link navigation or its no-JS fallback. */
export function startNavigation(doc: Document): () => void {
  const view = doc.defaultView;
  const menu = doc.querySelector<HTMLDetailsElement>('.mobile-menu');
  const summary = menu?.querySelector<HTMLElement>('summary');
  if (!view || !menu || !summary) return () => {};
  const controller = new view.AbortController();
  const options = { signal: controller.signal };
  const mobile = view.matchMedia('(max-width: 64rem)');
  const root = doc.documentElement;
  const property = '--site-menu-available';
  const previous = root.style.getPropertyValue(property);
  const priority = root.style.getPropertyPriority(property);
  const hadStyle = root.hasAttribute('style');
  let frame = 0;
  let sized = false;
  const restoreSize = () => {
    if (frame) view.cancelAnimationFrame(frame);
    frame = 0;
    if (!sized) return;
    if (previous) root.style.setProperty(property, previous, priority);
    else root.style.removeProperty(property);
    if (!hadStyle && root.getAttribute('style') === '')
      root.removeAttribute('style');
    sized = false;
  };
  const size = () => {
    if (!menu.open || frame) return;
    frame = view.requestAnimationFrame(() => {
      frame = 0;
      if (!menu.open) return;
      // One layout read precedes one root-variable write; the announcement/header can change height.
      const bottom = menu.closest('header')!.getBoundingClientRect().bottom;
      root.style.setProperty(
        property,
        `${Math.max(44, view.innerHeight - bottom - 16)}px`,
      );
      sized = true;
    });
  };
  const close = (focus = false) => {
    const wasOpen = menu.open;
    menu.open = false;
    restoreSize();
    if (focus && wasOpen) summary.focus();
  };
  menu.addEventListener(
    'keydown',
    (event) => {
      if (event.key === 'Escape' && !event.defaultPrevented && menu.open) {
        event.preventDefault();
        close(true);
      }
    },
    options,
  );
  menu.addEventListener(
    'click',
    (event) => {
      if (
        event.target instanceof view.Element &&
        event.target.closest('a[href]')
      )
        close();
    },
    options,
  );
  doc.addEventListener(
    'pointerdown',
    (event) => {
      if (event.target instanceof view.Node && !menu.contains(event.target))
        close();
    },
    options,
  );
  doc.addEventListener(
    'focusin',
    () => {
      if (menu.open && !menu.contains(doc.activeElement)) close();
    },
    options,
  );
  menu.addEventListener(
    'toggle',
    () => {
      if (menu.open) size();
      else restoreSize();
    },
    options,
  );
  view.addEventListener('resize', size, options);
  view.addEventListener('scroll', size, { ...options, passive: true });
  mobile.addEventListener('change', () => close(), options);
  const dispose = () => {
    close();
    controller.abort();
  };
  view.addEventListener(
    'pagehide',
    (event) => {
      // Cached documents resume with the same listeners; only a real unload disposes them.
      if (event.persisted) close();
      else dispose();
    },
    options,
  );
  return dispose;
}
