# UI maintenance — Full-width heroes, dimensional motion and popup tiles

Status: PASS WITH NOTES
Date: 2026-11-27
Commit range: `4329bda..4946815` plus this report/evidence commit.

## Summary

All eight heroes now span the viewport, with readable content constrained by an
inner wrapper and consistent abstract-background placement. Original blue planes
assemble with perspective and respond gently to scrolling. The popup body uses
centred icon-led tiles, circular stepper actions and grouped option cards. Its
header, close action, branding and six shortcuts are unchanged.

## What changed (files and why)

| Commit    | Logical change                                                                                                     |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| `a4a0885` | Document the full-width, dimensional-motion and popup-body design rules.                                           |
| `179234f` | Move About, Options and 404 content into inner wrappers; standardise viewport-wide backgrounds.                    |
| `bfe5274` | Add body-scoped tile styles and metadata-driven option-card classes, retaining descriptions and control semantics. |
| `ddef9ec` | R-1: let the existing animation recorder handle native array keyframes.                                            |
| `7c10d5f` | Add original CSS planes, one-time assembly, visible-only scroll depth and lifecycle/preference cancellation.       |
| `991f7b2` | R-2: retain paired binary tiles at narrow widths while steppers use a full row.                                    |
| `cf4a3a2` | R-3: update the former single-column geometry expectation while preserving contrast and focus checks.              |
| `7dd0cae` | Refresh the real 400 × 680 toolkit preview rather than a separate mockup.                                          |
| `9f9801b` | R-4: deliver the preview as lossless WebP, update its capture helper and assert its MIME type.                     |
| `4946815` | Document the optional maintainer-only encoder and reproducible preview capture.                                    |

Reference review: played the four supplied Dribbble videos in Chromium and
inspected the supplied toolkit reference and attachment. The references inform
perspective, layering and assembly, not reused code, artwork or copy. Videos and
reference screenshots stayed outside the repository. The original CSS sculpture
ships without video, WebGL, a 3D engine or additional dependencies. The latest
Vercel Web Interface Guidelines were consulted using the web-design-guidelines
skill.

References:
[Stellagent](https://dribbble.com/shots/26628182-Stellagent-ai-agents-landing-page-3D-animation),
[Bullo](https://dribbble.com/shots/25795725-Bullo-stay-in-loop-landing-page-web-design-3D-animation),
[IPO FX](https://dribbble.com/shots/27898243-IPO-FX-landing-page-web-design-3D-animation-website),
[SOLAR](https://dribbble.com/shots/20175111-SOLAR-Hero-Interaction),
[toolkit reference](https://a11yfirst.com/toolkit/).

## Verification (commands run, real results)

- Started on clean `main`; `git pull --ff-only` returned already up to date.
- Node `v24.13.0`. No npm dependency or lockfile changes.
- Lint and type checks ran before every commit. The touched UI unit suite passed:
  **48 tests in 17 files**. Source-only website changes use browser validation.
- `npm run verify`: **200 unit tests in 62 files**, seven performance-helper tests,
  lint, types, build, plain Node SSR check, size, publint and attw pass.
  Core line coverage **98.63%**, branch coverage **97.96%**.
- `npx playwright test --config playwright.site.config.ts --workers=2`:
  **580 passed in 5.9 minutes**, zero retries and zero skipped tests. Chromium,
  Firefox, WebKit, emulated iPhone and Pixel all pass, including after the WebP
  delivery change.
- Package UI browser subset (panel accessibility/design/layout/behaviour,
  compact/refined controls and focus indicator): **136 passed in 57.7 seconds**.
  Two existing skips cover CDP pinch-zoom emulation in Firefox/WebKit; that API is
  Chromium-only. Every engine still runs 320 px reflow checks.
- Asset/MIME and no-third-party-request tests passed against the new WebP.
  The capture helper was run successfully and produced the committed asset.
- `npm run perf -- --other-apps-open --output reports/assets/ui-depth/perf-macos.json`:
  both engines pass the unchanged 50 ms median gate; details below.
- Nu HTML Checker 26.11.20: **zero errors and warnings** across built HTML, CSS
  and SVG. The 188 informational notes concern harmless quoted void-element
  trailing slashes emitted by formatting.
- `npm audit` and `npm audit --omit=dev`: **zero vulnerabilities**.
- Evidence: [browser summary](assets/ui-depth/browser-summary.json),
  [standards output](assets/ui-depth/standards.json),
  [raw reference benchmark](assets/ui-depth/perf-macos.json).

## Review findings and fixes

| Severity | Finding                                                                                | Fix                                                                                                          | Status |
| -------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ------ |
| Medium   | R-1: the prior recorder assumed property-indexed keyframes and threw on native arrays. | `ddef9ec`: handle the second valid format; retain the original product-assembly assertion.                   | Fixed  |
| Medium   | R-2: the first narrow layout also stacked binary cards unnecessarily.                  | `991f7b2`: keep paired binary switches and widen only stepper/option cards; ten compact browser checks pass. | Fixed  |
| Low      | R-3: a pre-existing audit required single-column content at every width.               | `cf4a3a2`: assert the requested responsive geometry while retaining header, contrast and keyboard checks.    | Fixed  |
| Medium   | R-4: the new PNG preview was the mobile LCP image and weighed 45,853 bytes.            | `9f9801b`: lossless WebP is 19,214 bytes, 58.1% smaller; verify delivery and recapture.                      | Fixed  |

One initial compact check used a previously built distribution; it was rerun
against a fresh build before the fix was committed. A raw Nu report also needed
Prettier formatting before lint passed. No rules, thresholds, retries or test
timeouts were weakened. No Blocker, High or unresolved Medium code findings
remain from this review. The mobile lab score limitation is recorded below.

## Audits

### Accessibility

The site matrix covers eight routes in light, dark, forced-colours, reduced-motion,
RTL, 320 × 256 and increased-text-spacing profiles. All **280 route/profile cases**
pass axe with the widget closed and open; additional drawer and tile audits pass.
The package UI suite adds **48 appearance/viewport accessibility profiles**.

Measured minimum site text contrast: **6.045:1**; widget text: **6.848:1**.
Minimum widget control-boundary contrast: **3.805:1**. Focus indication is **3 px**
with at least **6.848:1** contrast. Minimum targets are **36 px** on the site and
**24 px** in the widget's radio choices; stepper actions remain **44 × 44 px**.
The existing close-icon treatment remains unchanged and passes its contrast and
focus checks.

The Playwright-driven real-browser keyboard walk opens through the shortcut,
changes font size, resets, closes with Escape, confirms launcher focus return,
then visits each content page through the mobile Menu where applicable. Detailed
paths are retained in the browser summary. Package tests check keyboard focus
while scrolling the taller tile body, radio behaviour, neutral switch cards and
header shortcuts. No header stylesheet declarations or header DOM were changed.

Artwork is aria-hidden, non-interactive and outside document flow. Entry assembly
finishes within 1.28 seconds and does not loop. Scrolling updates only decorative
transforms; it does not hijack navigation or move controls. Reduced motion,
forced colours, print, hidden documents, Stop animations and focus cancel effects.
Static content and decoration remain usable without JavaScript. The full-width
geometry check covers 1440, 390 and 320 px widths on every route without adding
horizontal scrolling.

Screenshots: [home](assets/ui-depth/home-desktop.png),
[About](assets/ui-depth/about-desktop.png),
[desktop popup](assets/ui-depth/popup-desktop.png),
[mobile popup](assets/ui-depth/popup-mobile.png).

### Security and privacy

No new npm dependencies, requests to third-party hosts, cookies, tracking,
credentials or storage keys. The full network matrix checks all routes and live
widget interactions, confirms zero third-party requests and no cookies, and
retains only the existing `accessiblit:v1` storage key. No unsafe HTML insertion
or executable-string API was introduced.

Site animation listeners share an AbortController; observers, pending frames and
native animations are disposed on unload. Only an owned root CSS variable is
written, its previous value is restored on cancellation, and no page-element
inline styles are added. Scroll handling schedules at most one frame and batches
geometry reads before writes. The sculpture code stays in the website entry;
package integrations receive only the popup styling.

### Performance and size

IIFE gzip is **24,066 bytes**, versus **23,744 bytes** previously: **+322 bytes**,
below the unchanged 35,000-byte budget and 30,000-byte warning level. All delivery
formats and types build. Public API, feature values, header controls and zero
runtime dependencies are unchanged.

Reference machine: **Mac15,6, Apple M3 Pro, 18 GiB RAM, 11 logical CPUs,
macOS 27.2.1 (26B131)**. AC power was verified. Other apps remained open at the
maintainer's explicit request; the exception is recorded in the raw report.
Headless, no tracing, five discarded warmups and 30 measured samples per engine,
using performance.now around init only on a 5,000-paragraph fixture:

| Engine                 | Median  | p95     | Gate                 |
| ---------------------- | ------- | ------- | -------------------- |
| Chromium 158.0.8127.18 | 1.30 ms | 2.70 ms | PASS, median ≤ 50 ms |
| WebKit 27.2            | 1.00 ms | 3.00 ms | PASS, median ≤ 50 ms |

Lighthouse 13.6, fresh headless browser, extensions disabled, built homepage under
its project base, unchanged desktop/mobile presets and local uncompressed HTTP:

| Final run | Performance | Accessibility | Best practices | SEO | LCP         | TBT   | CLS |
| --------- | ----------- | ------------- | -------------- | --- | ----------- | ----- | --- |
| Desktop   | 100         | 100           | 100            | 100 | 512.23 ms   | 0 ms  | 0   |
| Mobile    | 95          | 100           | 100            | 100 | 2,783.17 ms | 28 ms | 0   |

Measured total page transfer fell from **311,490 to 284,854 bytes**. Before WebP,
the local mobile score was 94. The remaining mobile cost includes parser-blocking
preference restoration and the stylesheet, delivered uncompressed by this local
preview. Restoration was preserved to avoid reintroducing saved-preference flash.
This is not a claim of 100 performance on every device or a new live-CDN result.

Raw Lighthouse evidence:
[desktop before](assets/ui-depth/lighthouse-desktop/home-1.json),
[mobile before](assets/ui-depth/lighthouse-mobile/home-1.json),
[desktop final](assets/ui-depth/lighthouse-desktop-final/home-1.json),
[mobile final](assets/ui-depth/lighthouse-mobile-final/home-1.json).

## Known limitations (honest)

- Mobile local lab performance is 95, not 100. Live Pages compression/caching and
  physical-device performance have not been remeasured for this deployment.
- These are original CSS perspective effects, not photorealistic WebGL/video
  renders. Small screens use quieter decoration to protect readability.
- Screen-reader sessions and physical devices were not tested. Automated axe,
  browser keyboard and Nu syntax checks do not certify complete conformance.
  Axe still lists some composed-background contrast checks as incomplete; the
  computed solid-text and control contrast checks also run.
- Full unrelated runtime stress/heap scenarios were not rerun. The previous
  maintenance report records an intermittent shared-CI heap-trend finding; its
  code and gates were not modified here. No fresh full CI success is claimed.
- The optional `cwebp` encoder is required only to regenerate maintainer previews,
  not to install, build, test or use the package.

## Deviations from the prompt (and why)

Original code and artwork follow AGENTS.md §2.3; no reference widget code, icons,
copy or assets were reused. Descriptions and native semantics remain visible;
steppers stack at narrow widths to preserve target sizes, while binary switches
remain paired. The header and footer were retained. The requested richer motion
is interruptible and yields to visitor preferences.

This is unnumbered UI maintenance, so the report uses a descriptive filename and
does not create or overwrite a numbered phase-completion tag. The reference
benchmark uses the expressly authorised other-apps-open exception, on AC power.

## Handoff notes for the next phase

The Pages workflow deploys after the main push. Check full-width About/Options
heroes, scroll depth, reduced motion and the popup's new body after deployment.
Human screen-reader checks remain pending. The site uses its local library build;
the npm/CDN release remains unchanged until the maintainer publishes a new
version. No publication, login or token command was run.
