# Follow-up — Widget panel redesign and package rename

Status: BLOCKED (publication and fresh CDN verification); local implementation PASS
Date: 2026-11-16, Asia/Karachi
Commit range: `phase-11-complete` (`21356b3`) through this report

## Summary

The actual widget panel now follows the supplied visual direction: blue gradient header, original decorative icons, rounded cards, circular minus/plus controls, segmented native radios, an independently scrolling body and a persistent reset footer. This changes the widget itself, rather than only its demo site. The implementation retains visible descriptions, state text and native controls instead of copying the reference widget's assets or branding.

The user's final naming answer is interpreted as `@widgets/accessibility`, using the standard spelling confirmed in chat. Source metadata, lockfile, self-imports, React exports, consumer projects, examples and documentation are prepared for that organization package. No registry write occurred. The package lookup returned E404 and the organization-membership query returned `{}`; neither proves publication rights. Organization access remains a human handoff.

The historical `@qasimfida/accessibility-widget@0.1.1` CDN URL and SRI remain intact and are labelled as the previous release. Earlier real-CDN snippet checks passed in this session. The final repeat timed out twice in a real browser, and a direct HEAD connection timed out after 15,008 ms. Further attempts stopped under AGENTS.md §11. These failures are recorded rather than reported as a fresh CDN pass.

## What changed (files and why)

- `src/features/icons.ts`, feature metadata and `src/ui/icon.ts`: eighteen original, local, decorative SVG icons. Feature registration still drives the UI; rendering contains no switch on feature identifiers. Icons are built lazily with the controls.
- `src/ui/panel.ts`, `styles.ts`, `card-styles.ts`, `placement.ts`: blue header, original Accessiblit branding, 440 px maximum width, 760 px maximum height, rounded cards and reset footer. Cards become one column at narrow widths. All four positions, RTL and existing zoom cancellation remain supported.
- `src/ui/focus.ts`, controller and regression tests: scroll the content viewport to keep focus clear of the header/footer. In available heights below 360 px, the entire panel scrolls and the chrome becomes static, leaving controls reachable at 320×256 and magnification.
- `src/ui/option-stepper.ts` and spacing metadata: line height, letter spacing and word spacing step through their existing real values. Native radio groups remain for text alignment, readable font and cursor choices. Stored settings, limits, callbacks and live announcements retain their original values. Percentage displays use `%`; announcements retain “percent”.
- Package configuration, React entry and examples: change to `@widgets/accessibility`, including the Vitest alias and external-core checks so React still shares the singleton. No dependency was added or updated.
- README and install guides: mark the organization package as unpublished, distinguish local tarball checks from historical registry/CDN evidence, and correct the tarball name and source pin.

## Verification (commands run, real results)

Environment: `main`, initially clean; `git pull --ff-only` reported already up to date. Node `v24.13.0`, npm `11.6.2`, git `2.54.0`. Node 20/22 CI results for these follow-up commits are not claimed here.

| Command / check                                                             | Result                                                                                                                                                                                                                                |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`, `npm run typecheck`, touched unit suites before each commit | Pass; no lint warnings                                                                                                                                                                                                                |
| `npm run verify` after runtime fixes                                        | Pass: 61 unit files, 195 tests; six performance-script tests; SSR import checks, build, size, publint and attw pass                                                                                                                   |
| Unit coverage                                                               | Overall 96.3% lines / 91.11% branches; core 98.63% lines / 97.96% branches                                                                                                                                                            |
| `playwright test e2e/panel-a11y.spec.ts`                                    | 48 successful cases across Chromium, Firefox and WebKit; light/dark, forced colours, reduced motion, desktop and 320×256; axe zero violations                                                                                         |
| Panel layout, keyboard and card-design regression suites                    | 37 passed, two existing WebKit visualViewport capability skips; six additional gradient/card cases passed                                                                                                                             |
| All-feature, cleanup, lifecycle, launcher-colour and panel audit suites     | 38 passed, all three engines plus mobile lifecycle projects                                                                                                                                                                           |
| All-eighteen-feature keyboard flow                                          | 25 profile/project cases passed during implementation; final-source standard profile: five passed in 24.9 seconds (Chromium, Firefox, WebKit, emulated iPhone and Pixel), ninety additional axe scans with zero violations            |
| `npm run test:examples` on final runtime                                    | Pass: five tarball-installed projects, Node16/Bundler consumers, JS ESM/CJS, React 17/18 compatibility, fifteen browser integrations, thirty closed/open axe scans with zero violations                                               |
| `npm run test:site-snippets`                                                | Earlier renamed-package run passed: eleven extracted snippets, five shell syntax checks, Node16/Bundler types, eighteen browser cases. Final repeat BLOCKED on the real historical CDN navigation; no timeout/expectation was changed |
| `npm run test:site -- --workers=2`                                          | Final-source repeat: 245 passed in 2.0 minutes, including site axe, keyboard, network, links and persisted first-frame checks                                                                                                         |
| `npm audit --omit=dev` and `npm audit`                                      | Zero vulnerabilities in both; zero runtime dependencies                                                                                                                                                                               |
| `git diff --check`                                                          | Pass                                                                                                                                                                                                                                  |

Raw packed-consumer, lifecycle and audit results are in [verification.json](assets/panel-redesign/verification.json). Screenshots and computed values are under [assets/panel-redesign](assets/panel-redesign/).

## Review findings and fixes

| Severity | Finding                                                                                                          | Fix                                                                                                                       | Status                                                                 |
| -------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| Medium   | R-1: zero-size close text conflicted with enlarged text and the generated close glyph affected accessible naming | `4e252a4`: use an aria-hidden vector plus clipped real text; existing keyboard and enlarged-text tests pass               | Fixed                                                                  |
| Medium   | R-2: Firefox added a redundant tab stop on the independently scrollable body                                     | `68e8aad`: explicit `tabindex=-1` on the body; native controls retain scrolling and focus                                 | Fixed                                                                  |
| Medium   | R-3: axe leaves layered-gradient contrast incomplete                                                             | `4235dc4`: compute a conservative bound from browser-resolved gradient stops and translucent decoration, requiring ≥4.5:1 | Fixed with complementary measurement; axe incompletes remain disclosed |
| Medium   | R-4: disabled endpoints and forced-colour step buttons lost their 3:1 borders                                    | `03037d0`: retain contrasting borders in every state; unchanged all-feature/panel audit gates pass                        | Fixed                                                                  |
| Medium   | R-5: release copy and tarball instructions still implied the renamed package was already public                  | `d8412a4`: separate candidate/tarball evidence from historical CDN evidence; correct tarball name and source pin          | Fixed                                                                  |
| Blocker  | Publishing rights for `@widgets` are not established                                                             | Read-only query returned no membership entries; clarification is pending                                                  | Human action required                                                  |
| Blocker  | Fresh historical jsDelivr connection checks time out                                                             | Two browser navigations and one direct connection failed; stopped after three attempts                                    | External verification blocked                                          |

Vercel [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) review, using the installed `web-design-guidelines` skill:

- `src/ui/panel.ts`: native named buttons, non-modal dialog, real group headings and descriptions; decorative SVGs hidden from assistive technology.
- `src/ui/card-styles.ts`: visible focus, hover feedback, native radio groups, non-colour state indicators, wrapping labels and logical dimensions.
- `src/ui/focus.ts`: focus clearance uses the actual scroller; short-height fallback avoids fixed chrome covering controls.
- `src/ui/styles.ts`: original local visuals, reduced motion, dark appearance and operating-system colours; no font or image requests.

## Audits

### Accessibility

The real-browser keyboard runs opened with Alt+A, moved from Close through controls, changed all eighteen settings, exercised native radio arrow keys and step buttons, reset all settings, escaped to the launcher and tabbed onto the host page without a trap. Dedicated final-source tests check focus against the content viewport, rather than merely against the outside dialog rectangle. Header and footer bounds remain unchanged while content scrolls. The close name is “Close”, launcher name is “Open accessibility options”, pressed/checked/expanded states remain exposed, and live status updates remain intact.

Measured native input minimum is 24×24 px; buttons and label hit areas are at least 44 px. Solid-surface text contrast is at least 5.7055:1 in the measured light state. The banner's more conservative lower bound, including decorative overlays at their brightest possible stop, is **4.5749648875:1** in all three engines. Focus outlines are 3 px; checked light/dark/forced states retain the unchanged contrast gates. No axe rule was disabled. Layered-gradient `color-contrast` incompletes are not counted as automatic passes: the additional computed-colour test supplies that evidence.

Screenshots: [light](assets/panel-redesign/light-top.png), [colour cards](assets/panel-redesign/light-colour.png), [navigation cards](assets/panel-redesign/light-navigation.png), [dark](assets/panel-redesign/dark-top.png), [forced colours](assets/panel-redesign/forced-top.png), [320 px](assets/panel-redesign/mobile-top.png), [RTL](assets/panel-redesign/rtl-top.png). These are the actual library widget on the article fixture.

Screen readers and physical mobile devices were not tested. Existing [human screen-reader instructions](../docs/manual-screen-reader-test.md) remain necessary. No WCAG conformance claim for a host site is made.

### Security and privacy

No runtime dependency, network API, remote asset, storage key, credential handling or unsafe DOM parser was introduced. SVG paths are original local strings written as SVG attributes, not HTML. Scope queries and registry metadata checks were read-only. The new stylesheet text uses the existing owned shadow sheet; no new host-page style injection strategy was added. Cleanup and 200-lifecycle tests restore the host exactly, retain the original sheets and balance listeners. Both complete and production-only npm audits report zero vulnerabilities. No new dev dependency needs justification.

### Performance and size

Final local IIFE: **65,255 bytes raw, 21,794 bytes gzip**, below 35 KB and below the 30 KB warning (`size-limit` reports 21.77 kB using its compression settings; the exact byte count above uses the packed-example gzip measurement). Compared with the published 19,734-byte gzip release, the delta is **2,060 bytes**. Sourcemap raw attribution: features 26,248; core 14,292; UI 23,958; entry 140; wrapper/unmapped 617 bytes. React stays separate: ESM 384 bytes, CJS 838 bytes, one core and one React module in the combined consumer. Unused imports shake down to a retained constant.

Candidate-build SRI (not a published/CDN hash): `sha384-e+lXDxA3TY8hH2WWtKG8CtSMV06t9hIg0Cq0oKwFoyBsYw0523CcA2TR54GiXRRe`.

Reference machine: Mac15,6, Apple M3 Pro, 18 GiB RAM, macOS 27.2.1 build 26B131, AC power. The maintainer's earlier instruction to leave other apps open is explicitly recorded as an exception. Five warm-ups were discarded and thirty samples measured around `init()` only in headless Chromium and WebKit on the 5,000-paragraph fixture. **Chromium median 1.25 ms, p95 3.1000000238 ms; WebKit median 3 ms, p95 4 ms. Both pass the unchanged median ≤50 ms gate.** [Raw samples and machine details](assets/panel-redesign/perf-macos.json). CI baselines and regression thresholds were not changed.

## Known limitations (honest)

- The organization package is prepared, not published or proven installable from npm. Its name and version in examples are a candidate contract until access is resolved and publication occurs.
- The old CDN snippet intentionally loads the previous UI. The Pages demo loads the new local build; existing production CDN integrations need a newly published package/version and matching SRI to receive this redesign.
- Final fresh CDN reachability is blocked by connection timeouts despite an earlier successful run in this session.
- The persistent header/footer become static when available height is below 360 px. This is necessary to keep controls usable under short viewports and magnification.
- The design follows layout and visual direction, not the other widget's branding, copy or assets. Visible descriptions and state labels remain for accessibility. Numerical spacing uses the real catalogue's em values, not the screenshot's illustrative px labels.
- CI and live Pages deployment results for the forthcoming push are pending; local checks are not relabelled as CI or live-site results.

## Deviations from the prompt (and why)

No additional numbered phase or completion tag is invented for this follow-up. `phase-11-complete` remains the historical post-publication checkpoint. AGENTS.md §0's package constant is updated under the user's newer explicit naming instruction; repo URLs, global name and public lifecycle API remain unchanged. Registry writes are not performed under the current AGENTS.md §2.1 prohibition. No package availability or conformance claim is fabricated to bypass the blockers.

## Handoff notes for the next phase

Confirm that the maintainer controls the npm `widgets` organization and has package-publication permission. After publication, repeat registry, both real CDN/SRI and fresh-install checks; only then replace the historical CDN snippet. Check the deployed Pages demo opens the blue card-based panel and the install page clearly distinguishes the candidate from the existing published release. Complete the documented screen-reader checks on real platforms.

## Commit list

- `3852496` feat(ui): supply original icons through feature metadata
- `3413114` style(panel): add blue header and rounded feature cards
- `bec949a` feat(controls): render ordered spacing levels as steppers
- `4e252a4` fix(panel): preserve close control under text enlargement
- `ee435e9` build(package): prepare widgets accessibility organization name
- `68e8aad` fix(panel): remove redundant Firefox scroller tab stop
- `b3b7f45` test(panel): guard card reflow and fixed chrome focus clearance
- `4235dc4` test(panel): measure contrast over banner gradient layers
- `03037d0` fix(panel): retain step button borders in every state
- `d8412a4` docs(install): distinguish candidate from published release
