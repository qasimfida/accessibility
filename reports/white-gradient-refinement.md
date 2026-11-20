# Website and toolkit — white gradient refinement

Status: BLOCKED
Date: 2026-11-20
Commit range: e5fb577 to the report commit (unnumbered design follow-up).

## Summary

The design is implemented and local checks passed. Closing is currently blocked by CI follow-up: the first Pages run timed out during browser dependency installation, and the Node 20 init-trend job failed with logs unavailable through the connected tool. The 50ms absolute gate and 50% trend guard are unchanged. The user has been asked for the Node 20 error/median lines.

Addressed the visual gaps identified in the user's screenshot feedback: heavy system typography, flat placeholder artwork, equal-width introductory cards, warm backgrounds and an oversized blue toolkit header. The light design now uses white surfaces with a restrained blue radial gradient, geometric typography, a layered real-toolkit screenshot over an original fictional-store photograph, a wider centre feature panel and additional sections matching the reference's long-page rhythm.

The actual toolkit has a compact white header with a soft gradient, a blue emblem, denser single-column feature rows, rectangular controls and a white reset footer. Its public API, all eighteen features and lifecycle behaviour are unchanged. Dark-system appearance and forced colours remain supported as required by AGENTS.md §7.

## What changed (files and why)

- `src/ui/styles.ts`, `card-styles.ts`: white light-theme surfaces, compact header and feature rows, consistent rectangular controls, responsive container query, preserved native semantics and focus indicators.
- `site/index.html`, landing styles, `product-stage.css`, `reference-sections.css`: corrected proportions, white/blue gradient hero, layered product photography, wider centre introduction, a second blue demo band, project facts, five accessibility-pattern labels and eleven original FAQs. All content describes this application's real capabilities.
- `site/src/typography.css`, `site/public/fonts/`: self-hosted Manrope Latin variable font (24,532 bytes), SIL Open Font License included; preload added to all six authored pages. The runtime library bundles no font and requests no remote font.
- `site/public/images/editorial-demo.webp`: original generated editorial image, optimised to 42,828 bytes. Fictional illustrative store, not a customer endorsement.
- `site/public/images/toolkit-white.png`: screenshot of the actual revised toolkit (59,777 bytes), used within the labelled product illustration.
- `scripts/site/serve.mjs`, `e2e/site/assets.spec.ts`: permit the new local WebP/WOFF2 types while retaining path restrictions; test correct MIME responses and actual font loading.

## Verification

- Started on clean main; git pull --ff-only reported already up to date.
- npm run verify passed: lint/format, strict typecheck, 197 unit tests in 62 files, six performance-script tests, ESM/CJS/SSR builds, size-limit, publint and attw. Core: 98.63% lines and 97.96% branches.
- npm run test:site -- --workers=2: **295 passed in 3.4m**, no retries or skips. Chromium, Firefox, WebKit, emulated iPhone and Pixel; six pages and seven profiles, including dark, forced colours, reduced motion, RTL, 320px and text spacing.
- Playwright panel and panel-a11y suites: **60 passed in 38.0 seconds** across the three desktop engines, including 320×256, native keyboard interaction, focus return and media preferences.
- Axe: zero violations in all tested site/panel states, including expanded feature/FAQ disclosures. Gradient/decorative-symbol incompletes are interpreted separately rather than disabled.
- Minimum measured site text contrast **6.045:1**; toolkit **6.799:1**. Minimum site action dimension **43.1875px**; toolkit **24px** for radio inputs, with buttons at least **44px** in the separate real-browser measurement.
- Conservative light gradient endpoint contrast: hero heading **11.375:1**; toolkit header description **6.802:1**; header title **13.063:1**. These bounds complement the solid-background measurements.
- npm run test:site-snippets: eleven extracted snippets; Node16/Bundler compilation and five shell syntax checks passed; all eighteen browser/snippet consumers passed, including React/Next StrictMode cleanup and real historical CDN/SRI verification.
- npm audit and npm audit --omit=dev: zero vulnerabilities. No dependency changes.
- [Raw matrix, gradients and audit evidence](assets/white-gradient/checks.json); [real-browser keyboard, network and layout observations](assets/white-gradient/browser-review.json).

## Review findings and fixes

| Severity | Finding                                                                                              | Fix                                                                                                                              | Status    |
| -------- | ---------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Medium   | W-1: preview server rejected the new WebP/font assets, hiding the intended photograph and typography | `81631af`: explicit WebP/WOFF2 MIME allowlist and browser regression coverage                                                    | Fixed     |
| Medium   | W-2: mobile hero mock-browser height extended into its caption                                       | `33a9269`: limit the narrow-screen illustration height; five browser tests guard clearance at 320px, 390px and desktop           | Fixed     |
| Medium   | W-3: short-viewport header retained the narrow emblem column for its title                           | `c0fc674`: flexible title column and explicit width regression checks across all compact panel profiles                          | Fixed     |
| Medium   | Previous design did not reflect the screenshot's product imagery, typography or section proportions  | `dd371ae`, `e900a5c`, `cf04fb2`: self-hosted geometric type, original photograph, actual toolkit preview and revised composition | Addressed |
| Medium   | Toolkit remained dominated by a large blue header and tall tile cards                                | `e16afd6`: compact white header, gradient and denser feature rows; full panel matrix passes                                      | Addressed |
| Low      | Gradients can make automated contrast results inconclusive                                           | Compute conservative endpoint contrast and retain all axe checks                                                                 | Reviewed  |

## Broader CI review follow-up

The first local browser selection missed `panel-design.spec.ts` and `panel-layout.spec.ts`. The wider CI run exposed assumptions tied to the preceding design. They are corrected without removing contrast, focus, reflow or typography isolation assertions:

- W-4 (`c1c395e`): gradient contrast now uses actual foreground colours and conservative channel bounds; a failing white-on-white case remains covered. Rows are asserted as rows rather than the old two-column tiles. Six design cases pass.
- W-5 (`25023bf`): capture title typography before host adjustments and assert it remains unchanged afterward, rather than hardcoding the old 24px title and normal letter spacing.
- W-6 (`7547dcb`): the broader tests found a real 2px Firefox ink overflow with enlarged text. Increase title line height to 1.4 and refresh the actual product screenshot. Existing clipping tolerance remains 1px. The broader panel selection passed 94 cases in 48.1s; two existing Chromium-only CDP cases are skipped in Firefox/WebKit, which still run the shared reflow tests.

The full CI-equivalent functional runtime selection completed: **985 passed in 16.8 minutes**, with eight existing CDP-only cases skipped outside Chromium. The skipped categories are pointer CPU timing, navigation retained heap, pinch-zoom CDP, and post-GC lifecycle heap, each in Firefox and WebKit. No new skips or retries were added. The closing 295-case site matrix and all eighteen snippet consumers passed again after these fixes. It retains the repository's existing exclusion of historical absolute 5,000-node timing tests; no timing gate, baseline or workflow was modified.

Initial deployment: [Pages run 44719960585](https://github.com/qasimfida/accessiblit/actions/runs/44719960585), build cancelled at its timeout while installing browser dependencies, deployment skipped. Initial [CI run 44719960686](https://github.com/qasimfida/accessiblit/actions/runs/44719960686) includes the separate Node 20 init-trend failure. The connected GitHub log tool returns a transport error; unauthenticated log download returns HTTP 403. No diagnosis or timing pass is invented. The Mac is currently on battery, so a valid AC-powered reference benchmark was not run as a substitute.

## Audits

### Accessibility

The native launcher, non-modal dialog, close/reset actions, live region, steppers and radio controls are retained. No listener or keyboard behaviour changed. The site retains its skip link, landmarks, one h1 and native details. Meaningful illustration labels distinguish the fictional store from the real interactive demo; decorative pixels add no fake controls to the semantic tree.

In a real Chromium browser, Tab traversed the header and calls to action to the actual demo. Enter opened the toolkit; Escape returned focus to the launcher. The broader suite changed and reset options by keyboard. The measured focus indicator is 3px. Mobile screenshot/reflow and text-spacing tests pass. Source artwork, mobile, desktop and the white toolkit were visually inspected.

[Desktop](assets/white-gradient/desktop.png), [hero](assets/white-gradient/hero.png), [toolkit](assets/white-gradient/toolkit.png), [mobile](assets/white-gradient/mobile.png), [dark](assets/white-gradient/dark.png), [compact toolkit](assets/white-gradient/compact-toolkit.png).

Screen readers and physical devices remain human checks; emulation is not represented as real-device testing. No claim of host-page conformance is made.

### Security and privacy

No new runtime logic, network requests, cookies, storage keys, dependencies or unsafe DOM APIs. Library styling changes are static shadow-local CSS. All new site assets are served from the same origin. The only font is a locally served, licensed website asset; it is absent from the npm runtime bundle. Development image generation and downloading the openly licensed font do not introduce runtime external requests.

The generated portrait illustrates a fictional store and does not imply an actual customer or testimonial. Unsupported AI, remediation, audits, certifications, paid tiers and legal assurances were not copied from the reference.

### Performance and size

IIFE gzip: **21,863 bytes**, **+56 bytes** from the preceding 21,807-byte build, below the unchanged 35,000-byte gate. Site resources sampled in one fresh local Chromium context: **242,011 encoded subresource bytes**, excluding the HTML document and protocol/cache effects. Load event **123.2ms**, cumulative layout shift **0**, mobile overflow **0px**; these are local observations, not a production or reference-machine benchmark. The local font loaded successfully.

No fresh absolute init-time benchmark is claimed. No lifecycle or feature logic changed and no baseline or threshold was modified. Website font/photo payloads are separate from the library budget.

## Asset provenance and generation prompt

Built-in image generation was used, not the CLI. Final project asset: `site/public/images/editorial-demo.webp`. Original generated PNG was retained in the generator's output directory; conversion to WebP was an asset-encoding optimisation. Final toolkit preview: `site/public/images/toolkit-white.png`, captured from the running local build.

Prompt:

> Use case: photorealistic-natural. Asset type: original editorial photograph for a fictional fashion store used in an accessibility software demo. A stylish adult woman with medium brown skin and short curly dark hair, wearing a cobalt blue jacket over a vivid burnt-orange top, waist-up against a pale sage mint studio backdrop. Calm confident expression, looking slightly left of camera, natural studio daylight, refined fashion editorial art direction, realistic fabric texture. Subject on the right two thirds of a landscape 3:2 frame with clear mint negative space on left for an HTML overlay. No text, no letters, no logos, no interface, no watermark. This is an illustrative fictional-store photograph, not a testimonial.

Manrope source: Google Fonts' official font distribution; [upstream license](https://github.com/google/fonts/blob/main/ofl/manrope/OFL.txt), shipped in `site/public/fonts/OFL.txt`. The font is an openly licensed general-purpose asset, not artwork/code copied from another widget. Web Interface Guidelines were refreshed from Vercel's official repository during review.

## Known limitations

The result uses the reference's visual structure with original material and accurate free-toolkit content. Different text, a single genuine free offering and absent unsupported commercial services deliberately prevent a literal screenshot duplicate. Static illustration text is a product preview; visitors use the actual demo to interact with controls.

System dark appearance remains available under AGENTS.md §7; the requested white/gradient treatment is the light appearance. Historic npm/CDN releases are immutable and do not gain source changes until a human publishes a new release. The Pages demo uses the current local build and will show the updated toolkit after deployment.

## Deviations from the prompt (and why)

Original artwork and content replace proprietary reference assets, certifications, customer proof and unsupported AI features, as AGENTS.md §§1–2 require. No external font request is introduced. This unnumbered follow-up does not invent or move a phase tag. No npm publication was attempted.

## Handoff notes

After Pages deployment, compare the home page and opened toolkit in light appearance. Review the original images and free-plan copy. Screen-reader and physical-device checks remain manual. Package publication is a separate human-managed release.

## Commit list

- 7547dcb fix(panel): prevent enlarged Firefox title ink from clipping
- 25023bf test(panel): compare typography isolation against its baseline
- c1c395e test(panel): audit current foreground and compact row design
- d32e003 docs(report): record white website and toolkit verification
- c0fc674 fix(panel): preserve title width in compact viewport headers
- 33a9269 fix(site): keep mobile hero artwork clear of its caption
- cf04fb2 style(site): match reference proportions with white gradient theme
- 81631af fix(preview): serve local WebP and WOFF2 assets correctly
- e900a5c style(site): add original editorial photo and real toolkit preview
- dd371ae style(site): introduce self-hosted geometric typography
- e16afd6 style(panel): adopt compact white surfaces and subtle gradient
