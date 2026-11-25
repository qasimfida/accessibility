# UI consistency and toolkit refresh

Status: PASS WITH NOTES — requested UI is deployed; full CI remains blocked by an inherited intermittent heap-trend check.
Date: 2026-11-25 / base `b72f7d1`; deployed UI `0986515`; subsequent documentation and keyboard-audit fix `03e3ec2`.

## Summary

Implemented all ten requested changes across the website and real widget. The shared footer is rendered at build time, the documentation examples remain working integrations, and the new header actions use registry metadata and the existing store. No framework, runtime dependency or public API option was added.

Pages build and deployment succeeded. The live widget exposes six shortcuts and the footer exposes eight integration links. All 12 deployed HTML/CSS/SVG documents match the validated local build by SHA-256. Live mobile Lighthouse performance: **100, 100, 100 for Home; 100 for Documentation**. All eight local desktop pages scored **100**. Scores describe these runs, not a guarantee for every device or network.

## What changed (files and why)

| Request             | Implemented result                                                                                                                                                            |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Integration icons   | Original inline platform artwork for JavaScript, TypeScript, React, Next.js, HTML and WordPress in the “Built for the web you use” tiles; each tile links to its actual guide |
| FAQ accordions      | FAQ and Home share native details/summary styling, chevrons, separators and answer spacing; Enter and Space work without custom disclosure JavaScript                         |
| Consistent footer   | One `site/partials/footer.html`, included by Vite before HTML processing on all eight routes, including 404; no runtime fetch                                                 |
| Footer integrations | JavaScript/HTML, TypeScript, React, Next.js, Vue, Angular, WordPress and Shopify link to real installation anchors                                                            |
| Documentation UI    | Grouped contents rail, three-step setup overview, readable article cards and labelled navy code surfaces; existing code payloads and deep links preserved                     |
| Toggle/card design  | Compact 16px cards and 40×24 switch tracks with 16px thumbs, retaining a 48×44 interaction area; only the switch changes state, not the card background                       |
| More shortcuts      | Added High contrast and Reading mask to Dark mode, Reading guide, Stop animations and Focus highlight; exclusions and translations still come through the registry            |
| Centred shortcuts   | Six 44px actions centred on desktop; two balanced rows of three at 320px instead of an orphan final action                                                                    |
| Modern logo         | Original layered vector mark in headers, shared footer, launcher, popup, favicon, social SVG/PNG and real toolkit previews; authoritative editable source `src/ui/brand.ts`   |
| Page heroes         | Toolkit, Documentation, Contact and FAQ share the home paper surface, centred eyebrow/headline, regular typography, reading measure and blue section action                   |

Design rules were updated before implementation in `docs/design-system.md`. The reference was inspected in Chromium at 1440×1000; its hero used a 50px, weight-400 heading. No competitor text, icons, code or image assets were copied. Existing locally authored platform artwork was reused.

The visible brand remains **Accessibility**. The public browser global stays **Accessiblit**, as required by AGENTS.md. A discovered prose error was corrected without renaming the API.

## Verification (commands run, real results)

| Check                                     | Result                                                                                                                                                            |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Starting branch/state                     | `main`, clean; `git pull --ff-only` already up to date                                                                                                            |
| Before each commit                        | Lint, typecheck and relevant units or browser checks passed                                                                                                       |
| `npm run verify`                          | Passed: **62 unit files / 200 tests**, seven performance-helper tests, build, SSR, size, publint and attw                                                         |
| Core coverage                             | **98.63% lines / 97.96% branches**                                                                                                                                |
| `npm run test:site`                       | **500 passed in 7.8 minutes** at `162547f`, before the narrow-row review fix                                                                                      |
| Final narrow-screen/persistence subset    | **45 passed** at `0986515`, covering all eight small-screen pages and first-frame restoration across five projects                                                |
| Final popup matrix                        | **25 passed** at `0986515`: Chromium, Firefox, WebKit, iPhone and Pixel emulations                                                                                |
| Full 18-feature keyboard walk             | **5 passed** across all five projects; shortcut state, host exit and focus bounds checked                                                                         |
| Production content audit after CI finding | **6 passed** across Chromium, Firefox and WebKit; exact native tab order, host exit, target sizes, contrast, typography restoration and Escape retained           |
| `npm run test:site-snippets`              | Passed: 11 extracted snippets, Node16/Bundler types, shell syntax and **18 browser integrations**, including the real pinned CDN release and packed local package |
| Official Nu checker                       | **26.11.20 (c2805af): 12 HTML/CSS/SVG documents, zero errors/warnings**; informational void-element syntax notes retained                                         |
| Live document hashes                      | **12/12 identical** to the validated build; six real shortcuts and eight footer integration links confirmed in a live browser                                     |
| `npm audit` / `npm audit --omit=dev`      | **0 vulnerabilities**, including development dependencies                                                                                                         |
| `git diff --check`                        | Passed                                                                                                                                                            |

No browser retries, axe rules, coverage thresholds, size limits, timing baselines or heap assertions were relaxed. Early development runs exposed a renamed `npm` navigation label; its original accessible label was restored rather than changing the existing keyboard requirement. A competing preview server caused one setup failure; checks were rerun serially with the server configuration unchanged.

### Performance and size

- IIFE: **74,595 bytes raw / 23,744 bytes gzip**; **+16 gzip bytes** versus the previous build, below the unchanged 35,000-byte gate.
- Site stylesheet: **48,677 bytes raw / 9,968 bytes gzip**.
- Working popup preview: **43,939 bytes**, captured from the actual 400×680 widget, not a mock UI.
- Live mobile Home performance: **100 / 100 / 100**; LCP **1101.25 / 1092.48 / 1255.18 ms**; TBT **53 / 0 / 0 ms**; CLS **0** in all three runs.
- Live mobile Documentation: **100 performance, accessibility, best practices and SEO**; LCP **930.39 ms**, TBT **0 ms**, CLS **0**.
- All eight local desktop pages: **100 performance**, zero TBT and CLS. The intentionally non-indexable 404 retains its lower SEO score rather than removing `noindex`.
- Lighthouse **13.6.0**, fresh headless Chromium profiles, extensions disabled, default mobile throttling; desktop preset used only for explicitly recorded desktop runs. No throttling or preview compression was changed.
- Reference-machine init timing was not remeasured; the new controls remain deferred until first open. Both Node 20 and 22 CI init-trend jobs passed with their existing regression guards.

Raw evidence is under `assets/ui-refresh/`, including Lighthouse configurations, browser verification, Nu diagnostics, live hashes, snippets, sizes, vulnerability reports and screenshots.

## Review findings and fixes

| Severity            | Finding                                                                                               | Fix                                                                                                                              | Status                                                  |
| ------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Medium              | R-1 — `site/install/index.html`: prose incorrectly named the browser global Accessibility             | `bf8e8cb`: restore Accessiblit in prose; examples already used the correct API                                                   | Fixed                                                   |
| Low                 | R-2 — `src/ui/card-styles.ts`: six shortcuts formed a five-plus-one row at 320px                      | `0986515`: centre two rows of three and assert row membership and target sizes                                                   | Fixed                                                   |
| Low                 | R-3 — manual reader/branding guides still described four actions, old naming and 440×760 previews     | `acf1e71`: six-action reader script, Accessibility title, actual 400×680 preview dimensions                                      | Fixed                                                   |
| Medium              | R-4 — `e2e/content-audit.spec.ts`: fixed 30-tab traversal stopped at Reset after adding two shortcuts | `03e3ec2`: derive native tab stops and assert their exact order plus host exit; retain all target/contrast/Escape checks         | Fixed; six browser checks pass                          |
| Medium / CI blocker | R-5 — inherited Linux heap test intermittently records a 648-byte step after warm-up                  | Preserve the failure and unchanged gate; local run is flat with zero retained instances/hosts, but the cause was not established | Unresolved; not described as a heap fix or full-CI pass |

The [Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) review checked semantic controls, icon names, native disclosures, visible focus, responsive layout, reduced motion and first-party assets. No remaining Blocker/High defect was identified in the UI diff. The separate CI heap-trend finding remains explicit.

## Audits

### Accessibility

- **280 page/profile states, 560 axe scans, zero violations** in the full site run: eight routes × seven profiles × five browser/device projects, panel closed/open.
- Final narrow-layout follow-up: **45 passing cases**, including 40 small-screen accessibility states and five persisted first-frame checks. Full-suite and follow-up source revisions are recorded separately in `browser-verification.json`.
- Minimum computed text contrast: **6.045:1 site / 6.848:1 widget**. Minimum global target: **24×24 CSS px**; every tested quick action remains **44×44**. Some axe colour-contrast checks are incomplete; independent computed checks supplement them, and none were suppressed.
- Keyboard-only browser automation traversed skip link → main → live demo → Close → all six shortcuts → feature controls → Reset → host exit / Escape focus return. Every feature was changed in the 18-feature walk. The two additional shortcuts also synchronise with normal controls and reset in all five popup projects.
- FAQ Enter/Space toggles preserve focus; footer links and hero actions resolve; reduced motion, forced colours, RTL and text-spacing checks passed.
- Screen readers and physical devices were **not** tested. The human reader script was updated without inserting fabricated results.

### Security and privacy

- No new dependency, runtime request, cookie, localStorage key, unsafe DOM API, authentication flow or payment action.
- The 200-cycle CI lifecycle check recorded **9,800 listeners added and 9,800 removed**, zero DOM residue and complete restoration. The separate heap trend failure is not relabelled as passing.
- The shared footer is static build output. Platform/brand icons are inline vectors; library branding never fetches an image or font.
- Existing first-party-only request, single-key storage and cookie checks passed in all five site projects. All internal link and fragment checks passed.
- No publication, credentials, tokens, history rewriting or CI permission changes. Runtime dependencies remain zero.

### Screenshots and visual review

- `integration-tiles.png`: six linked platform marks and visible names.
- `documentation.png` / `documentation-code.png`: grouped navigation, setup overview and real code panels.
- `faq-accordions.png`: shared native disclosure appearance.
- `footer.png`: common footer and framework links.
- `popup-switches.png`: neutral cards and selected switch state.
- `popup-320.png`: centred three-by-two shortcuts and readable narrow controls.
- Route hero captures: Home, Documentation, FAQ, Contact and Toolkit.

### CI and heap evidence

[Pages build/deploy](https://github.com/qasimfida/accessibility/actions/runs/45621255578) succeeded at `0986515`. The initial [code CI run](https://github.com/qasimfida/accessibility/actions/runs/45621255711) found R-4 and an intermittent heap failure. The [subsequent run](https://github.com/qasimfida/accessibility/actions/runs/45628182536) confirms the keyboard fix in Chromium, but the heap failure recurred in separate Chromium/Pixel jobs. This is not a green full matrix.

CI heap samples kept node/listener counts at **38 / 13** and collected all weak references, while used heap stepped by **648 bytes**. The initial failing lower confidence bound was **+0.19394 bytes/cycle**. The unchanged local Pixel run passed with **zero slope / zero lower bound**, constant DOM/listener counts and no retained instances/hosts. These observations do not identify the cause or establish that the CI failure is harmless. All evidence is retained in `heap-observations.json` and `heap-history.json`; no warm-up, sample count or threshold was changed. The same step predates this task: commit `5defde1`, run `45400544655`, had lower bound +0.19669. The follow-up run has 13 successful jobs and two heap-gated failures (+0.24897 Chromium / +0.21998 Pixel).

Historical 5,000-node timing diagnostics also report their original shared-runner failures separately; their protocol was not altered. Do not relabel them as passes or confuse them with the passing init-trend guard and website Lighthouse results.

## Known limitations (honest)

- Full CI remains blocked by the intermittent heap-trend gate. Dedicated Linux heap profiling is still needed; the UI/site checks and successful Pages deployment do not resolve it.
- The public registry read for `@widgets/accessibility` still returns E404. The existing availability warning is retained. The site demo uses the new local build; the pinned legacy CDN example remains the previous published release. New package publication is reserved for the maintainer.
- Browser emulations and automated keyboard/axe tests do not replace human screen-reader and real-device checks or prove universal WCAG conformance.
- Lighthouse scores vary with device, extensions, network and hosting. GitHub Pages cache headers are unchanged; a measured 100 does not mean every diagnostic is green.
- The logo is editable at source level using the documented helper, not through a new network-loaded logo option.

## Deviations from the prompt (and why)

- No numbered phase was provided, so no invented phase tag was created. The report, granular commits and closing checks follow AGENTS.md.
- The requested interface is complete and deployed. An inherited intermittent CI memory finding is retained as a blocker instead of weakening its assertion or claiming all CI checks pass.

## Handoff notes for the next phase

- Review the live site and screenshot set, then run the updated human screen-reader script.
- Investigate R-5 on Linux; retain the existing heap gate until its cause is identified. The subsequent report-only push triggers CI again but is not a claimed fix for R-5.
- Maintain the footer in `site/partials/footer.html`, the logo in `src/ui/brand.ts`, and shortcut eligibility in feature metadata. Refresh real panel captures after future widget visual changes.

## Commit list

```text
d751540 docs(design): define shared editorial and compact toolkit patterns
c9b86fb feat(site): share the footer and add framework integration links
590ac47 style(site): add platform artwork to integration tiles
5576adb style(faq): share the homepage disclosure component
3091094 style(site): align product page heroes with the homepage
5e2ca65 style(docs): introduce a guided reading and code layout
bf8e8cb fix(docs): distinguish the product name from the browser API
87ed4c7 style(brand): adopt the shared editable layered mark
d711bbb style(toolkit): refine cards and inset toggle switches
4503f51 feat(toolkit): centre six registry-driven header shortcuts
162547f style(site): refresh previews from the working toolkit
0986515 fix(toolkit): balance shortcut rows on narrow screens
acf1e71 docs(ui): align manual checks with refreshed controls and branding
03e3ec2 test(keyboard): cover every rendered control before host exit
```
