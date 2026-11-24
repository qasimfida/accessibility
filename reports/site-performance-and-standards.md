# Website performance and standards

Status: PASS WITH NOTES
Date: 2026-11-24 / code range: `5defde1..fad05c4`; report commit follows.

## Summary

The deployed website scored **100 performance on all eight pages** with Lighthouse 13.6.0's default mobile simulation. The homepage scored **100 in three mobile and three desktop runs** after deployment. All six homepage runs had zero Total Blocking Time and zero Cumulative Layout Shift. Median homepage LCP: **1,128.20 ms mobile; 329.21 ms desktop**.

The official Nu checker validated all **12 generated HTML/CSS/SVG documents with zero errors and zero warnings**. Every deployed document was downloaded and its SHA-256 compared with the validated build: **12/12 identical**. This is validation evidence, not a blanket W3C or WCAG certification.

Local verification passed, including **470 browser tests**. Pages build and deployment passed. Four separate macOS CI jobs were cancelled without receiving a runner or executing steps; another WebKit job was still running when recorded. The entire CI matrix is therefore **not claimed to pass**.

## What changed (files and why)

- `site/vite.config.ts`: give CSS its own compatible browser targets, retaining ES2019 for JavaScript. The former shared target expanded logical properties into large legacy selector lists. The stylesheet shrank from **89,079 to 44,834 bytes**, and from **11,490 to 9,373 bytes gzip** (49.7% raw / 18.4% gzip reduction). The resulting CSS has no Nu validation errors.
- `scripts/build-site.mjs` and all eight HTML entries: combine the real local widget and its tiny initializer into one site-only `widget-bootstrap.js` request. Keep synchronous head initialization so saved settings still apply before content is painted. The package IIFE, public API and release SRI are unchanged.
- `e2e/site/assets.spec.ts`: guard the single synchronous head request, real launcher availability, preservation of logical properties and absence of legacy selector expansions. Existing first-frame persistence tests remain intact.
- `site/public/og.svg`: use the portable SVG presentation weight `700` instead of `750`, resolving the checker finding.
- `scripts/audit-site.mjs`: support live URLs, all eight routes, repeat counts, explicit desktop mode and separate output folders. Use fresh profiles with extensions disabled; retain every result and the standard Lighthouse throttling settings. Historical phase-8 evidence is no longer overwritten by default.
- `scripts/validate-site.mjs` and `package.json`: add `validate:site`, using a separately installed official Nu executable. Validate explicit HTML/CSS/SVG documents, retain all diagnostics and fail on errors or warnings. Fonts, PNG and WebP files are never parsed as markup. No dependency was added.

## Verification (commands run, real results)

| Command or check                        | Result                                                                                                                      |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `git pull --ff-only` at start           | Already up to date; on `main`, clean                                                                                        |
| Fast checks before each commit          | Lint, typecheck and relevant units passed                                                                                   |
| `npm run verify`                        | Passed; 62 unit files / 200 tests, 7 performance-helper tests, build, SSR, size, publint and attw                           |
| Coverage                                | Core lines **98.63%**, branches **97.96%**                                                                                  |
| `npm run test:site`                     | **470 passed in 10.5 minutes**, five projects; retries remain zero                                                          |
| Targeted loading/persistence checks     | **30 passed**, including streamed text and parser-boundary restoration                                                      |
| Targeted CSS/RTL/forced-colour checks   | **45 passed** after correcting a new test to assert native logical properties rather than a transpiled `:dir()` artifact    |
| `npm run test:site-snippets`            | Node16/Bundler types and 18 browser snippet integrations passed, including the real pinned CDN release and React StrictMode |
| `npm run validate:site -- /path/to/vnu` | Nu **26.11.20 (c2805af)**: 12 documents, **0 errors / 0 warnings**                                                          |
| Negative validation fixture             | An image without required alternative text caused exit 1 and a retained error                                               |
| `npm audit --omit=dev` and `npm audit`  | **0 vulnerabilities**, including development dependencies                                                                   |
| `git diff --check`                      | Passed                                                                                                                      |

### Lighthouse method and results

Machine: **Mac15,6, Apple M3 Pro, 19,327,352,832 bytes RAM (18 GiB), macOS 27.2.1 / 26B131**. Node 24.13.0, npm 11.6.2. Browser engine versions: Chromium 158.0.8127.18, Firefox 159.0, WebKit 27.2. Lighthouse uses headless Chromium, new browser profiles and disabled extensions. Mobile audits use default simulated throttling; only explicitly marked desktop runs use the desktop preset. Other applications were not controlled, so no universal score guarantee is implied.

| Live route    | Mobile performance | Accessibility | Best practices | SEO | LCP ms | TBT ms | CLS |
| ------------- | ------------------ | ------------- | -------------- | --- | ------ | ------ | --- |
| Home          | 100                | 100           | 100            | 100 | 1349.4 | 0      | 0   |
| Documentation | 100                | 100           | 100            | 100 | 915.4  | 0      | 0   |
| Options       | 100                | 100           | 100            | 100 | 989.2  | 0      | 0   |
| FAQ           | 100                | 100           | 100            | 100 | 1101.8 | 0      | 0   |
| About         | 100                | 100           | 100            | 100 | 946.3  | 0      | 0   |
| Contact       | 100                | 100           | 100            | 100 | 920.6  | 0      | 0   |
| Toolkit       | 100                | 100           | 100            | 100 | 922.3  | 2      | 0   |
| 404           | 100                | 100           | 100            | 63  | 900.5  | 0      | 0   |

The 404 page deliberately has `noindex` and remains outside the sitemap. Do not remove that behaviour to inflate its SEO score. All eight local desktop pages also scored 100 performance. Homepage repeat results and the full Lighthouse configurations are retained in `assets/site-performance/live-mobile/`, `live-mobile-repeat/`, `live-desktop/` and `local-desktop/`.

The initial clean live baseline was **72, 100, 100 mobile**, and **100 desktop** before any patch. The first run's Lighthouse diagnostics showed a **1,783 ms unattributed long task**, 1,660 ms TBT and 2,075.55 ms of miscellaneous main-thread work. That task did not recur in the next two mobile runs. Its cause was not established, and these changes are not falsely credited with fixing it. All baseline runs are retained under `assets/site-performance/before-live/`.

The supplied 84-score screenshot includes substantial `chrome-extension://` scripts, including the reported minification and unused-JavaScript opportunities. Those are not website assets. An extension-free baseline already reached 100; this work makes measurable delivery improvements rather than claiming the uncontrolled screenshot proves a particular code regression. Follow [Lighthouse's variability guidance](https://github.com/GoogleChrome/lighthouse/blob/main/docs/variability.md) when comparing repeated runs.

The uncompressed local mobile preview measured **98, 98, 98** before the CSS fix and **99** after it, with LCP dropping from approximately 1.8 seconds to 1.65 seconds. It sends substantially more bytes than compressed Pages responses; these local values are retained rather than substituted for live results. No preview compression or throttling was changed to inflate a score.

Reproduce with Node 22.19+ and installed Playwright Chromium:

```sh
npm run build:site
node scripts/audit-site.mjs --url https://qasimfida.github.io/accessibility/ --output /tmp/accessibility-live-mobile
node scripts/audit-site.mjs --url https://qasimfida.github.io/accessibility/ --page home --runs 3 --desktop --output /tmp/accessibility-live-desktop
npm run validate:site -- /path/to/vnu-runtime-image/bin/vnu
```

The [official Nu checker](https://validator.github.io/validator/) is a development tool, not a package dependency. Informational notes about trailing slashes on quoted void elements are retained; they are not errors or warnings. No error filters, axe exclusions, retries, coverage thresholds, size limits or performance baselines were relaxed.

## Review findings and fixes

| Severity | Finding                                                                        | Fix                                                                        | Status                                             |
| -------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | -------------------------------------------------- |
| Medium   | P-1: JavaScript target caused legacy CSS expansion and 226 Nu CSS parse errors | `ba28540`: separate CSS targets; 44,245 fewer raw CSS bytes                | Fixed                                              |
| Medium   | P-2: two blocking scripts were required to initialize the demo                 | `dc42a23`: one site entry; preserve pre-paint settings                     | Fixed                                              |
| Low      | W-1: social-preview SVG weight rejected by checker                             | `30a98bd`: portable weight 700                                             | Fixed                                              |
| Medium   | Q-1: audit omitted routes and overwrote historical evidence                    | `fd585c8`: explicit destinations, repeats and complete route list          | Fixed                                              |
| Low      | Q-2: standards validation was not repeatable from the project                  | `fad05c4`: Nu wrapper with retained diagnostics and negative-fixture check | Fixed                                              |
| External | Four macOS CI jobs received no runner and were cancelled without steps         | Preserve gates; record infrastructure evidence and run link                | Not a passing test; runner availability unresolved |

Self-review found no remaining Blocker, High or fixable Medium issue in this diff against AGENTS.md sections 2, 7 and 9.

## Audits

### Accessibility

- **280 page/profile states**, panel closed and open: **560 axe scans, 0 violations** across all eight pages, five browser/device projects and seven profiles (light, dark, forced colours, reduced motion, RTL, 320 px and text spacing).
- Some open-panel colour-contrast checks remain marked incomplete by axe. They were not suppressed. Independent computed checks found minimum text contrast **6.045:1 for site text** and **6.848:1 for widget text**. Minimum measured target: **24 × 24 CSS px**. Do not describe incomplete checks as automatic passes.
- The automated keyboard walk ran in real Chromium, Firefox and WebKit engines, including mobile emulations: skip link → main → live demo → Close → increase font size → Reset all → Escape → launcher focus restored → Documentation → Toolkit → About → Contact → FAQ → Home. No console errors. macOS WebKit uses the platform's Alt+Tab convention. This was browser automation, not a human screen-reader session.
- Existing motion, Stop animations, forced-colour, reflow and RTL tests passed. The design and interactive animations remain available.
- Screen readers and physical devices were not verified in this task. Keep the existing human screen-reader test plan.

### Security and privacy

- No new dependency, runtime network request, cookie, storage key or unsafe DOM API. No credentials, publication, token changes or permission changes.
- First-party request tests passed in all five projects, including widget interaction without extra requests. LocalStorage remains solely `accessiblit:v1`; no cookies were found.
- Internal link checks in each project: **36 URLs/fragments, 12 destinations, 0 broken**.
- All dependency and runtime-only vulnerability counts are zero. CI permissions and secret handling are unchanged.

### Performance and size

- IIFE: **74,387 bytes raw; 23,728 bytes gzip**, unchanged and below the 35,000-byte gate.
- CSS: **89,079 → 44,834 bytes raw; 11,490 → 9,373 bytes gzip**.
- Live home transfer: approximately **161.4 KB** including the font, images, scripts and stylesheet. This is not a claim that the whole page became 50% smaller.
- Homepage repeated mobile and desktop TBT/CLS: **0 / 0**. All eight live mobile performance scores: **100**.
- The engine's reference-machine `npm run perf` was not rerun: library code is unchanged. No init threshold or committed baseline changed. CI's native macOS init checks are not claimed to pass while no runner was assigned.
- Evidence: `assets/site-performance/sizes.json`, `environment.json`, `browser-verification.json`, `standards.json`, `deployed-standards.json`, vulnerability reports and full Lighthouse reports.

## Known limitations (honest)

- A Lighthouse score of 100 is rounded and does not mean every diagnostic is green. The live home still reports cache-lifetime opportunities (~135 KiB), a small image-delivery opportunity (~7 KiB), and render-blocking/critical-path diagnostics (~140 ms estimated saving). The synchronous widget initialization intentionally prevents preference flashes. The stylesheet remains render-blocking to prevent an unstyled first frame.
- GitHub Pages currently sends `Cache-Control: max-age=600`. A static HTML/CSS/JS patch does not change the hosting service's response headers. A proxy or different host would be a separate infrastructure decision; none was introduced.
- Extensions, hardware contention, network latency and server response variability can lower future scores. Do not promise 100 on every device or extension-enabled browser. Recheck in a clean browser profile, retaining all runs rather than just the best one.
- Nu validation and automated accessibility checks do not prove complete WCAG conformance or make the host page conformant. Human assistive-technology checks remain necessary.

## Deviations from the prompt (and why)

- Measured 100 is reported with test conditions rather than guaranteed under arbitrary conditions.
- This request was not a numbered phase. The section-12 report structure and granular commit/closing rules were followed, but no invented phase number or replacement phase-completion tag was created.
- Full local verification and Pages deployment passed; the unrelated macOS CI allocation cancellations remain explicit. The GitHub integration returned 403 for a retry, and the local GitHub CLI is not authenticated. No authentication or token changes were attempted.

## Handoff notes for the next phase

- [Pages build and deploy](https://github.com/qasimfida/accessibility/actions/runs/45455308121) succeeded for `fad05c47a713c8866a0edecc989f6b1fb758fb27`; the live asset names and document hashes were verified afterwards.
- [Code CI run](https://github.com/qasimfida/accessibility/actions/runs/45455307127): inspect/retry the four cancelled native macOS jobs when runners are available. At capture time, Node 20/22 verification, Chromium/Firefox/Pixel, Node 20 WebKit and the site job had passed; Node 22 WebKit was still running. The report-only push starts another CI run automatically. See `assets/site-performance/workflows.json` for the exact snapshot.
- In Chrome, use a fresh profile with extensions disabled, clear site data, select the intended Lighthouse device preset and keep the complete reports from repeated runs. Do not clear preferences on a visitor's behalf or weaken production accessibility behaviour for a benchmark.
- Continue human screen-reader/real-device checks using the existing manual test plan. No npm release is required for these website/build-tool changes.
