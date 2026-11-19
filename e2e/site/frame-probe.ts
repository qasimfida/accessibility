/** Measure actual text, not an empty element shell that the HTML parser has not filled yet. */
export function sampleContentFrames() {
  const frames: number[] = [];
  Reflect.set(window, 'siteFirstFrames', frames);
  const diagnostics: Record<string, unknown>[] = [];
  Reflect.set(window, 'siteFrameDiagnostics', diagnostics);
  Reflect.set(window, 'siteEmptyFrames', 0);
  const sample = () => {
    const probe = document.querySelector('[data-site-sample]');
    if (probe?.textContent?.trim()) {
      const fontSize = parseFloat(getComputedStyle(probe).fontSize);
      frames.push(fontSize);
      // Preserve the failing first read before any diagnostic layout/storage reads.
      let persistedFontSize: unknown;
      try {
        const raw = localStorage.getItem('accessiblit:v1');
        persistedFontSize = raw ? JSON.parse(raw).state?.fontSize : null;
      } catch {
        persistedFontSize = 'unavailable';
      }
      diagnostics.push({
        fontSize,
        persistedFontSize,
        readyState: document.readyState,
        marker: probe.getAttribute('data-accessiblit-font-size'),
        enabled: document.documentElement.classList.contains(
          'accessiblit-font-size',
        ),
        scale: document.documentElement.style.getPropertyValue(
          '--accessiblit-font-scale',
        ),
        stylesheetsReady: [
          ...document.querySelectorAll<HTMLLinkElement>('link[rel=stylesheet]'),
        ].map((link) => Boolean(link.sheet)),
      });
    } else if (probe)
      Reflect.set(
        window,
        'siteEmptyFrames',
        Reflect.get(window, 'siteEmptyFrames') + 1,
      );
    if (frames.length < 5) requestAnimationFrame(sample);
  };
  requestAnimationFrame(sample);
}
