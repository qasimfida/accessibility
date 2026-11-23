# Compact popup and shared logo

Status: BLOCKED
Date: 2026-11-23 (Asia/Karachi)
Commit range: `324dd22..HEAD`, local main; not pushed.

## Summary

Implemented a compact two-column binary-control layout, selected blue cards,
On/Off switch indicators without repeated feature names, custom icon radio
choices, borderless close styling, themed action tooltips and an original shared
accessibility logo. Acceptance is blocked by Firefox crashing during axe analysis
in two new real-feature tests. Three attempts reproduced the crash. AGENTS.md §11
requires stopping; no failing build was pushed or deployed.

## What changed (files and why)

- `src/ui/toggle.ts`, `card-styles.ts`, `radios.ts`: two binary cards per row,
  blue selected surfaces, On/Off state text, switch tracks, icon choices with native
  radio semantics and arrow keys. Feature names remain visible once.
- `tooltip.ts`, controller, panel and steppers: lazy owned tooltip layer, black/white
  colours inverted in dark mode, hover/focus display, scroll/resize dismissal and
  cleanup. Escape retains the existing close-panel contract. Close and stepper
  actions have tooltips. Launcher-specific themed tooltips remain unfinished.
- `brand.ts`: original open-orbit person mark shared by launcher and panel.
  `scripts/sync-brand.mjs` synchronises site header/footer marks, favicon and SVG/PNG
  social images. The logo uses inline vectors without runtime requests.
- New browser tests cover paired cards, selected states and tooltip schemes.

To edit the logo, change `BRAND_PATH_DATA` in `src/ui/brand.ts`, run
`node scripts/sync-brand.mjs`, then `npm run format` and rebuild. The script needs
installed Playwright Chromium to render the social PNG. This is editable source
branding, not a new public JavaScript option or an in-widget logo editor.

## Verification (commands run, real results)

- Started clean on main; `git pull --ff-only` was up to date.
- Before each commit: lint, typecheck and 46 UI unit tests passed.
- `npm run verify`: passed; 198 unit tests / 62 files, performance-statistics tests,
  SSR checks, build, size and package/type checks.
- Core coverage: 98.63% lines, 97.96% branches. Overall branches: 90.27%.
- Final relevant browser run: **111 passed, 2 failed, 2 existing skips, 1.4 minutes**.
  Both failures: Firefox compact-card tests at 390 and 320 px, during
  `AxeBuilder.analyze()` → `frame.evaluate: Page crashed`.
- Three browser runs were made. Initial contrast failures were fixed; the Firefox
  process crash persisted across all three. No retries or axe rules were disabled.
  The plain fixture contains no iframes; the new test uses the existing iframe-free
  audit mode. Other existing scans retain their original configuration.
- Full and production-only npm audits: zero vulnerabilities.

## Review findings and fixes

| Severity | Finding                                                         | Fix                                                                | Status                                     |
| -------- | --------------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------ |
| Medium   | C-1 selected switch and close contrast declarations             | `5989381` contrast borders; borderless close uses contrasting icon | Fixed                                      |
| Blocker  | C-2 Firefox process crash during the full-feature tooltip audit | `6dfae53` separated popover layers                                 | Unresolved                                 |
| Medium   | C-3 standalone tooltip text outside a landmark                  | `3f76414` named complementary wrapper and explicit tooltip name    | Other scans pass; Firefox blocker persists |

## Audits

- Accessibility: two-column reflow, pressed states, native radio keyboard handling,
  tooltips and focus return passed outside the two crashing Firefox cases.
  Completed panel measurements showed 24 px minimum targets, at least 6.847:1
  text contrast and 3.805:1 boundary contrast. Keyboard focus remains 3 px.
  Full all-state axe success cannot be claimed. Physical devices and screen readers
  were not tested. Keyboard/browser scenarios were run through Playwright.
- Security/privacy: no dependencies, runtime requests, cookies or storage keys added.
  Tooltip CSS uses owned sheets and nonce support; all strict-CSP cases passed in
  the final run. Labels use textContent; branding is validated local SVG source.
- Performance/size: IIFE **23,048 gzip bytes**, below 35 KB. Tooltip construction
  remains deferred until panel opening. No fresh reference-Mac timing is claimed.

## Known limitations (honest)

The Firefox/axe crash has no proven root cause yet. Do not treat it as harmless or
ship around it by removing the checks. Marketing screenshot previews still show
the previous panel and should be regenerated after the blocker is resolved.
The complete site matrix and live deployment checks were not run for this blocked
change. The deployed site remains the previously verified version.

## Deviations from the prompt (and why)

The close control is borderless at rest and uses the blue icon on hover/focus;
keyboard focus retains a visible outline because AGENTS.md §7 requires it.
The logo is editable from one source rather than through a new public API option.
This unnumbered follow-up has no phase tag. No push was made because the browser
acceptance gate remains blocked after the permitted three attempts.

## Handoff notes for the next phase

Resume investigation of the Firefox/axe process crash with the two named tests;
retain all accessibility rules and scenarios. Finish launcher tooltip coverage,
refresh marketing previews, then run the complete site matrix, full verify and
closing audits before pushing. The current local implementation is reviewable:
[selected cards](assets/compact-popup/selected-cards.png),
[mobile popup](assets/compact-popup/mobile.png).

## Commit list

```text
f9efc5d style(panel): compact binary controls into selectable switch cards
8dd2ae4 feat(tooltips): add themed dismissible action hints
93443c0 feat(brand): share an editable original logo across widget and site
5ba04c9 style(controls): replace native markers with labelled icon choices
473f6be test(panel): cover compact cards and themed action tooltips
5989381 fix(controls): preserve selected-switch and icon contrast
6dfae53 fix(tooltips): separate hint and dialog popover layers
3f76414 fix(tooltips): give sibling hints a named landmark
```
