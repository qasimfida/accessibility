# UI maintenance — Navigation, footer and page motion

Status: PASS WITH NOTES
Date: 2026-11-26
Commit range: `f0574aa..fd04973` plus this evidence/report commit.

## Summary

Implement all eight requested website fixes. Breadcrumbs are removed, the footer
has a Project column, fragment links scroll smoothly, inner heroes align,
backgrounds have quiet local textures, mobile navigation uses a top drawer, the
mobile footer is compact and all routes receive progressive scroll-entry motion.
The library API and toolkit runtime are unchanged.

## What changed (files and why)

| Commit    | Logical change                                                                                                                                          |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `5ca2250` | Update `docs/design-system.md` for the requested texture, navigation and motion rules.                                                                  |
| `6fdbb45` | Remove breadcrumb rows from all eight authored HTML routes.                                                                                             |
| `0ee49ea` | Move About, Contact and Options reference into the shared Project column, between Toolkit and Integrations; compact the footer into two mobile columns. |
| `e532ed7` | Put inner hero eyebrow, title and lede on one centre axis at desktop and 320 px.                                                                        |
| `c080fa5` | Use native smooth fragment scrolling, preserving URLs/history and motion preferences.                                                                   |
| `d5b45a4` | Add native disclosure navigation with a top drawer, keyboard/outside dismissal, responsive available height and no-JavaScript navigation.               |
| `b0ad296` | Add CSS dot textures and outlined orbits behind heroes; no images or requests.                                                                          |
| `7b63124` | Extend one-time, interruptible entry motion to inner sections and footer groups, avoiding nested transforms.                                            |
| `3ec2ff6` | R-1: audit both disclosure states instead of assuming mobile navigation is always exposed.                                                              |
| `a096f03` | R-2: retain full link opacity throughout drawer entry.                                                                                                  |
| `50bc2c1` | R-3: prevent card-resizing hover feedback by selecting only on actual pointer movement.                                                                 |
| `fd04973` | R-4: tab forward through mobile links after opening Menu.                                                                                               |

## Verification (commands run, real results)

- Started on clean `main`; `git pull --ff-only` returned already up to date.
- Node `v24.13.0`; no package-manager or dependency changes.
- Fast lint/type checks ran before every commit; applicable browser tests passed
  before their commits. Source-only HTML/CSS changes have no related unit modules.
- `npm run verify`: lint, types, 200 unit tests in 62 files, seven performance-helper
  tests, ESM/CJS/IIFE/types build, plain Node SSR check, size, publint and attw pass.
  Core line coverage 98.63%; branch coverage 97.96%.
- Full site Playwright matrix (`npx playwright test --config playwright.site.config.ts --workers=2`; configured retries remain zero): **560 passed in 6.8 minutes**, zero retries and no skipped tests; all five projects pass. Raw aggregate evidence: [browser-summary.json](assets/ui-fixes/browser-summary.json).
- Targeted drawer contrast checks: 15 passed across all five projects. Targeted
  product-card behaviour: 20 passed across all five projects.
- Nu HTML Checker 26.11.20: zero errors and zero warnings across built HTML, CSS
  and SVG. The 188 informational messages concern Prettier's harmless trailing
  slashes on quoted void elements. Raw output: [standards.json](assets/ui-fixes/standards.json).
- `npm audit` and `npm audit --omit=dev`: zero vulnerabilities.
- Lighthouse: desktop homepage scores 100 in all four categories; detailed metrics and raw evidence are below.

## Review findings and fixes

| Severity | Finding                                                                                                          | Fix                                                                                                                                           | Status |
| -------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| Medium   | R-1: old test required navigation to be exposed even when the new mobile disclosure is closed.                   | `3ec2ff6`: assert the appropriate state, open and audit the drawer, test Escape focus return.                                                 | Fixed  |
| High     | R-2: opacity animation could briefly lower navigation contrast below AA.                                         | `a096f03`: remove the fade, retain transform-only entry; keep axe rules unchanged.                                                            | Fixed  |
| Medium   | R-3: resizing cards beneath a stationary pointer repeatedly fired entry events and prevented animation settling. | `50bc2c1`: select on actual pointer movement; guard animation completion and selected state.                                                  | Fixed  |
| Medium   | R-4: the keyboard test continued reverse Tab after opening Menu, correctly leaving and closing the drawer.       | `fd04973`: enter the disclosure with the existing reverse path, then tab forward through its links; all five targeted keyboard journeys pass. | Fixed  |

Initial drawer development also found wrapped columns on short screens; the
initial drawer commit fixes vertical no-wrap scrolling and measures available
height after the homepage announcement. One outside-click test targeted a hero
covered by the drawer; it now clicks the visible page gutter. The 404 motion
check now records real animation calls because its footer may already have
completed its entry before the test reaches it. No test retries, axe exclusions,
threshold reductions or timeout increases were introduced.

## Audits

### Accessibility

- Matrix: Chromium, Firefox, WebKit, emulated iPhone and Pixel. Every route is
  checked in light, dark, forced-colours, reduced-motion, RTL, 320 × 256 and
  increased-text-spacing profiles, with the toolkit closed and open.
- Zero axe violations in 280 route/profile cases, each with the toolkit closed and open, plus open-drawer audits. Minimum measured site text contrast **6.045:1**; widget **6.848:1**. Minimum site target **36 px**; widget **24 px**. No horizontal overflow was introduced.
- Browser keyboard walk (Playwright-driven headless Chromium): focused Menu, pressed Enter, inspected the six
  navigation links, pressed Escape, confirmed focus returns to Menu and scrolled
  to the footer. The automated full keyboard journey additionally visits all
  content pages and operates/reset/closes the real toolkit. Recorded evidence:
  [manual-browser.json](assets/ui-fixes/manual-browser.json).
- Drawer summary and links measure 44 px high; links measure 260 × 44 px at a
  320 px viewport. Footer targets measure at least 36 px high on small screens.
- The drawer is a native non-modal disclosure: no focus trap; Escape returns
  focus, moving focus outside closes it, and links retain normal navigation.
  Native disclosure and links work with JavaScript disabled.
- Reduced motion, forced colours, print and Stop animations suppress decorative
  motion. Keyboard focus cancels entry motion. Content never waits for animation
  to become visible. Fragment links preserve browser history and ordinary
  cross-document navigation; smooth scrolling applies to in-document movement.
- Screenshots: [home](assets/ui-fixes/home-desktop.png),
  [documentation](assets/ui-fixes/documentation-desktop.png),
  [mobile drawer](assets/ui-fixes/mobile-drawer.png),
  [mobile footer](assets/ui-fixes/mobile-footer.png).

### Security and privacy

No new dependencies, fetches, cookies, analytics or storage. Backgrounds are CSS
only. Navigation uses static native links, not dynamic HTML. Its listeners share
an AbortController, pending animation frames are cancelled, and its owned root
CSS variable is restored when the drawer closes. A real page unload disposes
listeners; BFCache navigation closes the menu while preserving resumable
listeners. Library storage and CSP behaviour are untouched.
All eight routes passed first-party request checks in every project: 44 requests per project (Firefox 52), zero third-party hosts, no cookies, and no requests triggered by toolkit feature interactions. Storage remains restricted to the existing `accessiblit:v1` key.

### Performance and size

IIFE gzip remains **23,744 bytes**, below the unchanged 35,000-byte limit.
The site reuses its existing Motion dependency; no new image/font downloads.
Entry effects animate transforms and release final fill effects; textures are
static. Drawer sizing batches one header geometry read before one root-variable
write, only while open. No per-frame page-node scanning.
One fresh desktop Lighthouse 13.6 run of the built homepage under `/accessibility/`: **performance 100, accessibility 100, best practices 100, SEO 100**. FCP and LCP **526.98 ms**, TBT **0 ms**, CLS **0**, measured transferred page weight **303,946 bytes** on the local uncompressed preview. This is a desktop lab result, not a new live/mobile or universal score claim. [Raw result](assets/ui-fixes/lighthouse-desktop/home-1.json) and [summary](assets/ui-fixes/lighthouse-desktop/summary.json).
The reference-Mac `init()` benchmark was not rerun: this change does not alter the
library runtime, and no new absolute timing result is claimed.

## Known limitations (honest)

- Screen-reader sessions and physical mobile devices were not run; emulation and
  browser keyboard/axe evidence do not replace those checks.
- Nu syntax validation and automated axe checks are evidence, not a claim of
  complete W3C/WCAG conformance. Axe lists colour-contrast incompletes for some
  non-solid/composed content; the existing computed solid text checks also run.
- The previous report records an intermittent shared-CI heap-trend failure. This
  website change does not modify that test, its threshold or the widget engine.
  No fresh full library CI pass is claimed in this report.
- Deployment status: Pages deployment is pending its automated build after this changeset is pushed. The local production build and project base path are verified; no new live deployment success is claimed.

## Deviations from the prompt (and why)

This is an unnumbered UI maintenance request, so the report uses a descriptive
filename and does not create or overwrite a numbered phase-completion tag.
Smooth scrolling deliberately yields to reduced motion, forced colours and Stop
animations. New background artwork is original CSS rather than copied reference
assets. The fresh Vercel Web Interface Guidelines were consulted through the
`web-design-guidelines` skill; the reference was inspected in Chromium at
1440 × 1000, including its 50 px regular-weight heading.

## Handoff notes

After the Pages workflow deploys, check the mobile Menu drawer, footer Project
column and an installation fragment link at `/accessibility/`. Human
screen-reader and real-device checks remain useful. Publication is not part of
this task and no npm publish/login/token command was run.
