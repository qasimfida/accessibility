# Accessiblit

Accessiblit is a dependency-free accessibility personalisation widget with eighteen controls for text, colour and navigation. The public npm package is **`@qasimfida/accessibility-widget`**, version **0.1.0**; the browser global remains `Accessiblit`. Personalisation does not make a website WCAG compliant. See the [accessibility report](docs/ACCESSIBILITY.md) for tested scope and remaining manual checks.

## CDN

Pin the version and keep its integrity value together. Both jsDelivr and [unpkg](https://unpkg.com/@qasimfida/accessibility-widget@0.1.0/dist/accessiblit.min.js) serve the verified 0.1.0 IIFE.

```html
<script
  src="https://cdn.jsdelivr.net/npm/@qasimfida/accessibility-widget@0.1.0/dist/accessiblit.min.js"
  integrity="sha384-16q5Bwqwx+EGwUWGN1IpmuUfkCwMctpxWVZg84pmiOw3FRectQlkJ9Q4RW30QS7M"
  crossorigin="anonymous"
></script>
<script>
  Accessiblit.init();
</script>
```

The hash is for the exact published IIFE, not a future build. `node scripts/sri.mjs` prints the hash of your local build; compare bytes before substituting a different version. For strict CSP, authorize the script source and your init script, and pass your nonce with `Accessiblit.init({ nonce })` for fallback style elements.

## npm

```sh
npm install @qasimfida/accessibility-widget@0.1.0
```

```ts
import { init } from '@qasimfida/accessibility-widget';

const widget = init({ position: 'bottom-left' });
// When this integration is removed:
widget.destroy();
```

Imports are SSR-safe; `init()` is inert without a DOM. Use one owner per document: calling `init()` again destroys the previous instance. Cleanup removes owned DOM, styles and listeners; saved preferences remain under the configured localStorage key.

**Known 0.1.0 content issue:** filling a previously empty Text node can leave that text unscaled until another refresh. The source fixes this for the next maintainer patch; published 0.1.0 is unchanged.

## React and Next.js

**Known 0.1.0 issue:** the published `/react` helper and declarations still reference the old package name. They require a new maintainer patch release. The repository contains the fix; it does not change the published 0.1.0 artifact. Use the tested core effect below with 0.1.0 instead.

```tsx
import { useEffect } from 'react';
import { init } from '@qasimfida/accessibility-widget';

export default function Accessibility() {
  useEffect(() => {
    const widget = init({ position: 'bottom-right' });
    return () => widget.destroy();
  }, []);
  return null;
}
```

For Next.js App Router, put `'use client';` at the top of that component file, then render it from your layout. Keep React and DOM work inside this client boundary. The effect is safe under StrictMode and destroys the instance it created.

See the [installation examples](site/install/index.html), [options reference](site/options/index.html) and [integration contracts](docs/guides/integrations.md). The source demo loads a local build; the public Pages deployment is tracked separately in the [post-publish report](reports/phase-11-post-publish.md).

MIT © 2026 Qasim Fida. See [LICENSE](LICENSE).
