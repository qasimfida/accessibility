# Phase 11 — Post-publish verification

Status: BLOCKED (published React entry, live Pages deployment and missing predecessor tag)
Date: resumed 2026-11-15, Asia/Karachi; initial checks 2026-11-14. Required previous tag `phase-10-complete` remains absent. Attempt baseline: `349134a`; tested patch/documentation source: `698c274`, with evidence and report commits following.

## Summary

The maintainer clarified the published name: **@qasimfida/accessibility-widget@0.1.0**. Normal `npm view` now succeeds: latest is 0.1.0, license MIT, no runtime dependencies. The registry tarball contains the intended 17 files and matches its advertised SHA-512 integrity. Both version-pinned CDNs now serve the IIFE with the correct JavaScript content type and matching SHA-384 SRI.

A real release defect remains: the published 0.1.0 React JavaScript and declarations import the old, unavailable `@qasimfida/accessiblit`. Published React entry imports fail in ESM and CJS; its declarations fail in Node16 and Bundler consumers. The source is fixed and local packed consumers pass, but the agent has not published anything or changed the registry artifact. React users can use the tested core `init()`/`destroy()` effect while awaiting a maintainer patch.

The live Pages URL still serves the old Jekyll page with no widget, missing documentation routes, axe violations and a cdnjs request. Therefore this phase is not marked complete and no `phase-11-complete` tag is created.

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

Both match the registry IIFE and `node scripts/sri.mjs`:

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

`npm run test:site-snippets` passed eleven extracted snippets, five shell syntax checks, both type modes and eighteen packed browser integrations. React and Next core effects each create/remove two hosts under development StrictMode. The packed CDN test is explicitly intercepted for reproducibility; the real CDN results above are a separate non-intercepted check.

`npm run verify` passed: lint, types, **185 unit tests in 58 files**, six benchmark self-tests, build/SSR, size, publint and attw. Core lines/branches: **98.63%/97.96%**; overall lines/branches **96.12%/90.71%**. The new singleton regression raises the unit count by one. Fast checks ran before each commit; no quality threshold was weakened.

`npm run test:site` passed **220 tests (5.1 minutes)** across Chromium, Firefox, WebKit, emulated iPhone and Pixel, with zero retries/skips. All 175 page/media cases passed both closed/open axe scans (350 scans); keyboard, routes, internal links, first-party requests, persisted frames and streamed-parser checks also passed. [Raw updated local-site evidence](assets/phase-11/updated-local-site.json) retains all emitted results. This does not change the live deployment verdict.

### Live Pages: current public URL

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
| High     | R-4: old live Pages site, missing routes, violations and external script | Correct deployment/source configuration and remaining Pages CI prerequisites            | Open                                    |
| Blocker  | R-5: published React runtime/types self-import old name                  | 715bc03 fixes source and adds build-time entry resolution                               | Local fix; published 0.1.0 still broken |
| Medium   | R-6: stale Vitest alias tested built output                              | ce18dc2; new cross-entry singleton guard fails before and passes after                  | Fixed                                   |
| High     | R-7: snippets use obsolete name/version and lack release integrity       | 698c274; real CDN SRI and tested core React workaround; extracted checks pass           | Fixed source                            |

## Audits

### Accessibility

Real CDN closed/open axe: twelve clean scans. Real unpkg keyboard walk and fifteen packed browser keyboard flows pass. Packed targets measure at least **24px**, focus width **3px**, and zero panel horizontal overflow. Updated local-site minimum text contrast: **6.240363:1** for authored site text and **6.820450:1** for widget text; minimum site navigation/button/skip target **43.1875px** under spacing overrides, widget **24px**. Axe incomplete identifiers, including color-contrast, remain in the receipt; computed solid-background checks supplement them rather than calling incomplete results passes. These automated/browser results do not establish human screen-reader or physical-device qualification. Live Pages remains a failed audit and is never replaced by local results.

### Security and privacy

No publish/login/token/deprecate/unpublish or credential-read operation. Registry installs disable lifecycle scripts. No runtime dependencies, network code, cookies, storage keys or browser globals were introduced. Both npm audit and npm audit --omit=dev report **zero vulnerabilities**. The 21 existing development dependencies and their versions are unchanged; lockfile changes only align the package name/version. The CJS lint allowlist was renamed narrowly, not broadened. Workflow permissions are unchanged; actionlint is run before closing.

### Performance and size

IIFE remains **57,849 bytes raw / 19,603 bytes gzip**, unchanged, under the 35KB limit and identical to published CDN bytes. Fixed React entries are **393 bytes ESM / 847 bytes CJS**. Source maps and the combined-consumer module audit prove no core duplication or React code in core. No fresh absolute init benchmark or physical-device performance claim is made; core runtime bytes are unchanged.

## Known limitations (honest)

- Published 0.1.0 `/react` runtime/types remain broken until a new maintainer release. Do not overwrite/reuse 0.1.0 or treat the local tarball's same metadata version as a registry fix; bump a new patch version before publishing.
- Live Vite deployment and the required predecessor tag remain unresolved.
- No verified provenance attestation was returned, and no screen reader or physical device was tested.
- Browser audit instrumentation initially caused post-axe Firefox crashes; all original results are retained alongside the separated-context checks.

## Deviations from the prompt (and why)

The original name checks were superseded by the maintainer's explicit new package name. The existing name/version edit was retained and committed with the required self-import/lockfile alignment, rather than claiming the resumption began clean. The initial Phase 11 report and raw evidence remain in Git history. React helper failure, old live deployment and missing predecessor prevent a completion tag despite passing core/CDN/local-patch checks. No registry mutation is authorized or performed.

## Handoff notes for the next phase

1. Maintainer: review the local React/self-import fix, bump to a new compatible patch (for example 0.1.1) and publish through your own release process. The agent has not published or touched tokens. Verify its React ESM/CJS imports and declaration consumers from a fresh registry installation before announcing the helper as fixed.
2. Select GitHub Pages Source **GitHub Actions**, resolve mandatory deployment CI failures and deploy the audited site build. Repeat live axe, link, request and keyboard checks against the actual deployed URLs.
3. Resolve the missing phase-10-complete predecessor; do not create false historical completion tags. Only create phase-11-complete after the published-helper and live-site checks actually pass.

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
