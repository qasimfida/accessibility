# Phase 11 — Post-publish verification

Status: BLOCKED (npm publishing two-factor confirmation; 0.1.1 candidate verified, latest remains 0.1.0; predecessor tag absent)
Date: resumed 2026-11-15, Asia/Karachi; initial checks 2026-11-14. Required previous tag `phase-10-complete` remains absent. Attempt baseline: `349134a`; latest tested runtime fix: `90ef0c0`; first-frame CI and Pages build/deploy now pass. Earlier fixes and evidence remain below. Evidence/report commits follow.

## Summary

The maintainer clarified the published name: **@qasimfida/accessibility-widget@0.1.0**. Normal `npm view` now succeeds: latest is 0.1.0, license MIT, no runtime dependencies. The registry tarball contains the intended 17 files and matches its advertised SHA-512 integrity. Both version-pinned CDNs now serve the IIFE with the correct JavaScript content type and matching SHA-384 SRI.

A real release defect remains: the published 0.1.0 React JavaScript and declarations import the old, unavailable `@qasimfida/accessiblit`. Published React entry imports fail in ESM and CJS; its declarations fail in Node16 and Bundler consumers. The source is fixed and local packed consumers pass, but the agent has not published anything or changed the registry artifact. React users can use the tested core `init()`/`destroy()` effect while awaiting a maintainer patch.

The first-frame failure is fixed in `90ef0c0`: the GitHub Pages build passes all 230 tests, including every iPhone frame at 19.200001px. Pages deployment succeeds, and the actual live site passes 40 browser checks. Phase 11 remains blocked by the unchanged published React artifact, unavailable npm authentication (E401), and the missing predecessor tag; no `phase-11-complete` tag is created.

## What changed (files and why)

- `715bc03` — align the renamed package throughout React source/externalization, TS resolution, package/lock metadata, examples and consumer checks. `scripts/check-ssr.mjs` now resolves both React entries while a throwing window getter is installed, catching broken self-imports as part of every build. The maintainer's pre-existing package.json name/version edits were retained and formatted, not discarded; PKG_NAME now follows the explicitly clarified name. Browser global, repository and Pages URL remain Accessiblit/accessiblit.
- `ce18dc2` — correct the stale Vitest alias and add a cross-entry singleton test. With the old alias, React could load built output and the new test failed (one failed, four passed); with the source alias, all five React tests pass.
- `698c274` — README, site installation/options and integration guide now use the real package name and pinned 0.1.0 CDN SRI, explain the published React issue, and demonstrate the working core-effect pattern for React/Next. Packed snippet checks follow the updated names and explicitly distinguish intercepted packed tests from real CDN tests.
- `9486736` — preserve registry metadata, tarball inventory, published failures, fixed local examples, actual CDN requests, keyboard and live-site results in [renamed-release-verification.json](assets/phase-11/renamed-release-verification.json).
- Earlier attempt commits `eb9b382`, `84bdb60`, `255198f` corrected the obsolete foundation-only README and preserved unavailable-package checks. Their [original evidence](assets/phase-11/public-checks.json) remains historical, not the current result for the new name.

## Verification (commands run, real results)

### Preflight and registry

Read AGENTS.md completely. Branch is main; pull reported already up to date. This resumption began with the maintainer's uncommitted package.json rename/version edits; these exact intended values were included in the related fix. No unrelated work was reset, stashed or discarded. `git ls-remote --tags origin 'refs/tags/phase-10-complete*'` returned no tag. Do not infer Phase 9/10 completion from npm availability.

`npm view @qasimfida/accessibility-widget@0.1.0 version dist-tags license dist --json --prefer-online` succeeds. It reports version/latest 0.1.0, MIT, 17 files and the tarball URL. Initial discovery URLs returned E404, while the exact-version endpoint already worked; a later normal lookup and exact npm-spec install succeeded. Those earlier responses were not relabelled as passes.

A fresh temporary project installed the exact npm spec with lifecycle scripts disabled, alongside React and its types for the consumer tests. The separate registry tarball download was verified against dist.integrity using SHA-512. Registry metadata omitted `files`; the actual tarball manifest's allowlist is `dist`, LICENSE and README.md. Its complete file inventory is:

```text
LICENSE
README.md
dist/accessiblit.min.js
dist/accessiblit.min.js.map
dist/index.cjs
dist/index.cjs.map
dist/index.d.cts
dist/index.d.ts
dist/index.mjs
dist/index.mjs.map
dist/react.cjs
dist/react.cjs.map
dist/react.d.cts
dist/react.d.ts
dist/react.mjs
dist/react.mjs.map
package.json
```

There is no `dist.attestations` field in the observed metadata. Registry signature entries are present, but no provenance attestation was verified or advertised as verified. No credentials were inspected and no registry write/token operation was run.

### Real CDN files and browser consumers

| Provider / pinned URL                                                                      | HTTP | Content type                          | Bytes  | SHA-384 |
| ------------------------------------------------------------------------------------------ | ---- | ------------------------------------- | ------ | ------- |
| https://unpkg.com/@qasimfida/accessibility-widget@0.1.0/dist/accessiblit.min.js            | 200  | text/javascript; charset=utf-8        | 57,849 | Matches |
| https://cdn.jsdelivr.net/npm/@qasimfida/accessibility-widget@0.1.0/dist/accessiblit.min.js | 200  | application/javascript; charset=utf-8 | 57,849 | Matches |

Both match the registry IIFE and `node scripts/sri.mjs` when run against that release artifact (the current patched local build has a different hash):

```text
sha384-16q5Bwqwx+EGwUWGN1IpmuUfkCwMctpxWVZg84pmiOw3FRectQlkJ9Q4RW30QS7M
```

Real HTML pages load each actual CDN URL with integrity and crossorigin=anonymous. **Six browser/provider integrations pass**, across Chromium, Firefox and WebKit: open/close, change/reset, cleanup, no page errors and zero extra feature requests. **Twelve closed/open axe scans report zero violations**, with no disabled rules or response interception.

The first ad-hoc combined audit/interaction probe crashed Firefox on a post-axe interaction in two cases. That receipt is retained. Final keyboard/action checks and full-rule axe scans use independent contexts, preserving every state/action while avoiding interaction with an instrumented audit document. No runtime package byte changed between those runs.

The real-unpkg keyboard-only walk passed in Chromium: Alt+A → focused Close → Tab twice → increase Font size → Enter → 19 Tabs to Reset all → Space → Escape → focused launcher. Announcements were exactly “Font size 110 percent” and “All options reset.” The probe awaits these deliberately asynchronous live-region updates; an initial immediate read was corrected rather than changing the expected text.

### Published versus fixed local consumers

| Consumer                                                | Published 0.1.0                     | Fixed local packed build       |
| ------------------------------------------------------- | ----------------------------------- | ------------------------------ |
| Plain JS ESM/CJS, SSR lifecycle                         | Pass / pass                         | Pass / pass                    |
| Core + core React effect, TypeScript Node16 and Bundler | Pass / pass                         | Pass / pass                    |
| `/react` ESM/CJS imports                                | Fail / fail: old package not found  | Pass / pass                    |
| `/react` declarations, Node16 and Bundler               | Fail / fail: TS2307 for old package | Pass / pass                    |
| Core useEffect integration, Chromium/Firefox/WebKit     | Three pass, including cleanup       | Three pass                     |
| Helper/Next browser integrations                        | Published helper cannot resolve     | Fixed packed integrations pass |

`npm run test:examples` passed five installed tarball examples (HTML, Node, consumers, React/Vite and Next.js), both type modes, React 17.0.2/18.3.1 compatibility and fifteen browser integrations. React 19.3.1 is used in the main browser consumer. Tree shaking leaves only the consumer constant when unused; combined core/helper output has one core and one React module. React sources stay outside the core bundle.

`npm run test:site-snippets` passed eleven extracted snippets, five shell syntax checks, both type modes and eighteen packed browser integrations. React and Next core effects each create/remove two hosts under development StrictMode. After R-11 (`ad3c566`), the extracted CDN snippet loads the real version-pinned CDN bytes with SRI, without interception. The other five browser entries use the installed local tarball. All eighteen integrations passed again after the content fix; see the continuation evidence.

`npm run verify` passed: lint, types, **186 unit tests in 58 files**, six benchmark self-tests, build/SSR, size, publint and attw. Core lines/branches: **98.63%/97.96%**; overall lines/branches **96.12%/90.84%**. The singleton and character-data regressions are included in that count. Fast checks ran before each commit; no quality threshold was weakened.

`npm run test:site` passed **220 tests (5.1 minutes)** across Chromium, Firefox, WebKit, emulated iPhone and Pixel, with zero retries/skips. All 175 page/media cases passed both closed/open axe scans (350 scans); keyboard, routes, internal links, first-party requests, persisted frames and streamed-parser checks also passed. [Raw updated local-site evidence](assets/phase-11/updated-local-site.json) retains all emitted results. This does not change the live deployment verdict.

### Earlier live Pages observation (superseded by the verified deployment below)

Chromium opened the actual URL and ran default axe plus same-origin link/request checks, without substituting the local Vite build:

| Path under /accessiblit/ | HTTP | Axe rule violations | Widget hosts |
| ------------------------ | ---- | ------------------- | ------------ |
| Home                     | 200  | 3                   | 0            |
| install/                 | 404  | 6                   | 0            |
| options/                 | 404  | 6                   | 0            |
| faq/                     | 404  | 6                   | 0            |
| 404.html                 | 404  | 6                   | 0            |

Home is titled “Accessiblit | accessiblit”; its rules are landmark-one-main, link-in-text-block and region. Error-page violations apply to GitHub's returned error document, not the local Vite page. A widget-open audit is unavailable on this deployment because no widget exists there.

Seven page/asset requests included one third-party request: `https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js`. Four discovered same-origin link destinations were checked: project home, source installation HTML and accessibility HTML returned 200; the owner home returned 404. The intended install/options/FAQ routes failed explicitly. The live link/network/accessibility verdict remains **FAIL**, separate from passing local/CDN checks.

## Review findings and fixes

| Severity | Finding                                                                  | Fix / resolution                                                                        | Status                                  |
| -------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | --------------------------------------- |
| High     | R-1: obsolete foundation-only README                                     | eb9b382; further release accuracy in 698c274                                            | Fixed source                            |
| Blocker  | R-2: wrong package name used for public verification                     | Maintainer clarified @qasimfida/accessibility-widget; normal npm and CDN reads now pass | Resolved for corrected name             |
| Blocker  | R-3: phase-10-complete tag absent                                        | Maintainer must identify/complete the real predecessor; no fabricated tag               | Open                                    |
| High     | R-4: old live Pages site, missing routes, violations and external script | Pages run 43762441286 deploys 90ef0c0; 40 live checks pass                              | Resolved                                |
| Blocker  | R-5: published React runtime/types self-import old name                  | 715bc03 fixes source and adds build-time entry resolution                               | Local fix; published 0.1.0 still broken |
| Medium   | R-6: stale Vitest alias tested built output                              | ce18dc2; new cross-entry singleton guard fails before and passes after                  | Fixed                                   |
| High     | R-7: snippets use obsolete name/version and lack release integrity       | 698c274; real CDN SRI and tested core React workaround; extracted checks pass           | Fixed source                            |

## Audits

### Accessibility

Real CDN closed/open axe: twelve clean scans. Real unpkg keyboard walk and fifteen packed browser keyboard flows pass. Packed targets measure at least **24px**, focus width **3px**, and zero panel horizontal overflow. Updated local-site minimum text contrast: **6.240363:1** for authored site text and **6.820450:1** for widget text; minimum site navigation/button/skip target **43.1875px** under spacing overrides, widget **24px**. Axe incomplete identifiers, including color-contrast, remain in the receipt; computed solid-background checks supplement them rather than calling incomplete results passes. These automated/browser results do not establish human screen-reader or physical-device qualification. Live Pages remains a failed audit and is never replaced by local results.

### Security and privacy

No publish/login/token/deprecate/unpublish or credential-read operation. Registry installs disable lifecycle scripts. No runtime dependencies, network code, cookies, storage keys or browser globals were introduced. Both npm audit and npm audit --omit=dev report **zero vulnerabilities**. The 21 existing development dependencies and their versions are unchanged; lockfile changes only align the package name/version. The CJS lint allowlist was renamed narrowly, not broadened. Workflow permissions are unchanged; actionlint is run before closing.

### Performance and size

Published 0.1.0 is **57,849 bytes raw / 19,603 bytes gzip**. The patched local build is **57,894 bytes raw / 19,625 bytes gzip** (+45 raw/+22 gzip), below the unchanged 35KB limit. It differs from the immutable published artifact; never pair its SRI with a 0.1.0 CDN URL. Fixed React entries are **393 bytes ESM / 847 bytes CJS**. Source maps and the combined-consumer module audit prove no core duplication or React code in core. No fresh absolute init benchmark or physical-device performance claim is made; the content observer changed, so historical reference timings are not claimed as a fresh measurement. Both Node 20/22 CI trend guards passed on source fb1b0c3.

## Known limitations (honest)

- Published 0.1.0 `/react` runtime/types remain broken until a new maintainer release. Do not overwrite/reuse 0.1.0 or treat the local tarball's same metadata version as a registry fix; bump a new patch version before publishing.
- Live Vite deployment is now verified; the required predecessor tag remains absent.
- No verified provenance attestation was returned, and no screen reader or physical device was tested.
- Browser audit instrumentation initially caused post-axe Firefox crashes; all original results are retained alongside the separated-context checks.

## Deviations from the prompt (and why)

The original name checks were superseded by the maintainer's explicit new package name. The existing name/version edit was retained and committed with the required self-import/lockfile alignment, rather than claiming the resumption began clean. The initial Phase 11 report and raw evidence remain in Git history. React helper failure, old live deployment and missing predecessor prevent a completion tag despite passing core/CDN/local-patch checks. No registry mutation is authorized or performed.

## Handoff notes for the next phase

1. Maintainer: review the React/self-import and character-data fixes, resolve the remaining CI first-frame failure, then bump to a new compatible patch (for example 0.1.1) and publish through your own release process. The agent has not published or touched tokens. Verify its React ESM/CJS imports and declaration consumers from a fresh registry installation before announcing the helper as fixed.
2. Pages Source is now GitHub Actions, deployment succeeds, and live checks pass. Repeat live checks after future site/releases; no further source-setting change is requested.
3. The first-frame CI blocker is resolved in 90ef0c0. Resolve the missing phase-10-complete predecessor; do not create false historical completion tags. Only create phase-11-complete after the published-helper and live-site checks actually pass.

### First 30 days maintenance plan

1. **Days 1–2 after a verifiable release:** confirm npm metadata, exact-version installation, public files, optional provenance and both pinned CDN files/SRI; verify Pages routes, widget keyboard behavior, axe and first-party-only assets. Record the actual release hash/version.
2. **Every week:** review dependency-update proposals and npm audit output; update development dependencies in granular commits with verify and relevant consumer/browser checks. Keep runtime dependencies at zero and all existing gates unchanged. Review CI timing failures against retained baseline evidence; do not inflate the baseline to hide a regression.
3. **Issue triage within two business days:** reproduce against the reporter's exact version, browser, host-page styles and integration. Prioritize security/privacy, tenant-independent host-page breakage, keyboard traps and data/lifecycle residue. Avoid asking for private page data or credentials; use a minimal public reproduction.
4. **Versioning:** follow SemVer. For the 0.x line, use patches for compatible bug fixes and minor versions for intentionally breaking API/behavior changes, documenting migrations. Never replace a published artifact or reuse its version; only the maintainer publishes. Preserve pinned CDN URLs and provide new SRI for each new artifact.
5. **By day 30:** review unresolved limitations and regressions, execute the human screen-reader/device scripts, update the changelog and prioritize the next compatible fixes. Keep claims limited to observed tests; publish a patch only through the reviewed human release process.

## Attempt commit list

The required predecessor tag is absent, so this list uses the recorded attempt baseline `349134a`, without claiming a Phase 10 boundary. The closing report commit follows these entries.

```text
eb9b382 docs(readme): replace the stale foundation-only description
84bdb60 docs(audit): record unavailable registry CDN and live-site checks
255198f docs(report): record blocked post-publish checks and maintenance
715bc03 fix(react): align self-imports with the published package name
ce18dc2 fix(react-tests): resolve renamed self-imports to the source core
698c274 docs(integrations): pin the release SRI and explain the React workaround
9486736 docs(audit): preserve published and patched package verification
bae7abf docs(audit): preserve the updated site browser matrix
```

## Continuation — 2026-11-15

Read AGENTS.md completely again. Main was clean before this continuation's edits, and `git pull --ff-only` reported already up to date. The registry still reports latest 0.1.0; phase-10-complete remains absent. No new publication or Pages setting confirmation was received.

### Remaining CI blocker and bounded fixes

- **R-9 (High):** text added to an existing empty Text node was not observed. `faa788a` adds characterData observation while retaining private-node filtering and disconnect cleanup. The new unit failed before the fix; the native WebKit five-frame regression read 16px in every frame before the fix. Afterward, eight focused units, fifteen first-frame browser cases and thirty-three content browser cases passed. A real streamed-parser comparison across Chromium, Firefox and WebKit recorded published 0.1.0 at 16px and the patched build at 19.2px in all five frames. [Raw evidence](assets/phase-11/character-data-fix.json).
- This is a proven separate defect, **not a complete explanation of the original CI failure**. On unchanged Linux CI run [43633496975](https://github.com/qasimfida/accessiblit/actions/runs/43633496975), the iPhone site's first sample is still **16px**, followed by four 19.200001px samples. The feature class and scale are active, but the first sample lacks the font marker. Other projects' first frames pass. The site job reports **224 passed, one failed**; snippets are skipped there because the mandatory site gate failed. [Actual CI samples](assets/phase-11/remaining-ci-failure.json). No assertion, retry, project, runner or timing threshold was relaxed. Section 11's unsuccessful-attempt stop rule applies: the remaining first-frame acceptance failure is reported as a blocker rather than continuing speculative patches.
- **R-10 (Medium):** `d9c38bb` moves the existing Pages-source check ahead of expensive builds. Run 43632185273 confirms the public repository is not configured for workflow deployment. All build, accessibility, snippet and deployment gates remain in place. The current workflow token has no Administration permission. GitHub's [official update endpoint](https://docs.github.com/en/rest/pages/pages#update-information-about-a-github-pages-site) requires Pages write **and Administration write**, so changing this setting requires the maintainer; no personal token or broader workflow permission was introduced.
- **R-11 (Medium):** `ad3c566` removes substitution of local bytes for a real pinned CDN snippet. That substitution would make the old release SRI fail after a local code change. Eighteen snippet browser integrations now pass with actual CDN bytes for the pinned snippet and local packed bytes for the five other entries. The published SRI above remains correct. Patched local SRI is `sha384-kVUM8aT3W8Z7jzyUUTm04J0wcl6IKGycMASG7s+VuYwwC0xmsil4c85gxssHCaOk` and is **not** a published-version snippet.
- **R-12 (Medium, test tooling):** concurrent local runtime/site suites shared Playwright's output directory. One run finished with 224 passing cases and one trace-file ENOENT, rather than a product assertion failure. `13fe12a` separates runtime and site artifact directories under ignored test-results. The failed receipt is retained in this report; the isolated rerun is recorded below. Tests and retries are unchanged.

### Updated live-site observation

The latest real Chromium check still sees Jekyll, no widget hosts and the cdnjs anchor script. Home returns 200 with **four axe rule violations**; install and options return 404 with six each; FAQ returned a **503** with seven on this observation; 404.html returns 404 with six. Eleven discovered same-origin destinations were checked. Earlier observations above remain historical; the 503 is reported as observed, not assigned to the local Vite implementation. [Continued live/CI diagnostics](assets/phase-11/continued-diagnostics.json).

The README and install page now disclose both the published React helper problem and the empty-text scaling issue (`fb1b0c3`). The new patch must include both fixes, and the remaining CI failure must still be resolved. Screen readers and physical devices remain unverified. No new runtime storage, network API or dependency was added.

### Continuation commit list

```text
6c0800d docs(report): record the verified release and required patch
a552c76 test(site): retain first-frame diagnostics before assertions
04ab91f docs(audit): retain remaining CI and live-site failures
d9c38bb ci(pages): check publishing configuration before build
faa788a fix(content): scale text filled into existing text nodes
ad3c566 test(site): preserve release SRI against actual CDN bytes
fb1b0c3 docs(release): disclose the published empty-text scaling issue
04a942e docs(audit): preserve the character-data failure and fix evidence
13fe12a test(browser): isolate runtime and site artifacts
```

### Final local closing checks

The isolated full site rerun passed **225 tests in 5.0 minutes**, zero retries/skips. This supersedes the local trace-file collision only; it does not supersede the failing Linux iPhone CI evidence. Full `npm run verify` passed again (186 unit tests, six benchmark self-tests, lint, types, build/SSR, size, publint, attw). `actionlint` passed. Both `npm audit` and `npm audit --omit=dev` report **zero vulnerabilities**. Fast lint/type/unit-tooling checks ran before the report commit.

Self-review finds no remaining unsafe API, new storage/network behavior or widened permissions in this continuation. The unresolved High first-frame defect and published-helper/deployment blockers remain explicitly open. No completion tag is created.

## Build-failure follow-up — 2026-11-16

The maintainer explicitly requested another fix pass for build errors and warnings. Read AGENTS.md completely; main was clean and `git pull --ff-only` was already up to date. `npm run build` and `npm run build:site` both succeeded without compiler or bundler warnings before this patch. The latest failing checks were downstream CI gates, not compilation: iPhone first-frame scaling, Node 20 WebKit trend regression (median **5ms**, p95 **7ms**, unchanged guard **4.5ms**), and the Pages publishing-source preflight.

### New findings and fixes

| Severity | Finding                                                                                 | Fix                                                                                                                                                                                                                                                         | Status                                                             |
| -------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| High     | R-13: empty semantic blocks have no measured font baseline until their text is observed | `d9ec36a`: font scaling includes empty semantic text blocks before text arrives; empty icon wrappers remain excluded. New unit checks baseline ownership and exact reset; browser regression asserts the baseline exists while the paragraph is still empty | Local checks pass; CI must confirm the original Linux iPhone frame |
| Medium   | R-14: initialization builds hidden feature controls                                     | `15e62c6`: defer controls until first panel open, read current settings at that time, retain the dialog shell and launcher, and create controls only once. New tests cover state changes before opening, repeated open/close, and destroy                   | Local checks pass; unchanged CI trend guard must confirm           |
| Low      | Local Playwright processes inherit conflicting NO_COLOR and FORCE_COLOR variables       | Run the checks with `env -u NO_COLOR`, removing the conflicting user environment override. No warning suppression, config weakening or production change                                                                                                    | Conflict removed for final browser checks                          |

The diagnostic Chromium CPU profile sampled 200 init/destroy loops at 100 microsecond intervals. Total measured loop time fell from **128.1ms to 69.6ms**; controlShell self-time was **6.826ms** before and did not appear among the top 25 afterward. These numbers include destroy, profiling overhead and a non-reference workload; they are **not** the absolute init gate. The standard `npm run perf -- --other-apps-open --output /tmp/build-fix-perf.json` was attempted but correctly refused to run because the Mac reported Battery Power. No benchmark baseline, method, threshold or CI runner was changed.

`npm run verify` passes with **189 unit tests across 58 files**, six benchmark tooling tests, lint, typecheck, build/SSR, size, publint and attw. Core line/branch coverage remains **98.63%/97.96%**. The focused first-frame checks passed ten tests across five projects; 48 feature tests and 129 UI/core/React tests pass. A full site run started before the panel change was deliberately interrupted (exit 130), then restarted against the final source; it is not counted as a pass.

The patched IIFE is **57,997 bytes raw / 19,704 bytes gzip**, below the unchanged 35KB limit. Its local SRI is `sha384-+Q/vEhA44ocbj80FFsWUI6m2P4FuZEZ0YjVEi1bZd2cUHqV3y1vToiL57pD0OKrQ`; this is not a hash for the immutable published 0.1.0 file. Published snippets retain the actual release SRI. No new dependency, storage key, network request, unsafe DOM operation or workflow permission was introduced. Publication and completion tagging remain blocked until the mandatory checks and public artifact checks pass.

### Follow-up verification and remaining blocker

`c4a4191` updates the streamed-parser regression to require the **scaled 19.2px baseline on the empty paragraph**, while retaining the empty-text check and every first-visible-frame assertion. The prior full final-source site run had **220 passes and five failures**, all five expecting the obsolete unscaled 16px empty baseline. The corrected five streamed cases then passed across Chromium, Firefox, WebKit, iPhone and Pixel (**9.3 seconds**). This is not relabelled as a single clean 225-test rerun.

Extracted snippet checks pass **18 browser integrations**, eleven snippets, five shell checks, both TypeScript modes, and StrictMode cleanup. The actual pinned CDN bytes remain independently checked. The broader panel/accessibility/keyboard run records **103 passed, one failed, two capability skips (3.3 minutes)**. The skipped cases are existing non-Chromium pinch-zoom tests, not new exclusions. All eighteen-feature keyboard flows passed. The failure is Chromium desktop/light/reduced-motion: `uiEvidence` finds null focus after the open axe audit and the existing focus-width assertion cannot evaluate. **This remains an open High audit blocker; no claim that the panel audit is fully passing.**

Two uncommitted test-order/context experiments did not resolve that blocker; both triggered Firefox page crashes during the open axe scan. Their runs were stopped after clear failures, and every experimental test edit was reverted to HEAD. Three unsuccessful attempts were reached, so AGENTS.md section 11 requires reporting the blocker and stopping further attempts. Neither axe rules nor focus assertions were removed, and no failing test was retried into a claimed pass. Investigation of audit-induced focus changes remains a hypothesis, not an established product cause.

Self-review: no new runtime networking, storage, dependencies or unsafe DOM methods; deferred controls remain owned by the existing cleanup scope and use current state when first opened. `npm audit` reports zero vulnerabilities; actionlint passes. Final production behavior and bundle checks pass locally, but the panel audit, original Linux iPhone CI check, unchanged CI performance guard and public deployment/release checks still require a verified passing result. Main receives granular forward fixes only; no publication, completion tag, secret access, baseline reset or threshold change is performed in this follow-up.

Follow-up commit list:

```text
d9ec36a fix(font-size): classify semantic blocks before parser text arrives
15e62c6 perf(panel): build feature controls only on first open
c4a4191 test(font-size): require scaled baselines on empty parser blocks
```

## Parser-completion fix — 2026-11-16

The maintainer asked to fix the specific iPhone first-frame failure and rerun. Read AGENTS.md completely, confirmed clean main, and pulled fast-forward-only (already up to date). The pasted result also reproduces on source 7e028ef: CI run 43750801327/site job 132924086799 reports 224 passes and one failure. Its first iPhone sample is 16px at interactive readiness with no font marker, followed by four 19.200001px samples. Both trend guards and all runtime browser jobs on that source passed; the Pages source preflight also passed, confirming the maintainer's settings change.

**R-16 (High), `90ef0c0`:** active content observers now reconcile synchronously in capture phase when the parser reaches interactive readiness, before ordinary owner readiness listeners can sample content. The listener is owned by the existing feature scope and removed on off/destroy. This supplements mutation observation; it does not defer sampling, skip frames, change expected 19.2px values, retry failures or change any runner/gate.

A deterministic test withholds mutation callbacks through the parser-completion boundary. Before the fix it fails on Firefox, WebKit and iPhone (16px), while Chromium/Pixel pass. The first ordinary-phase readiness listener still fails those three cases (17 passes/three failures in the focused set), so it was not pushed. The capture-phase implementation passes all **20 focused browser tests (16.5s)**. A new unit proves capture ordering ahead of an already-registered ordinary listener and verifies cleanup; ten focused units pass. Only the local, unpublished commit was amended after these results; no pushed history was rewritten.

Full `npm run verify` passes with **190 unit tests / 58 files**, six benchmark self-tests, lint, types, build/SSR, size, publint and attw. Overall lines/branches: **96.15%/90.98%**; core **98.63%/97.96%**. The full local site suite passes **230 tests in 2.6 minutes**, two local workers, zero retries/skips. This includes unchanged first-frame expectations, the new parser-boundary case, all five browser/device projects, keyboard, links, requests and full-rule closed/open axe scans. Axe incomplete results remain reported separately. CI keeps its existing worker count and zero retries.

Both CI trend guards pass on 90ef0c0 against the unchanged committed baselines: Node 20 Chromium median/p95 **1.1/1.6ms**, WebKit **1/3ms**; Node 22 Chromium **1/1.2ms**, WebKit **2/3ms**. These are shared-runner trend results, not fresh absolute reference-machine qualification. IIFE: **58,089 bytes raw / 19,734 gzip**, under 35KB. Local SRI is `sha384-92p98tW9X5RIeEH3DgJaTj4mWx29zz9C5jAH1Jd+AeCQUHivVa6CYiWAkYtQ3JC3`, not the published 0.1.0 SRI.

Security/privacy review: one scoped DOM readiness listener; no new network, storage, dependency or unsafe DOM API. Runtime audit reports zero vulnerabilities; actionlint passes. A read-only registry identity check returns E401, so registry authentication is unavailable. No login, token operation or publication was attempted. Maintainer authentication was requested without asking for secrets in chat. The published latest version still reads 0.1.0. Full phase completion remains separate from the source fix.

[Raw parser-completion evidence](assets/phase-11/parser-completion-fix.json). New CI run 43762441180 and Pages run 43762441286 are being checked; their final outcomes and live-site checks follow below.

### Confirmed GitHub rerun and live deployment

The reported error is **FIXED** in `90ef0c0`. [Pages run 43762441286](https://github.com/qasimfida/accessiblit/actions/runs/43762441286) passes its complete build and deployment. The Linux build reports **230 tests passed (7.4 minutes)**, without retries: iPhone frames are **[19.200001, 19.200001, 19.200001, 19.200001, 19.200001]**, and all other projects' five first frames also pass. The independent [CI site job](https://github.com/qasimfida/accessiblit/actions/runs/43762441180) succeeds too, including the snippet checks. The CI run currently has thirteen successful jobs; the two native WebKit runtime jobs remain in progress at this evidence capture. Their overall result is not claimed yet. [Raw CI jobs and frames](assets/phase-11/parser-fix-ci.json).

The actual public site now passes **40 live Chromium browser tests (53.4s)**, zero retries, using the repository's existing full-rule accessibility, keyboard, internal-link, network and RTL table-keyboard tests against https://qasimfida.github.io/accessiblit/ . No webServer, response substitution or intercepted CDN is used for this live run. All 35 page/media cases pass both closed/open scans (70 scans); the exact emitted incomplete checks remain in the receipt. The real keyboard walk visits the pages, operates the demo, changes/reset settings and returns focus. Internal destinations/fragments/assets resolve and no third-party request is observed. This supersedes the old Jekyll failure; its historical evidence remains preserved.

A separate direct audit confirms home, install, options, FAQ and 404.html all return **200**, each has exactly one widget host, and all five closed scans have zero violations. Eighteen same-origin link URLs checked in that direct audit return 200. The fuller live suite additionally checks assets and fragments. Published 0.1.0 remains immutable and its React-helper problem is not fixed by deploying the local source.

Review R-4 (Pages deployment) and R-16 (first-frame scaling) are now resolved by the tested workflow/deployment and `90ef0c0`. No gate was weakened and no failing sample discarded. The prior local focus-audit failure is retained historically; the current Linux Chromium/Firefox runtime jobs pass and the live widget focus/contrast checks pass. Two native WebKit runtime jobs remain pending, so no overall CI pass or complete-phase tag is claimed.

Remaining handoff: npm's read-only identity check returns E401; authenticate locally without sharing credentials before any authorized release can proceed. The published latest is still 0.1.0, and `git ls-remote` still finds no phase-10-complete tag. Do not infer registry/publication completion from this successfully fixed build. The phase maintenance plan and manual screen-reader/device limitations remain applicable.

## Verified 0.1.1 candidate and publication handoff — 2026-11-16

The maintainer explicitly authorized agent publication ("you do it") and then confirmed local authentication ready. This later, specific instruction was applied as a publication-only exception to the original AGENTS.md section 2.1 human-only restriction. No npm login, token operation, credential-file inspection, security-setting change, unpublish or deprecation was performed.

The read-only identity check now returns qasimfida, matching the published maintainer. Both CI runs on 90ef0c0 and d6bb60e completed successfully, including every native WebKit job. The selected Vercel UI review was completed separately: **245 local site tests**, **44 live browser checks**, successful Pages deployment, and zero axe violations. See [the UI report](ui-vercel-guidelines.md).

`047c9ac` prepares version 0.1.1 in package/lock metadata; `caca0bf` prepares its README with the correct pinned version, SRI and React-helper guidance. Full verify passes (190 units plus six benchmark self-tests). Installed-tarball examples pass: five example projects, React 17.0.2/18.3.1 compatibility, fifteen browser integrations, package/type checks, tree shaking and one core/one React module in combined consumers.

The **exact candidate tarball** separately passes **17 fresh consumer checks**: plain JS ESM/CJS, React-entry ESM/CJS SSR with a throwing window getter, TypeScript Node16/Bundler (including FeatureId rejection), and effect/hook/component browser integration and cleanup in Chromium, Firefox and WebKit. It contains only the intended 17 files. No tests, reports, credentials or runtime dependencies are included. [Candidate receipt](assets/phase-11/release-011-candidate.json).

Publication did not complete. The first call to npm publish was rejected with EOTP. A supported interactive browser-confirmation flow was then attempted; its completion endpoint returned E404 before a successful publish result. No two-factor code was requested in chat, read or supplied by the agent. A subsequent registry read still reports **latest 0.1.0**. This is a registry authentication blocker, not a build/test failure. No provenance attestation is claimed and no completion/release tag is created.

The verified tarball is available locally as `qasimfida-accessibility-widget-0.1.1.tgz` in the repository root. It is ignored, not committed, and its copied bytes match the tested integrity:

```text
sha512-VYRlXesqLcOD+GUW8PicnDhuGEhDVS8cb3ThvnnuYUexic2Uu0qShPbqpfIUbNsw0iMzp66fT351gs9dsd+mPQ==
```

Complete the final publish interactively in your own local terminal, handling any browser/2FA prompt there:

```sh
npm publish ./qasimfida-accessibility-widget-0.1.1.tgz --access public --tag latest --ignore-scripts --registry=https://registry.npmjs.org/
```

After the registry confirms 0.1.1, repeat exact-version installation and the real unpkg/jsDelivr byte/SRI/browser checks, update the site's version-pinned snippets to that verified release, and complete the final report/verify/tag protocol. The site still accurately documents the existing 0.1.0 artifact; its pins were not advanced to an unconfirmed publication. The missing phase-10-complete tag remains a recorded historical gap, not a tag fabricated by the agent.
