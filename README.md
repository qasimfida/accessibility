# Accessiblit

Accessiblit is a dependency-free accessibility personalisation widget with eighteen controls for text, colour and navigation. The prepared package name is **`@widgets/accessibility`** (not yet published; npm organization access is pending); the browser global remains `Accessiblit`. Personalisation does not make a website WCAG compliant. See the [accessibility report](https://github.com/qasimfida/accessiblit/blob/main/docs/ACCESSIBILITY.md) for tested scope and remaining manual checks.

## CDN

The CDN snippet below remains the last published release, `@qasimfida/accessibility-widget@0.1.1`; it does not include the new panel design. Pin the version and keep its integrity value together. Use jsDelivr or [unpkg](https://unpkg.com/@qasimfida/accessibility-widget@0.1.1/dist/accessiblit.min.js) for the 0.1.1 IIFE.

```html
<script
  src="https://cdn.jsdelivr.net/npm/@qasimfida/accessibility-widget@0.1.1/dist/accessiblit.min.js"
  integrity="sha384-92p98tW9X5RIeEH3DgJaTj4mWx29zz9C5jAH1Jd+AeCQUHivVa6CYiWAkYtQ3JC3"
  crossorigin="anonymous"
></script>
<script>
  Accessiblit.init();
</script>
```

The hash is for the exact published IIFE, not a future build. `node scripts/sri.mjs` prints the hash of your local build; compare bytes before substituting a different version. For strict CSP, authorize the script source and your init script, and pass your nonce with `Accessiblit.init({ nonce })` for fallback style elements.

## npm

```sh
# After the new organization package is published:
npm install @widgets/accessibility@0.1.1
```

```ts
import { init } from '@widgets/accessibility';

const widget = init({ position: 'bottom-left' });
// When this integration is removed:
widget.destroy();
```

Imports are SSR-safe; `init()` is inert without a DOM. Use one owner per document: calling `init()` again destroys the previous instance. Cleanup removes owned DOM, styles and listeners; saved preferences remain under the configured localStorage key.

Version 0.1.1 fixes scaling for text filled into existing empty nodes and reconciles restored settings at the parser-completion boundary. Upgrade from 0.1.0 to receive these fixes.

## React and Next.js

Version 0.1.1 corrects the React helper’s package imports and declarations. The optional `@widgets/accessibility/react` entry exports `AccessiblitWidget` and `useAccessiblit`. The core effect below also works without using the helper.

```tsx
import { useEffect } from 'react';
import { init } from '@widgets/accessibility';

export default function Accessibility() {
  useEffect(() => {
    const widget = init({ position: 'bottom-right' });
    return () => widget.destroy();
  }, []);
  return null;
}
```

For Next.js App Router, put `'use client';` at the top of that component file, then render it from your layout. Keep React and DOM work inside this client boundary. The effect is safe under StrictMode and destroys the instance it created.

See the [installation examples](https://qasimfida.github.io/accessiblit/install/), [options reference](https://qasimfida.github.io/accessiblit/options/) and [integration contracts](https://github.com/qasimfida/accessiblit/blob/main/docs/guides/integrations.md). The source demo loads a local build; the public Pages deployment is tracked separately in the [post-publish report](https://github.com/qasimfida/accessiblit/blob/main/reports/phase-11-post-publish.md).

MIT © 2026 Qasim Fida. See [LICENSE](LICENSE).
