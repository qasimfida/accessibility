# Toolkit UI, branding and support refresh

Status: PASS WITH NOTES
Date: 2026-11-24 (Asia/Karachi)
Commit range: `e5b1f38..HEAD` on main; unnumbered follow-up.

## Summary

The visible product is now **Accessibility**, with a refined original logo and a
smaller 400 × 680 px popup. Cards stay neutral; only switch tracks and knobs show
toggle state. Alignment choices use named icons and tooltips, cursor choices keep
their pointer artwork, and four header shortcuts control the real feature store.
The homepage has local integration icons and a support section instead of a
Pricing page. The maintainer confirmed the repository rename: canonical links and
GitHub Pages now use `/accessibility/`.

## What changed (files and why)

- `src/ui/brand.ts`, `sync-brand.mjs`, site headers/footers, favicon and social
  artwork share one editable original mark. All eight routes have matching marks.
- The popup brand, site copy and README use Accessibility. Public globals,
  `AccessiblitOptions`, React exports, bundle filenames and `accessiblit:v1` remain
  compatible with existing consumers.
- `card-styles.ts`, toggle/radio renderers and feature metadata provide neutral
  switch cards without On/Off words, distinct alignment icons, and retained cursor
  icons. Knob position, heavier strokes and checked/pressed states supplement colour.
- `quick-actions.ts` generates up to four available toggle actions from registry
  metadata: Dark mode, Reading guide, Stop animations and Focus highlight. They
  respect feature exclusions, use the same store and render only on first open.
  `messages.quickControls` is an optional translation string.
- Header padding is 12 px. Placement caps the desktop frame at 400 × 680 px and
  still clamps to small visual viewports. Button targets remain at least 44 px.
- Close has zero border and outline. Its painted 3 px icon becomes blue on
  hover/focus; forced colours use system LinkText. Focus measurements now inspect
  the actual SVG stroke for this control rather than an absent outline.
- `site/index.html` has six locally authored integration marks, an inactive Donate
  button and three free/open-source labels. Its visible description and hover title
  explain that donations are coming soon and no payment is collected.
- Pricing was removed from navigation, build inputs and sitemap. Its former route
  returns 404. The support card retains progressive motion and cancellation.
- AGENTS.md constants, package metadata, site URLs, preview helpers and site tests
  use `qasimfida/accessibility` and `/accessibility/`, as confirmed by the maintainer.
  Historical reports retain their original URLs.
- The design system and human screen-reader script cover the new patterns; the
  website preview PNG is captured from the real 400 × 680 px production popup.

## Verification (commands run, real results)

- Started clean on main; `git pull --ff-only`: already up to date.
- Local tools: Node v24.13.0, npm 11.6.2, git 2.54.0 (Apple Git-157).
- Before every commit: lint, typecheck and touched UI unit tests passed.
- `npm run verify`: PASS, 200 unit tests / 62 files, seven performance-statistics
  tests, SSR checks, all delivery formats, size, publint and attw.
- Core coverage: 98.63% lines and 97.96% branches. Overall: 92.43% lines and
  87.31% branches. Coverage configuration was not changed.
- Final toolkit UI matrix: **649 passed, 5 existing skips, 18.5 minutes**. Scope:
  all QA, panel, focus-indicator and all-features specs across Chromium, Firefox,
  WebKit and emulated iPhone/Pixel. The five skips require Chromium CDP for precise
  heap/pinch-zoom measurements; lifecycle checks still run on all projects.
- Final `npm run test:site -- --workers=1`: **460 passed, 10.2 minutes**, including
  eight pages × seven profiles × five projects = 280 page/profile audits, open and
  closed axe, donation behavior, routing, motion, links, network and persistence.
- `npm run test:site-snippets`: PASS; 11 extracted snippets, Node16/Bundler
  TypeScript checks, 18 browser executions, packed-tarball consumers and React/Next
  StrictMode cleanup (two mounts and two removals). The real pinned CDN/SRI case
  also passed; private-registry/Git commands were syntax-checked without credentials.
- `npm run test:examples`: PASS after U-8, including packed consumers, TypeScript
  resolution modes, Node SSR and 15 browser/format cases with measured focus
  widths of 3 px. Additional corrective runs: 20 compact-popup cases (25.8 seconds)
  and 55 homepage/forced-colour/donation cases (1.5 minutes), all passed.
- Full and production-only npm audits: zero vulnerabilities; no dependencies added.
- `actionlint .github/workflows/pages.yml`: passed. No workflow permissions changed.

The first broader run identified the findings below and was stopped once failures
were known. The final relevant matrices above passed with retries disabled and
all original assertions retained. Site count changed with the requested removal
of Pricing; routing explicitly checks that the removed page is unavailable.

Evidence: [site verification](assets/toolkit-ui-refresh/site-verification.json),
[runtime verification](assets/toolkit-ui-refresh/runtime-verification.json),
[visual review](assets/toolkit-ui-refresh/visual-review.json),
[heap recorder comparison](assets/toolkit-ui-refresh/heap-recorder-comparison.json).

## Review findings and fixes

| Severity | Finding                                                                 | Fix                                                                                          | Status                                                       |
| -------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Medium   | U-1 focus scrolling and shadow event retargeting dismissed action hints | `92140ec` captured targets, deferred focus display and cancellation                          | Fixed; existing hint regressions pass                        |
| Medium   | U-2 Firefox crashed during nested-role bulk geometry evaluation         | `ade0595` retained semantic assertions and measured the same controls through a DOM selector | All five projects pass; no browser-engine fix claimed        |
| Medium   | U-3 old 30-tab test budget omitted the four new actions                 | `ccd428c` derives traversal length from rendered controls                                    | Full-feature keyboard and host-focus assertions pass         |
| Medium   | U-4 tracing still changed heap measurements without DOM snapshots       | `586a4c2` isolates the measurement from the trace recorder                                   | Same GC, reference, trend, node and listener assertions pass |
| Medium   | U-5 enlarged title glyphs clipped by 2 px in Firefox                    | `8641e52` increases title line height                                                        | Original clipping tolerance passes                           |
| Medium   | U-6 motion checks targeted the removed pricing card                     | `fce7578` targets the real support card in code and tests                                    | All motion checks pass                                       |
| High     | U-7 borderless close lost its colour change under forced colours        | `2e2685b` uses system LinkText on focus/hover                                                | Distinct focus colour verified on five projects              |

The first GitHub run found three additional platform/tooling issues after the
local matrices. These were fixed forward; the fresh CI and deployment runs passed:

| Severity | Finding                                                                             | Fix                                                                                                                                          | Local verification                                    |
| -------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Medium   | U-8 packed examples still measured an outline on the borderless Close               | `0154e24` measures the actual SVG stroke, retaining the 2 px minimum gate                                                                    | Full packed examples pass                             |
| Medium   | U-9 Linux Firefox crashed in axe after role-query interactions and palette rollback | `11c6d07` repeats both real clicks and the visible hint on an independent scan page; state, event history and control projections must match | All 20 compact cases pass; default axe rules retained |
| High     | U-10 Linux WebKit forced-dark text contrast fell to 1.819:1                         | `167582d` uses Canvas/CanvasText for Donate rest, hover and focus; diagnostic output names any low-contrast text                             | All 55 relevant site cases pass; 4.5:1 gate unchanged |

The 460-case local site run preceded U-10; the 55-case corrective run covers all
changed homepage states across five projects. The fresh CI and Pages jobs then
passed the complete site suite, including Linux WebKit forced-colour hover states. The
initial verification jobs passed npm verify but failed their additional packaged
example check; the initial Pages deploy was correctly skipped after its site gate
failed. No failed deployment is described as live success.

All 15 CI jobs passed on `67b24ad`, including Node 20/22 verification, packed
examples, all browser/device projects and both native-macOS trend jobs. Pages built
and deployed successfully. No Blocker, High or Medium finding remains unresolved
in the verified scope. Heap
recorder isolation changes diagnostics only: warmups, measured lifecycle count,
forced GC, WeakRefs, confidence bound and zero-residue assertions are unchanged.
Transient allocations remain visible in raw samples; no claim of identical byte
counts is made. There are no new skips, axe exclusions or retries.

## Audits

### Accessibility

- Zero axe violations across 280 site profiles, both open and closed. Minimum
  measured site text contrast: 6.045:1; widget text: 6.848:1. Raw minimum input
  target: 24 px; visible action buttons and option hit areas retain 44 px targets.
- Some axe colour-contrast checks return incomplete results; these are recorded
  in the JSON rather than described as automatic passes. Computed solid-colour
  measurements supplement them; human visual/assistive checks remain necessary.
- Real-browser keyboard walks changed every feature, reset, closed with Escape,
  restored launcher focus and left the non-modal panel for host controls. The site
  walk visited its navigation pages through keyboard input. These are Playwright
  keyboard executions, not claimed screen-reader sessions.
- The popup measured 400 × 680 px on desktop and 304 px wide at a 320 px viewport,
  with equal mobile scroll/client widths (302 px). The enlarged-text clipping and
  focus-obscuration tests pass. Reduced motion, forced colours, dark scheme, RTL,
  320 × 256 reflow and supported pinch zoom are covered.
- Icon-only alignment controls retain native radio names and arrow keys. Switches
  retain stable names and aria-pressed. SVGs are decorative; changes use the live
  region. Tooltips support hover/focus, Escape and lifecycle cleanup.
- Updated human checks explicitly cover shortcut/full-control name verbosity and
  option names. NVDA, VoiceOver, TalkBack and physical devices were not run.

### Security and privacy

The widget adds no runtime requests, cookies, new storage keys, unsafe HTML parsing
or dependencies. All five site projects recorded zero third-party requests; feature
interactions added no requests, cookies stayed empty, and only the existing settings
key was written. Strict CSP cases pass with constructed sheets and nonce fallback.
The Donate button does not navigate or collect a payment. No credentials were read,
modified or published; no npm publication command was run.

### Performance and size

The IIFE is **23,728 gzip bytes**, below the unchanged 35 KB budget (569 bytes above
the preceding 23,159-byte baseline). Shortcut controls and hint DOM remain lazy.
The original 200-lifecycle cleanup and post-GC growth tests pass. Precise heap
measurements use CDP on Chromium/Pixel; all five projects prove DOM/listener cleanup.
No fresh reference-Mac init-time pass is claimed. The 50 ms reference gate and CI
50% regression guard are unchanged. Shared-CI trend results on `67b24ad`:

| Node | Chromium median / p95 | WebKit median / p95 | Result                     |
| ---- | --------------------- | ------------------- | -------------------------- |
| 20   | 1.8 / 3.2 ms          | 3 / 5 ms            | Both unchanged guards pass |
| 22   | 1.2 / 2.2 ms          | 3 / 5 ms            | Both unchanged guards pass |

Raw samples and machine details: [Node 20](assets/toolkit-ui-refresh/ci-init-node20.json),
[Node 22](assets/toolkit-ui-refresh/ci-init-node22.json). These are CI trend results,
not absolute measurements on the maintainer's reference Mac.

## Known limitations (honest)

Real devices and screen readers still require the supplied human script. Automatic
axe success is not a site-conformance certification. The old Pages path is no longer
the canonical deployment path. Donation collection is deliberately unavailable.
Existing public npm/CDN releases do not automatically receive repository changes;
publication remains a human action under AGENTS.md §2.1.

## Deviations from the prompt (and why)

Visible branding changes to Accessibility while legacy JavaScript/type/storage
identifiers remain compatible under AGENTS.md §5. Forced colours use the system
link colour rather than literal blue to respect AGENTS.md §7. This unnumbered
follow-up uses this report instead of inventing a numbered phase or moving tags.
The repository/Pages migration was explicitly confirmed by the maintainer.

## Handoff notes for the next phase

Deployed and verified: https://qasimfida.github.io/accessibility/.
Source `67b24ad`: [CI passed](https://github.com/qasimfida/accessibility/actions/runs/45396697090)
(15/15 jobs); [Pages passed](https://github.com/qasimfida/accessibility/actions/runs/45396697245)
(build and deployment). [Receipts](assets/toolkit-ui-refresh/deployment-receipts.json).

The live audit visited all eight pages in Chromium, Firefox and WebKit: 24 page
checks, zero open/closed axe violations, 37 internal destinations/fragments
verified, zero third-party requests, zero console errors and no cookies. The removed
Pricing route returns 404. The live popup has four shortcuts, Accessibility branding
and the 400 × 680 px frame; every route has the matching shared logo. The served
IIFE SHA-256 matches the local production build exactly. See [live audit](assets/toolkit-ui-refresh/live-verification.json)
and [bundle identity](assets/toolkit-ui-refresh/live-build.json).

Run the supplied human screen-reader/real-device checks, provide a donation URL
when collection is ready, and publish a new npm version if external consumers
should receive this redesign. No npm publication was performed.

Screenshots: [desktop](assets/toolkit-ui-refresh/desktop.png),
[switches](assets/toolkit-ui-refresh/switches.png),
[mobile alignment](assets/toolkit-ui-refresh/mobile-alignment.png),
[integration icons](assets/toolkit-ui-refresh/integration-icons.png),
[support](assets/toolkit-ui-refresh/support.png).

## Commit list

```text
3706df0 style(brand): rename the visible product to Accessibility
9d52e4f style(logo): refine the shared open-orbit accessibility mark
a293d92 style(close): show focus through the blue icon without a border
ceea268 style(switches): keep cards neutral and remove repeated state text
7100412 feat(options): render alignment icons and retain cursor artwork
d5942a5 feat(panel): add four registry-driven header shortcuts
21f41ed style(panel): tighten header and card spacing without shrinking targets
ad2e5b6 test(brand): expect the renamed About page landmark
b269e8c style(integrations): add local framework and language icons
a1f9e7d feat(site): replace the pricing page with optional donation support
92140ec fix(tooltips): preserve keyboard hints after focus scrolling
ade0595 test(panel): cover compact shortcuts and icon-only options
6094818 docs(design): define compact Accessibility branding and support patterns
257e6ff build(preview): refresh the real compact Accessibility panel image
ccd428c test(keyboard): derive traversal length from the rendered controls
586a4c2 test(heap): exclude the trace recorder from lifecycle measurements
92811ab build(pages): align URLs with the renamed accessibility repository
119fdca docs(a11y): extend human checks for shortcuts and icon choices
8641e52 fix(header): leave room for enlarged title glyphs in Firefox
fce7578 fix(motion): animate the support section instead of the removed plan
077723b style(panel): reduce the desktop popup frame to 400 by 680
2e2685b fix(close): preserve focus colour changes in forced-colours mode
f8be5aa docs(evidence): capture compact popup and homepage refinements
d61cab8 docs(report): record verified Accessibility UI refinements
0154e24 test(examples): measure the painted close focus indicator
11c6d07 test(axe): isolate scans from role-query instrumentation
167582d fix(donate): keep forced-colour text on the matching system palette
67b24ad docs(report): record platform-specific CI findings and fixes
```
