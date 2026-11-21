# Website reference layout and Framer Motion

Status: PASS WITH NOTES
Date: 2026-11-21
Commit range: `29de48a..f24a0e1` (plus this evidence commit)

## Summary

Refined the website to follow the supplied reference's composition: announcement strip, white rounded navigation, breadcrumbs, centred warm-background hero, layered product artwork, integration strip, three journey cards, blue callouts, split visual/accordion sections, benefits, privacy, free pricing, original FAQs and dark footer. Content remains specific to Accessiblit's eighteen real personalisation features.

Added actual Framer/Motion animations using the framework-free Motion API. Section entrances translate 18 px over 650 ms, once per element. Content is never hidden while waiting for JavaScript. There are no continuous animations, automatic carousels or scroll hijacking.

## What changed (files and why)

- `site/index.html`: breadcrumbs, more precise personalisation heading, existing local artwork in the split visual, FAQ heading and matching theme metadata.
- `site/src/reference-layout.css`, landing styles: reference proportions, warm surface, smaller layered hero illustration, chevrons, section rhythm and responsive fallbacks. Existing dark appearance, forced colours and RTL support remain.
- `site/src/motion.ts`, `main.ts`: locally bundled Motion entrance effects, cancellation on focus, reduced motion, forced colours, print, hidden document and the toolkit's Stop animations setting. Entry never moves a card containing keyboard focus. Cleanup releases native animation effects and restores original style attributes.
- `package.json`, lockfile: pin `motion@14.14.0`, verified as the registry's current stable version during this session. It is a development dependency used only by the site build. Its transitive `framer-motion`, `motion-dom` and `motion-utils` packages supply the actual animation implementation. The published widget retains zero runtime dependencies and no Motion code is imported into `src/`.
- `e2e/site/motion.spec.ts`: browser checks for once-only entrance, style cleanup, reduced/forced preferences, live preference changes, Stop animations and stationary keyboard focus.

## Verification

Final command results and raw browser evidence are recorded in `assets/reference-motion/`.

- `npm run verify`: passed lint, typecheck, 197 unit tests in 62 files, six performance-script tests, SSR checks, ESM/CJS/IIFE/type builds, size-limit, publint and attw. Core coverage: 98.63% lines, 97.96% branches.
- Focused animation prototype: final run **25 passed in 10.7 seconds** across Chromium, Firefox, WebKit, iPhone and Pixel emulations. A keyboard-focus regression test was subsequently added.
- Full final site matrix: **325 passed in 2.9 minutes**, including all thirty animation/focus cases across the five projects. The 210 page/profile cases produced 420 axe runs with zero violations. No retries, skips, threshold reductions or axe rule exclusions were added.
- Production-only and full npm audits: zero vulnerabilities.
- Deployment follow-up: the first Pages job failed at `npm ci`. Local npm 11 clean install passed, but npm 10.9.4 reproduced EUSAGE for two missing optional lock entries. Regenerating the lock with npm 10 restored those entries; a real npm 10 clean install then added 302 packages, audited 303 packages and reported zero vulnerabilities. Full verify passed again after that clean install. No existing package version changed. See [install compatibility evidence](assets/reference-motion/install-compatibility.json).
- Real Chromium keyboard inspection: Tab to the skip link, Enter into main, Tab through the hero and journey links to the live demo, Space to open, verify close-button focus, Escape to return to the launcher. A native FAQ was activated with Space. The existing automated keyboard journey also exercises feature adjustment, reset and page navigation.
- JavaScript-disabled inspection: heading and all eleven FAQs remain readable; the real demo correctly requires JavaScript.

## Review findings and fixes

| Severity | Finding                                                                                                         | Fix                                                                                                                 | Status                      |
| -------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| Medium   | R-1: keyboard focus can bring a card into view after the focus event, starting movement around the focused link | `052b459`: skip an entry when it contains the active element; browser keyboard regression test                      | Fixed                       |
| Medium   | R-2: browser theme metadata still described the previous white landing background                               | `1712c04`: match light theme metadata to `#faf8f5`; existing metadata test checks both schemes in every project     | Fixed                       |
| Low      | Motion commits its finishing transform to inline CSS                                                            | Restore the original attribute after releasing the native animation; covered by the entry cleanup test in `cefd947` | Fixed before feature commit |

R-3 (High): the first GitHub Pages deployment was blocked before the build by npm 10 lockfile validation. `f24a0e1` restores the optional `@emnapi/core` and `@emnapi/runtime` entries pruned by npm 11. This fixes the clean-install gate without changing dependency versions or skipping optional validation. The connected GitHub log tool was unavailable, so the install error was reproduced directly with npm 10 rather than claiming to have read unavailable job logs.
| High | R-3: npm 11 removed optional lock entries required by CI npm 10, blocking deployment | `f24a0e1`: regenerate with npm 10 and run a successful clean install; no package versions changed | Fixed |

Vercel Web Interface Guidelines review covered the changed markup, CSS and animation module. Native links, buttons and details/summary controls retain keyboard behaviour and visible focus. Images have dimensions and appropriate empty alternatives for decorative artwork. Only compositor transforms are animated. The guidelines were freshly retrieved from the Vercel Labs source; the browser fetch failed, and a direct source request was used as fallback.

## Audits

### Accessibility

The matrix covers six pages in light, dark, forced colours, reduced motion, RTL, 320×256 and text-spacing profiles, with the widget open and closed. Exact axe counts, measured contrast and target sizes are in [checks.json](assets/reference-motion/checks.json). Minimum measured site text contrast was 6.05:1; widget text 6.80:1. The real minimum target was 24×24 px (including the breadcrumb link and native widget inputs). Axe colour-contrast incompletes on layered artwork/illustrations and the existing widget remain disclosed; zero violations is not a claim that every incomplete was automatically resolved. For the new translucent scene, the `#153450` text over a 95% white surface has a conservative **11.47:1** contrast even with black behind it. Screenshots were inspected on desktop and mobile.

This is browser/emulation evidence. No human screen-reader or physical-device result is claimed.

### Security and privacy

No secrets, credentials, network services, forms collecting data, cookies, tracking or storage keys were added. Motion is bundled and served from the site's own origin; no external animation CDN is used. The network tests and visual probe found no third-party requests. There is no dynamic HTML insertion or unsafe execution API. No registry publication occurred.

### Performance and size

The unchanged widget bundle is **65,866 raw bytes / 21,863 gzip bytes**, with size-limit reporting **21.84 kB** against the unchanged 35 kB budget. Motion belongs to the site bundle only. The measured site JavaScript is 12,008 raw bytes / 4,669 gzip bytes; CSS is 61,035 raw bytes / 7,588 gzip bytes. The local page fetched 266,160 resource bytes plus 37,426 HTML bytes. Single load-event samples were desktop 109.9 ms, mobile 50.1 ms and dark desktop 45.4 ms. Exact measurements and keyboard observations are in [browser evidence](assets/reference-motion/browser-evidence.json). Local load-event samples are single unthrottled runs and are not production performance scores or an init-time benchmark. The core init-time gate and committed baseline were not changed; no fresh reference-machine init timing is claimed for this site-only change.

## Known limitations (honest)

Original content and artwork change exact line breaks and section heights. The result follows the reference's visual structure rather than copying its company identity, customer logos, testimonials, certification marks, AI/compliance promises or paid services. Our integration formats replace customer-logo claims, accessibility principles replace unsupported certifications, and our real free MIT offering replaces paid plans. Existing toolkit previews remain illustrative; the live demo uses the actual local widget.

Motion may be disabled by browser/system settings or Stop animations, and static content remains available. Screen readers and real devices still need human verification.

## Deviations from the prompt (and why)

Kept plain TypeScript/Vite and used Motion's vanilla API instead of introducing a React website solely for animations. This preserves the existing integration and dependency boundaries. No numbered phase was requested, so no completion tag is invented or moved. Existing pricing, toolkit-related navigation and original FAQs are retained.

## Handoff notes

Use npm 10 when maintaining this lockfile, and run its real `npm ci` check before dependency commits. Review the deployed landing page, native FAQ interactions and live demo on GitHub Pages. Test the new entrances with reduced motion both on and off. GitHub Pages deployment is verified separately from local checks; no deployment is claimed before its workflow succeeds.

## Commit list

- `c992dee` build(site): add Motion for local landing animations
- `cd043c0` style(site): match supplied landing page composition
- `cefd947` feat(site): add accessible Framer Motion section entrances
- `052b459` fix(site): keep keyboard-focused cards stationary
- `1712c04` fix(site): match theme metadata to the warm page background
- `d13d78a` docs(report): record reference layout and Motion verification
- `f24a0e1` fix(build): restore npm 10 clean-install lock entries

## Visual evidence

[Desktop](assets/reference-motion/desktop.png) · [Mobile](assets/reference-motion/mobile.png) · [Dark appearance](assets/reference-motion/dark.png) · [Real toolkit](assets/reference-motion/toolkit.png).
