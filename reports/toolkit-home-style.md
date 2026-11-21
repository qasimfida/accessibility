# Toolkit UI — home page alignment

Status: PASS WITH NOTES
Date: 2026-11-21
Range: e9afb98 → fb7d47b (implementation), followed by report commit.

## Summary

Aligned the real toolkit with the current home page: navy #0a2540, blue #0047d8,
warm paper, white cards, regular-weight heading typography and 12 px action
corners. The panel has a flat paper header, 24 px frame, 20 px cards, clearer
labels/descriptions and a blue Reset action. The home page artwork is a fresh
capture of the actual updated panel.

## What changed (files and why)

- `src/ui/launcher-styles.ts`: shared palette and 16 px system-font foundation;
  keep the startup stylesheet small and immediately usable.
- `src/ui/styles.ts`: flat header, regular 22 px title, roomier spacing, matching
  frame and close control. Extra title leading prevents enlarged Firefox ink
  from clipping.
- `src/ui/card-styles.ts`: 16 px labels, 14 px descriptions, matching rounded
  action shapes, clear selected states, primary Reset and hover fills.
- `e2e/panel-design.spec.ts`: measure the actual solid header background instead
  of assuming a gradient. The existing 4.5:1 contrast assertion is unchanged.
- `docs/design-system.md`: document toolkit use of the home page tokens.
- `site/public/images/toolkit-white.png`: replace stale artwork with a real
  440×760 browser capture. No mockup or copied reference artwork.

All eighteen controls still come from registry metadata. No API, lifecycle,
feature-value, persistence, dependency or benchmark-policy change was made.

## Verification

- Full `npm run verify`: PASS, 198 unit tests, 62 files; seven performance-script
  tests; lint, typecheck, build, SSR, size, publint and attw pass. Core coverage
  remains 98.63% lines and 97.96% branches.
- Clean build followed by panel accessibility/design, interaction/layout and
  CSP: **95 passed in 1.7 minutes**, two existing Firefox/WebKit CDP pinch-zoom
  capability skips. All cases run once with the CI worker configuration; no
  retries, removed assertions or new skips.
- Focused production-site media/landing checks: **15 passed in 19.3 seconds** across Chromium,
  Firefox, WebKit, iPhone and Pixel. Asset content types and hero caption
  clearance remain covered.
- Native keyboard walkthrough opened with Alt+A, traversed controls, closed with
  Escape and confirmed launcher focus return. Exactly one host; no requests
  after the fixture loaded. [Keyboard receipt](assets/toolkit-home-style/keyboard.json).
- Browser observation confirms full panel rules are absent while closed: the
  previous lazy-stylesheet optimization remains in place.
- Full and production-only npm audits: zero vulnerabilities. No dependencies or
  lockfile changes.

[Raw measurements](assets/toolkit-home-style/checks.json).

## Review findings and fixes

| Severity   | Finding                                                                                     | Fix                                                                                    | Status                                   |
| ---------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ---------------------------------------- |
| Medium R-1 | Filled Reset initially lacked a contrasting border in the UI audit                          | 68fe368 adds an accent-ink border and explicit forced-colour reset treatment           | Fixed                                    |
| Medium R-2 | Firefox reported 2 px of title ink clipping with enlarged text                              | 3e7d5d8 increases title leading without reducing user text size                        | Fixed                                    |
| Low R-3    | First local parallel verification overlapped a bundle rebuild and showed CSP/focus failures | Final production build completes before browser tests; all cases run serially as in CI | Final run passes; no retry setting added |

Initial failed runs remain failures, not conformance evidence. No Blocker or High
findings remain in the reviewed implementation.

## Audits

### Accessibility

Axe reports zero violations in the final tested states, including open/closed,
light/dark, forced colours, reduced motion and 320×256. Minimum measured target:
24 px (native radio); actions remain at least 44 px. Normal text and focused
close-control contrast: at least **7.259:1**; control-boundary contrast at least
**3.805:1**. Focus is a 3 px solid outline. The flat light-header bound is
**7.586:1**. No contrast assertion was lowered or excluded.

Keyboard tab order, shortcuts, no trap, focus return, author zoom isolation,
text enlargement, text spacing and strict CSP cases pass. Desktop/mobile frame
bounds and horizontal overflow remain tested. Dark/system-colour variants retain
OS preferences even though the marketing site itself uses a light brand theme.
No bundled or fetched widget font is introduced; the system stack keeps it local.

[Light](assets/toolkit-home-style/light.png),
[dark](assets/toolkit-home-style/dark.png),
[forced colours](assets/toolkit-home-style/forced.png),
[mobile](assets/toolkit-home-style/mobile.png) and
[RTL](assets/toolkit-home-style/rtl.png) captures show the real panel.

### Security and privacy

No network calls, storage changes, unsafe DOM APIs, credentials or dependencies
were introduced. Decorative SVGs remain original and hidden from assistive
technology. Existing nonce-capable stylesheet ownership and complete teardown
remain unchanged.

### Performance and size

Full panel styles and controls still prepare on first open, before the dialog
is shown. No new motion timers, continuous loops or layout reads were added.
Hover feedback changes colour rather than moving focus targets. No fresh official
reference-Mac absolute timing result is claimed for this styling task.

IIFE: **66,478 raw bytes, 21,918 gzip bytes**, below the unchanged 35 KB gate.
Both native macOS init-trend jobs passed on source fb7d47b: [Node 20](https://github.com/qasimfida/accessiblit/actions/runs/44921832759/job/136899350070) and [Node 22](https://github.com/qasimfida/accessiblit/actions/runs/44921832759/job/136899350185). The original baselines and 50% guard are unchanged. [Native CI status](assets/toolkit-home-style/native-ci.json). No new native median is quoted because only job status was retrieved.

## Known limitations

- Human screen-reader testing and physical devices remain unverified.
- The final browser run uses one worker, matching CI. Earlier local concurrent
  checks had focus instability and mixed build inputs; they are disclosed above.
- The widget retains a system font rather than fetching the site's Manrope file.
- The site demo uses the local build. Historical CDN/package consumers receive
  updated styling only when the human publishes a corresponding release.

## Deviations from the prompt

None to the requested styling. System dark/forced-colour appearances are preserved
as required by AGENTS.md. This unnumbered follow-up does not invent a phase tag.
No registry publication was attempted.

## Handoff notes

Review the refreshed toolkit on the demo site after Pages deployment. Human
assistive-technology checks and npm publication remain separate handoff tasks.

## Commit list

- f432d3e style(toolkit): share the home page palette and action corners
- 1228d75 style(panel): adopt a flat paper header and editorial typography
- ad1c57c style(controls): match home page cards and primary actions
- 68fe368 fix(reset): preserve contrasting borders in every colour scheme
- 3e7d5d8 fix(panel): allow regular title ink to grow without clipping
- fb7d47b style(site): refresh the toolkit preview from the live panel
