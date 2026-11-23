# Compact popup and shared logo

Status: PASS WITH NOTES
Date: 2026-11-23 (Asia/Karachi)
Commit range: `324dd22..HEAD` on main (unnumbered follow-up).

## Summary

The popup now has paired binary cards, blue selected states, On/Off switches,
icon choices, borderless close styling, themed action hints and an original shared
logo. The previous Firefox blocker is resolved. The complete site suite and
relevant runtime checks pass without disabling axe rules or retries.

## What changed (files and why)

- `src/ui/toggle.ts`, card styles and radios make binary controls compact without
  repeating names. Native buttons retain aria-pressed; native radios retain arrow
  key behavior. Selection has a checkmark or switch position as well as colour.
- Tooltip/controller/launcher modules provide lazy hover and keyboard hints,
  dismissible with Escape, with scroll/viewport cleanup. Light hints are black with
  white text; dark hints invert these colours. Construction waits for attention.
- `src/ui/brand.ts` holds the original editable SVG master. `sync-brand.mjs`
  synchronises header/footer marks, favicon and social images on all nine routes.
  `capture-toolkit.mjs` refreshes the marketing PNG from the real built popup.
- `docs/branding.md`, README and the design system explain editing and regeneration.
  The public API and storage schema are unchanged.

## Verification (commands run, real results)

- Started clean on main; `git pull --ff-only`: already up to date.
- Before each commit: lint, typecheck and 46 UI tests passed.
- `npm run verify`: PASS, 198 unit tests / 62 files; build, SSR, size, publint,
  attw and seven performance-statistics tests passed.
- Core coverage: 98.63% lines, 97.96% branches; overall branches: 90.16%.
- Relevant runtime suite: 118 passed, two existing CDP-only zoom skips, 1.3 minutes.
- Final compact suite with default axe traversal: 20 passed, 20.4 seconds across
  Chromium, Firefox, WebKit and emulated iPhone/Pixel. No retries added.
- Full `npm run test:site -- --workers=1`: 495 passed, 8.9 minutes. Includes 315
  page/profile states, open and closed axe, links, network, persistence and keyboard.
- `npm run test:site-snippets`: passed, 11 extracted snippets, consumer TypeScript
  Node16/bundler, 18 browser executions and React/Next StrictMode cleanup.
- Full and production npm audits: zero vulnerabilities; no dependency changes.

Machine-readable results: [verification](assets/compact-popup/retry/verification.json),
[branding review](assets/compact-popup/retry/browser-review.json).

## Review findings and fixes

| Severity | Finding                                             | Fix                                                            | Status |
| -------- | --------------------------------------------------- | -------------------------------------------------------------- | ------ |
| Medium   | C-1 selected switch/icon contrast                   | `5989381` contrasting boundaries and icons                     | Fixed  |
| Blocker  | C-2 Firefox crashed in axe after palette rollback   | `aa037fc` stable explicit toggle names matching visible labels | Fixed  |
| Medium   | C-3 tooltip layering and landmark semantics         | `6dfae53`, `3f76414` separate named hint layer                 | Fixed  |
| Medium   | C-4 launcher lacked lazy hints                      | `ed16c19` hover/focus hints and viewport handling              | Fixed  |
| Medium   | C-5 closed launcher hint ignored Escape             | `04f1608` dismiss without opening or consuming host Escape     | Fixed  |
| Low      | C-6 relative README guide missing from npm contents | `250a6f7` absolute source guide link                           | Fixed  |

Firefox diagnosis: the crash persisted with tooltip DOM removed or hidden. Replacing
external toggle aria-labelledby references with explicit names matching the visible
headings eliminated it. This isolates the triggering reference pattern; browser
internals were not independently diagnosed. `1373c7d` restored default axe iframe
traversal after the fix. The earlier three failed attempts remain recorded in git.
No gate was weakened. Self-review found no remaining Blocker, High or Medium issue.

## Audits

- Accessibility: zero axe violations in 315 site states. Minimum measured site text
  contrast 6.045:1, widget text 6.848:1, panel boundary 3.805:1; minimum target 24 px.
  Keyboard browser walks followed skip link → main → demo → close → increase text →
  reset → Escape → restored launcher, then all navigation pages; no errors on five
  projects. Reduced motion, forced colours, dark scheme, RTL and 320×256 tested.
  Hints remain hoverable and dismissible; keyboard focus remains visible.
- Security/privacy: no runtime requests, cookies or new storage keys. All five site
  projects recorded zero third-party requests. Strict CSP tests passed. Local SVG
  paths are validated; text uses safe DOM APIs. No dependencies or secrets added.
- Performance/size: IIFE 23,174 gzip bytes, below 35 KB. Tooltip work is lazy.
  No fresh reference-Mac timing is claimed; committed timing baselines and guards
  are unchanged.

## Known limitations (honest)

Physical devices and screen readers were not tested. Mobile evidence uses emulation.
The prepared `@widgets/accessibility` package still returned registry HTTP 404 in
this session; this change does not publish a package. Site demos use the local build.

## Deviations from the prompt (and why)

The close button has no resting border and turns blue on hover/focus, but retains a
keyboard focus outline to satisfy AGENTS.md §7. Logo editing is source-level through
one master, not a new public option or runtime URL. This unnumbered UI follow-up
creates no invented phase tag and does not move existing phase tags.

## Handoff notes for the next phase

Deployment checks are pending the push. Human screen-reader and real-device checks
remain necessary; the human must publish any npm release under AGENTS.md §2.1.

Screenshots: [selected cards](assets/compact-popup/retry/selected-cards.png),
[mobile](assets/compact-popup/retry/mobile.png),
[launcher hint](assets/compact-popup/retry/launcher-hint.png),
[dark hint](assets/compact-popup/retry/dark-hint.png).

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
1750730 docs(report): record compact popup implementation and Firefox blocker
aa037fc fix(toggles): keep accessible names stable after palette rollback
ed16c19 feat(tooltips): cover launcher focus and viewport changes lazily
04f1608 fix(tooltips): dismiss launcher hints without opening the panel
75d653c build(previews): capture the real compact toolkit for the website
72ec22a docs(branding): explain editable artwork and compact control patterns
250a6f7 docs(branding): resolve the guide link for npm consumers
1373c7d test(panel): restore default axe traversal after the name fix
9b0bd2b docs(evidence): record verified compact UI and shared branding
```
