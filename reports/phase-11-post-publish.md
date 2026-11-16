# Phase 11 — Post-publish verification

Status: PASS WITH NOTES
Date: 2026-11-16, Asia/Karachi. Verified release: **@qasimfida/accessibility-widget@0.1.1**.
Release source: caca0bf; current installation docs: 9aad245. Closing report/tag follows the listed commits.

## Summary

**0.1.1 is published and latest.** The registry artifact matches the exact tested tarball. Fresh registry consumers pass all 17 checks, including React imports and declarations that failed in 0.1.0. Both real version-pinned CDNs return the correct IIFE/MIME type/SRI; six browser/provider integrations and twelve axe scans pass. The live GitHub Pages site now uses the verified 0.1.1 pin and passes 45 browser checks, including persisted-font first frames. The Vercel UI follow-up is deployed and verified separately.

The required historical phase-10-complete tag was not found. The maintainer continued this work after that absence was reported. This report and phase-11-complete attest the current post-publish checks only; they do not assert that earlier phases were completed, and no historical tag was fabricated. Provenance was not used/advertised. Human screen readers and physical devices remain unverified.

Earlier failures are preserved in Git history and [historical receipts](assets/phase-11/). They are not relabelled as passes. [Final release evidence](assets/phase-11/published-011-verification.json) contains the current metadata, files, consumers, CDN requests, CI and live results.

## What changed (files and why)

- 715bc03 / ce18dc2: correct React self-imports after the package rename, align consumer aliases, and guard build-time SSR imports/cross-entry ownership.
- faa788a / d9ec36a / 90ef0c0: observe existing text-node edits, classify empty semantic blocks, and reconcile in capture phase at parser completion. The final boundary regression fails before and passes after; the unchanged iPhone first-frame check now passes in CI.
- 13fe12a / ad3c566: isolate Playwright artifact directories and keep real pinned-CDN checks separate from local packed-byte checks.
- 047c9ac / caca0bf: prepare the compatible 0.1.1 package/lock metadata and README, including the actual IIFE SRI.
- 9aad245: update installation pins/SRI, remove resolved 0.1.0 warnings, correct integration guidance, and pin Git distribution to the tested release source.
- Vercel review/UI updates: six granular fixes plus their browser evidence; see [UI report](ui-vercel-guidelines.md). No library runtime dependency or public API changed during that follow-up.

## Verification (commands run, real results)

### Preflight and registry

Read AGENTS.md completely. Main was clean; git pull --ff-only reported already up to date. Local Node **24.13.0**, npm **11.6.2**, git **2.54.0 (Apple Git-157)**; CI verifies Node 20 and 22. No constant contains YOUR_. phase-10-complete remains absent as noted above.

The maintainer explicitly authorized agent publication and confirmed local authentication ready. This later specific instruction was applied as a publication-only exception to the original human-only rule in AGENTS.md section 2.1. No npm login/token/unpublish/deprecate command, credential-file inspection, credential/security-setting change or forced Git operation was performed.

The initial non-interactive publish was rejected with EOTP. The first browser flow closed with E404 before completion. A fresh browser challenge was completed privately by the maintainer; npm then accepted 0.1.1. Its processing notice briefly preceded public availability; normal npm view now reports **version/latest 0.1.1, MIT**. No version was published twice or overwritten.

npm view @qasimfida/accessibility-widget@0.1.1 confirms entry points, exports, optional React >=17 peer and distribution metadata. There are **zero runtime dependencies**. npm view omits the files allowlist, so the downloaded tarball manifest was checked: dist, LICENSE and README.md. The actual archive has **17 files / 799,988 unpacked bytes** and matches the tested SHA-512 integrity:

```text
sha512-VYRlXesqLcOD+GUW8PicnDhuGEhDVS8cb3ThvnnuYUexic2Uu0qShPbqpfIUbNsw0iMzp66fT351gs9dsd+mPQ==
```

No dist.attestations field was advertised, and no provenance option was used. Registry signatures are present but are not described as provenance attestations or independently verified signatures.

### Exact file inventory

npm pack --dry-run and the actual candidate/registry archive contain only:

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

No secrets, tests, reports, dependencies or unrelated generated files are included. Sourcemaps are adjacent to their JavaScript entries.

### CDN and SRI

| Version-pinned URL                                                                         | HTTP | Content type                          | Raw bytes |
| ------------------------------------------------------------------------------------------ | ---- | ------------------------------------- | --------- |
| https://unpkg.com/@qasimfida/accessibility-widget@0.1.1/dist/accessiblit.min.js            | 200  | text/javascript; charset=utf-8        | 58,089    |
| https://cdn.jsdelivr.net/npm/@qasimfida/accessibility-widget@0.1.1/dist/accessiblit.min.js | 200  | application/javascript; charset=utf-8 | 58,089    |

Both match the registry IIFE and node scripts/sri.mjs:

```text
sha384-92p98tW9X5RIeEH3DgJaTj4mWx29zz9C5jAH1Jd+AeCQUHivVa6CYiWAkYtQ3JC3
```

**Six real CDN integrations pass** (two providers × Chromium/Firefox/WebKit), without response interception. Open/close, change/reset and destroy work, no page errors occur, and feature changes cause zero additional requests. Independent closed/open audit contexts produce **twelve axe scans with zero violations**; no rules are disabled. Separating interaction and audit contexts retains coverage while avoiding the previously observed post-audit Firefox instrumentation crashes.

### Fresh registry consumers and packed examples

A fresh temporary project installed the exact npm registry spec, with lifecycle scripts disabled and no symlink/source alias. **All 17 checks pass**:

- plain JS ESM and CommonJS, including SSR lifecycle;
- ESM/CJS React entry resolution with a throwing window getter;
- TypeScript Node16/Bundler declarations, options and negative FeatureId checks;
- React core effect, hook and component in Chromium/Firefox/WebKit, including one host and complete unmount cleanup.

npm run test:examples also passes five tarball-installed example projects, both type modes, React 17.0.2/18.3.1 compatibility and fifteen browser integrations. Vite and Next production builds pass. Tree shaking retains only a consumer constant for unused imports; combined consumers contain one core and one React entry. React is absent from the core IIFE.

npm run test:site-snippets passes eleven extracted snippets, five shell syntax checks, both TypeScript modes and eighteen browser integrations. The actual pinned CDN snippet loads published 0.1.1 bytes; the other five entries use an installed local tarball. React/Next development StrictMode each creates/removes two hosts. Private-registry and Git shell snippets are syntax checked; no private registry credentials or private repository were used.

### Quality gates and live site

npm run verify passes lint, typecheck, **190 units / 58 files**, six benchmark self-tests, build/SSR, size, publint and attw. Overall lines/branches: **96.15%/90.98%**; core **98.63%/97.96%**. Thresholds are unchanged. Fast checks ran before every commit.

The final local site matrix passes **245 tests (2.6 minutes)** across Chromium/Firefox/WebKit/iPhone/Pixel, zero retries/skips. [CI run 43844429520](https://github.com/qasimfida/accessiblit/actions/runs/43844429520) passes **all 15 jobs**, including native WebKit and both unchanged performance guards. [Pages run 43844429475](https://github.com/qasimfida/accessiblit/actions/runs/43844429475) passes build and deployment.

The actual https://qasimfida.github.io/accessiblit/ site passes **45 live Chromium checks (58.5 seconds)**, with no local webServer or response substitution. These cover all five pages, seven accessibility profiles, closed/open panels, keyboard operation, theme metadata, heading anchors, held-pointer feedback, hover contrast, links/assets/fragments, LTR/RTL table navigation, first-party requests and persisted-font first frames. All 70 live axe scans have zero violations. Incomplete results remain recorded separately.

The live installation HTML explicitly contains **0.1.1 and the correct SRI**, with resolved stale-package warnings removed. Its self-hosted widget file returns 200 and exactly matches the published IIFE hash. The historical Jekyll deployment, missing routes and cdnjs request are resolved. Internal destinations/fragments/assets resolve; no third-party request is observed on the site.

## Review findings and fixes

| Severity | Finding                                                                               | Fix / evidence                                                                                                     | Status                      |
| -------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| High     | R-1/R-7: obsolete README/package pins and missing release integrity                   | eb9b382, 698c274, caca0bf, 9aad245; real CDN and extracted snippets pass                                           | Resolved                    |
| High     | R-2: obsolete package name returned E404                                              | Maintainer clarified @qasimfida/accessibility-widget; 715bc03 aligns source, manifest and examples                 | Resolved                    |
| Medium   | R-3: historical phase-10-complete tag absent                                          | Disclosed at preflight and retained as a historical gap; no fabricated predecessor                                 | Not verified                |
| High     | R-4: Jekyll site, missing routes, violations and external script                      | Pages source corrected by maintainer; 9aad245 deployment and 45 live checks pass                                   | Resolved                    |
| High     | R-5: published 0.1.0 React runtime/types import old package                           | 715bc03, published 0.1.1; actual registry runtime/declaration/browser tests pass                                   | Resolved in 0.1.1           |
| Medium   | R-6: stale Vitest alias hid separate core instance                                    | ce18dc2; regression fails before and passes after                                                                  | Resolved                    |
| High     | R-9/R-13/R-16: text-node/parser first-frame scaling gaps                              | faa788a, d9ec36a, 90ef0c0, c4a4191; deterministic before/after regression plus unchanged CI/live first-frame tests | Resolved in 0.1.1           |
| Medium   | R-10/R-11/R-12: late Pages preflight, substituted CDN bytes, colliding test artifacts | d9c38bb, ad3c566, 13fe12a; checks remain mandatory and artifact roots separate                                     | Resolved                    |
| Medium   | R-14: hidden controls built during init                                               | 15e62c6; lazy controls retain current state, focus and cleanup; CI guards pass                                     | Resolved in 0.1.1           |
| Medium   | Earlier local focus-audit measurement / Firefox experiment crashes                    | Experimental test edits reverted; original rules retained; current CI and real public audits pass                  | Historical results retained |
| High     | Vercel forced-color hover contrast                                                    | b52f562 uses opaque Canvas pair; cross-browser hover contrast >=9.81:1                                             | Resolved                    |
| Blocker  | npm authentication / publishing two-factor challenge                                  | Maintainer completed fresh browser confirmation privately; accepted release and registry integrity verified        | Resolved                    |

All applied fixes retain their granular commits and original failed receipts. No gate, retry policy, runner, baseline or axe rule was weakened. The old 0.1.0 artifact remains immutable; use the corrected 0.1.1 pin.

## Audits

### Accessibility

Real CDN: twelve clean closed/open scans. Local site: 350 scans across 175 page/media cases. Live site: 70 scans. No violation rule was disabled; incomplete checks remain in the evidence and are supplemented by computed contrast.

The real-browser keyboard path covers skip link → main → demo → controls → change/reset → Escape/launcher → reverse navigation → Install/Options/FAQ/Home. Minimum authored-site text contrast **6.240363:1**, widget **6.820450:1**, hover **9.809976:1**. Site targets measure at least **43.1875px** under spacing overrides; widget targets at least **24px**. Focus indicators are at least 3px in the measured widget/pressed-state evidence. Real screen readers and physical devices were not tested; see the existing manual script and [UI report](ui-vercel-guidelines.md).

### Security and privacy

No runtime dependencies, new storage key, cookie, tracking call or unsafe DOM API. The site makes first-party requests only; CDN feature changes add no requests. Fresh registry installs disable lifecycle scripts. Both npm audit and npm audit --omit=dev report **zero vulnerabilities**; the 21 existing development dependencies remain unchanged. Workflow permissions remain least privilege and actionlint passes. No credential material was read, printed, committed or requested in chat. The user handled browser two-factor confirmation privately.

### Performance and size

Published IIFE: **58,089 raw / 19,734 gzip bytes**, below 35KB (warning at 30KB). Compared with immutable 0.1.0: +240 raw / +131 gzip bytes. Source-map raw attribution: wrapper/unmapped 615, entry 140, features 24,921, core 14,292, UI 18,121 bytes; attribution is approximate at minifier boundaries, and gzip is measured for the complete file. React entries are **393 bytes ESM / 847 bytes CJS** and retain one external core.

Current CI median/p95 init timings (ms), with unchanged 50% trend guards:

| Node | Chromium  | WebKit |
| ---- | --------- | ------ |
| 20   | 1.2 / 1.9 | 2 / 4  |
| 22   | 2.5 / 3.5 | 4 / 6  |

Raw warmups/samples and guard limits are in the receipt. These are shared-runner trend results, not absolute reference-machine qualification. The Mac is currently on battery; no fresh absolute benchmark is claimed or substituted for the unchanged reference method/baseline. The UI follow-up adds no fonts, assets or runtime layout-measurement JavaScript.

## Known limitations (honest)

- Historical phase-10-complete was not found; this tag/report does not claim prior-phase completion.
- No provenance attestation was used/advertised; registry signatures were not independently verified as provenance.
- Human NVDA/VoiceOver/TalkBack, physical-device/notch behavior and the broader cross-site limitations remain manual/integration checks.
- Original 0.1.0 retains its known defects; no deprecation or artifact replacement was performed.
- A new absolute reference-machine benchmark was not run on battery; existing baseline and CI guard remain unchanged.

## Deviations from the prompt (and why)

The maintainer corrected the original package name and later explicitly authorized publication, superseding the initial registry-read-only/human-publication restriction for this release only. User-managed browser authentication completed the write. The missing predecessor was disclosed; work continued at the maintainer's request. phase-11-complete is a rollback/review point for the verified current post-publish state only, with no fabricated historical tag. The Vercel UI follow-up was separately requested, implemented and documented.

## Handoff notes for the next phase

Use @qasimfida/accessibility-widget@0.1.1 or the exact pinned CDN/SRI shown above. No immediate release repair remains. Resolve historical milestone bookkeeping separately if needed. Run the manual screen-reader/physical-device scripts before making broader accessibility claims. Future publications retain the original human-only rule unless separately authorized.

### First 30 days maintenance plan

1. **Days 1–2:** monitor actual npm/CDN files and pinned SRI, install from the registry, verify live routes/keyboard/axe/network behavior, and retain release identity evidence.
2. **Weekly:** review dependency proposals and both npm audits; keep runtime dependencies at zero. Make granular updates with verify and relevant consumer/browser checks. Monitor CI timing against the unchanged baseline; do not inflate it to hide regressions.
3. **Within two business days of an issue:** reproduce the exact version, delivery method, browser and host styles. Prioritize security/privacy, page breakage, keyboard traps and cleanup failures. Request a minimal public reproduction, not private data or credentials.
4. **Versioning:** SemVer; compatible 0.x fixes use patch releases, intentional breaking API/behavior changes use minor releases with migrations. Never replace an immutable version. Pin new CDN URLs with their actual new SRI.
5. **By day 30:** complete human assistive-technology/device checks, review open limitations and regressions, update documentation/changelog and plan the next tested compatible release.

## Commit list

The requested predecessor tag is absent, so use the recorded attempt baseline 349134a rather than inventing a Phase 10 boundary. The closing report commit follows this list; phase-11-complete points to the final verified report state.

```text
eb9b382 docs(readme): replace the stale foundation-only description
84bdb60 docs(audit): record unavailable registry CDN and live-site checks
255198f docs(report): record blocked post-publish checks and maintenance
715bc03 fix(react): align self-imports with the published package name
ce18dc2 fix(react-tests): resolve renamed self-imports to the source core
698c274 docs(integrations): pin the release SRI and explain the React workaround
9486736 docs(audit): preserve published and patched package verification
bae7abf docs(audit): preserve the updated site browser matrix
6c0800d docs(report): record the verified release and required React patch
a552c76 test(site): retain first-frame diagnostics before assertions
04ab91f docs(audit): retain the remaining CI and live deployment failures
d9c38bb ci(pages): check publishing configuration before the build
faa788a fix(content): scale text filled into existing text nodes
ad3c566 test(site): preserve release SRI against actual CDN bytes
fb1b0c3 docs(release): disclose the published empty-text scaling issue
04a942e docs(audit): preserve the character-data failure and fix evidence
13fe12a test(browser): isolate runtime and site artifacts
192d69d docs(report): retain passing local checks and remaining blockers
d9ec36a fix(font-size): classify semantic blocks before parser text arrives
15e62c6 perf(panel): build feature controls only on first open
c4a4191 test(font-size): require scaled baselines on empty parser blocks
7e028ef docs(report): record build fixes and the remaining audit blocker
90ef0c0 fix(content): reconcile styles at the parser completion boundary
d6bb60e docs(report): confirm the parser fix and audited Pages deployment
047c9ac chore(release): prepare version 0.1.1
8d25cbc style(site): add clear hover and pressed action states
2d6cdcc style(site): improve heading wrapping and anchor clearance
d60236c style(site): keep page content inside device safe areas
752e13e feat(site): match browser theme colors to light and dark pages
d821766 fix(site): retain pressed feedback in forced colors
b52f562 fix(site): preserve forced-color hover text contrast
7722738 docs(report): record the Vercel UI review and browser evidence
caca0bf docs(readme): prepare the corrected 0.1.1 integration guide
785b614 docs(audit): confirm the Vercel UI deployment and live checks
fc65fc1 docs(report): record the verified release and two-factor blocker
9aad245 docs(integrations): pin the verified 0.1.1 release
```
