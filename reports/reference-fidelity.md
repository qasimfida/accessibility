# Reference fidelity — product website

Status: PASS WITH NOTES
Date: 2026-11-21
Range: ef50d00 to the closing report commit

## Summary

Inspected https://accessibe.com/accesswidget in real Chromium at 1440×1000,
including native scroll, hover selection and active animation keyframes. The
previous implementation diverged through its automatic dark marketing theme,
large tightly tracked heading, pill actions, smaller product artwork and static
card widths. This change corrects those differences with original application
copy and locally owned assets.

## What changed

| Detail           | Browser observation on reference                          | Implemented treatment                                                                   |
| ---------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Hero type        | 50 px, 60 px line height, regular weight                  | 50/60 px at 1440, weight 400, relaxed tracking                                          |
| Section headings | 36 px geometric headings                                  | Regular 36 px desktop scale and more open leading                                       |
| Palette          | Navy #0a2540, electric blue #0047d8, warm white           | Shared light site tokens; system colours retain priority                                |
| Buttons          | 12 px corners, approximately 53 px tall                   | 12 px corners, real native actions and generous targets                                 |
| Container        | Approximately 1300 px wide at 1440                        | 81.25 rem maximum, 70 px desktop gutters                                                |
| Hero scenes      | Wide browser panels converge horizontally                 | Original layered browser scenes converge with 1 second transforms                       |
| Product cards    | Hover changes the expanded card                           | Pointer selection and equivalent stable keyboard buttons; 450 ms FLIP transforms        |
| Navigation       | Floating rounded header remains available while scrolling | Desktop sticky header with anchor/focus clearance; static mobile header                 |
| Artwork          | Product-specific demonstrations                           | Existing original illustration/photo and the actual toolkit capture; no borrowed assets |

`docs/design-system.md` now records the measured baseline. The marketing website
keeps a light brand presentation under either OS appearance, addressing the
attached dark screenshot. The independently themed widget still honours OS dark
appearance, forced colours and visitor feature settings. Theme metadata matches
the actual page backgrounds.

`site/src/motion.ts` animates content once and waits until hero panels are half
visible before starting convergence. Product selection lives in the small
`journey.ts` module; layout reads are batched around one selection update, with
no per-frame layout reads or continuous scroll listener. Focus, reduced motion,
forced colours, print, hidden tabs and Stop animations cancel appropriate effects.
Mobile travel is shorter to protect the caption. All text remains visible without
JavaScript or motion.

Shared website typography, colours, buttons and surfaces apply to all nine routes.
No changes were made to the library's public API or widget lifecycle.

## Verification

Final command outcomes are recorded after the closing browser run.

## Review findings and fixes

| Severity   | Finding                                                                 | Fix                                                                     | Status |
| ---------- | ----------------------------------------------------------------------- | ----------------------------------------------------------------------- | ------ |
| Medium R-1 | Repeated hero illustration layers and stylesheet import during assembly | e490a54 removes duplicates                                              | Fixed  |
| Medium R-2 | Product-card FLIP effects also needed to stop for printing              | 4bbb2dd cancels print effects and tests print/Stop animations           | Fixed  |
| Medium R-3 | Desktop entry travel could overlap the mobile artwork caption           | 9e21574 limits mobile travel to 12 px and retains overlap assertions    | Fixed  |
| Low R-4    | Shared campaign stylesheet exceeded the module soft limit               | 81eca72 separates document surfaces while preserving cascade order      | Fixed  |
| Medium     | Product entry could run before deliberate scrolling                     | Separate 50% product intersection threshold and browser regression test | Fixed  |

The first matrix was interrupted after identifying the caption defect; its partial
results are not represented as a pass. No threshold, axe rule or assertion was
relaxed. No Blocker or High findings remain in the reviewed implementation.

## Verification

- Full site matrix: **460 passed in 5.5 minutes**, all five browser/device projects and nine authored pages. Axe reports zero violations in all 315 page/profile rows, closed and open. No retries or skips.
- After the final scroll-exposure change, **130 closing regressions passed in 1.7 minutes**, including real motion, keyboard, mobile caption clearance, dark-OS branding, hover selection, print and Stop animations.
- Full `npm run verify`: PASS; 197 unit tests in 62 files, six performance-script tests, lint, typecheck, build, SSR checks, size, publint and attw. Core coverage: 98.63% lines and 97.96% branches.
- Full and production-only npm audit: zero vulnerabilities. No dependency or lockfile changes.
- Browser inspection was performed against the live reference, not inferred from the screenshot. [Measured reference values](assets/reference-alignment/reference-measurements.json); [raw audit rows](assets/reference-alignment/checks.json).

## Review findings and fixes

| Severity   | Finding                                                                      | Fix                                                                        | Status |
| ---------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------ |
| Medium R-1 | Repeated illustration markup and CSS import during composition work          | e490a54 removes duplicates                                                 | Fixed  |
| Medium R-2 | Expanding-card effects also need cancellation for print                      | 4bbb2dd adds print cancellation and real browser coverage                  | Fixed  |
| Medium R-3 | Desktop hero travel could overlap the caption on mobile                      | 9e21574 caps mobile travel at 12 px; existing clearance assertion retained | Fixed  |
| Low R-4    | Shared stylesheet exceeded the module-size guideline                         | 81eca72 separates document surfaces; campaign module is 248 lines          | Fixed  |
| Medium R-5 | Hero could finish animating at the viewport edge before deliberate scrolling | 501305f waits for 50% product exposure and tests the onset                 | Fixed  |

The first browser run was stopped after the caption finding; fixes were committed forward and the full matrix rerun. No gate or assertion was weakened. No Blocker or High findings remain.

## Audits

### Accessibility

Native navigation, actions, descriptions, headings, skip link and non-modal
widget semantics remain. Product-card selection has visible native buttons with
aria-pressed; keyboard selection does not animate the focused control. Mobile
cards stay in one column and keep all descriptions available. Desktop anchors
and focused elements have clearance for the sticky navigation.

The browser comparison confirms one widget host, including under a dark OS;
repeated launcher icons in a stitched long screenshot are not evidence of multiple
instances. Actual host count and computed hero values are recorded in
[comparison.json](assets/reference-alignment/comparison.json).

[Desktop top](assets/reference-alignment/top.png),
[full page](assets/reference-alignment/full.png) and
[mobile](assets/reference-alignment/mobile.png) show this implementation, not
copied reference screenshots. Reference captures stayed outside the repository.

Computed site solid-text contrast is at least **6.045:1**; the smallest measured target is **24 px**. Gradient-related axe incompletes are retained in the raw data rather than counted as automatic passes. Screen readers remain a human check.

[Interaction recording](assets/reference-alignment/interaction.webm), [expanded cards](assets/reference-alignment/cards-expanded.png) and [keyboard/animation observations](assets/reference-alignment/interaction.json) capture the implemented experience. The recorded walk selected cards by pointer and keyboard, opened the widget with Alt+A, closed it with Escape and confirmed launcher focus return. Static screenshots use reduced motion to show resting states.

### Security and privacy

No new dependencies, storage keys, tracking, cookies, remote assets or runtime
network behaviour were introduced. The reference was browsed only during design
inspection. No reference code, proprietary fonts, copy, badges or logos were
copied. The existing local font remains the visual alternative. No registry
writes or credential changes occurred.

### Performance and size

The core IIFE remains unchanged by this website work: **65,869 raw bytes, 21,879 gzip bytes**, below the 35 KB gate. New motion is confined to
the site bundle, uses bounded transform animations and releases effects when
finished or cancelled. No new reference-machine init-time claim is made.

## Known limitations

- This is a close visual and interaction adaptation using original product
  material, not a pixel-identical reproduction with proprietary fonts or assets.
- No rotating customer-logo strip, copied social proof, AI claims, compliance
  promises, tracking or autoplay carousel was introduced.
- Human screen-reader testing and physical devices remain unverified; mobile
  browser testing uses emulation.
- Reduced motion, forced colours and print intentionally suppress effects.
- Existing package-publication availability warnings remain accurate. The site
  demo uses the local build; the historical CDN does not acquire new source
  styling until a human publishes a corresponding release.

## Deviations

The previous automatic dark marketing appearance is replaced by the reference's
light brand presentation. The widget itself retains its OS preference support.
The reference's hover cards gain equivalent explicit controls for keyboard and
touch users. Reference assets and commercial claims are replaced with truthful
application material. This unnumbered follow-up does not invent a phase tag.

## Handoff

Review the light landing page and scroll into the product composition, then hover
or select each product-card control. Try reduced motion and open the real toolkit
under a dark OS. GitHub Pages deploys from main after verification and push.

## Commit list

- 700eebb docs(design): align rules with measured reference typography
- c8584d4 style(site): match reference light palette and measured type scale
- 706fa2d style(hero): compose a wide layered product demonstration
- 4f5b797 style(hero): build a wider layered website composition
- c1f374b feat(motion): converge hero panels with directional scroll reveals
- e490a54 fix(hero): remove repeated illustration layers and stylesheet import
- 5bd85d5 feat(site): add expanding product cards with keyboard controls
- ec87f41 style(site): align section leading and sticky navigation clearance
- 4bbb2dd fix(motion): cancel expanding card effects when printing
- 9e21574 fix(hero): keep mobile entry motion clear of the caption
- 81eca72 refactor(styles): separate document surfaces from campaign layout
- 7d58299 docs(design): specify reference spacing and motion limits
- 501305f fix(motion): defer hero convergence until meaningful scroll exposure
