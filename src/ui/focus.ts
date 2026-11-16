/** Scroll the actual content viewport so fixed chrome never obscures a focused control. */
export function keepPanelFocusVisible(
  panel: HTMLElement,
  body: HTMLElement,
  target: HTMLElement,
): void {
  const content = body.getBoundingClientRect();
  // Short viewports use the outer scroller; detached test/SSR nodes have no content geometry.
  const scroller =
    body.contains(target) &&
    content.height > 0 &&
    body.scrollHeight > body.clientHeight
      ? body
      : panel;
  const bounds = scroller.getBoundingClientRect();
  const focus = target.getBoundingClientRect();
  const gap = Math.min(
    10,
    Math.max(0, (bounds.bottom - bounds.top - (focus.bottom - focus.top)) / 2),
  );
  if (focus.top < bounds.top + gap)
    scroller.scrollTop -= bounds.top + gap - focus.top;
  else if (focus.bottom > bounds.bottom - gap)
    scroller.scrollTop += focus.bottom - bounds.bottom + gap;
}
