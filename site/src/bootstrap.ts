import type { init } from '@qasimfida/accessibility-widget';

declare const Accessiblit: { init: typeof init };

// A classic head script applies persisted preferences before the body is parsed.
const widget = Accessiblit.init();
document.addEventListener('accessiblit:open-demo', () => widget.open());
