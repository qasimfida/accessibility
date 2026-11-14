# Phase 11 — Post-publish verification

Status: BLOCKED
Date: 2026-11-14 (Asia/Karachi). Attempt baseline: `349134a`; the requested previous tag `phase-10-complete` does not exist locally or on origin.

## Summary

The public release described in the prompt could not be verified. The configured package, `@qasimfida/accessiblit`, returns HTTP 404/E404 from the public npm registry. Both CDN discovery URLs return HTTP 404 with plain-text error responses. No published version, tarball, license declaration, dist-tags or provenance attestation is available to validate. A fresh temporary registry installation also failed with E404.

The live GitHub Pages URL serves an older Jekyll page, not the Vite demo: no widget is mounted, three documentation routes return 404, and the custom error-page URL returned 503 during this session. Its axe and network results do not pass. No completion tag is created for a blocked phase.

## What changed (files and why)

- `README.md`: corrected the obsolete statement that no widget features are implemented. The repository contains the eighteen-feature implementation; its accessibility limitations remain explicit. Commit `eb9b382`.
- `reports/assets/phase-11/public-checks.json`: preserved public registry/CDN statuses, fresh-install failure, all live-page axe results, request URLs and checked internal links. Commit `84bdb60`.
- This report records the actual failure boundaries and a first-month maintenance plan. No runtime source, dependency, version, token, registry data or site source changed.

A version-pinned release snippet and SRI could not be safely added to README/site: there is no published version or served JavaScript artifact to pin and hash. Existing development-only site examples were not relabelled as a verified release. The exact published package name/version and release tag/URL have been requested from the maintainer.

## Verification (commands run, real results)

### Repository and tools

- Read AGENTS.md in full, including continuous section 10 commit rules.
- Branch: `main`; initial working tree clean; `git pull --ff-only`: `Already up to date.`
- `git tag --list phase-10-complete` and `git ls-remote --tags origin 'refs/tags/phase-10-complete*' 'refs/tags/v*'`: no matching tags.
- Checkout package version: `0.0.0`. Tools: Node `v24.13.0`, npm `11.6.2`, git `2.54.0 (Apple Git-157)`.
- Fast checks before each commit: lint, typecheck and six benchmark self-tests.
- `npm run verify`: PASS in this session. Lint, strict typecheck, 184 unit tests in 58 files, six benchmark self-tests, ESM/CJS/IIFE/types build, SSR import checks, size-limit, publint and attw passed. Core line/branch coverage: 98.63%/97.96%; overall lines/branches: 96.12%/90.71%. Historical Phase 7/8 results are not substituted for these commands.

### Registry, files, provenance and consumer installation

`npm view @qasimfida/accessiblit version dist-tags files license dist --json` exited 1 with `E404`, from `https://registry.npmjs.org/@qasimfida%2faccessiblit`. A separate direct public HTTP read returned 404. This proves public unavailability at the time of the checks, not that the package could not exist privately or under a different name.

A fresh folder with a private throwaway `package.json` ran:

```sh
npm install --ignore-scripts --no-audit --no-fund --registry=https://registry.npmjs.org @qasimfida/accessiblit
```

It exited 1 with E404. The folder path and exact safe errors are in the evidence JSON. TypeScript, ESM, CJS and React consumer execution is **not run**, because no registry artifact could be installed. A local tarball was not substituted for the requested registry package. Public version, dist-tags, tarball files, registry license and provenance are **not verified**; absent metadata is not evidence that an available artifact lacks provenance.

No `npm publish`, login, token, deprecate or unpublish command was run. No token or credential file was read or changed.

### CDN and SRI

| Endpoint                                                                      | HTTP result | Content type                | Artifact/SRI result |
| ----------------------------------------------------------------------------- | ----------- | --------------------------- | ------------------- |
| `https://unpkg.com/@qasimfida/accessiblit/dist/accessiblit.min.js`            | 404         | `text/plain;charset=UTF-8`  | No IIFE to compare  |
| `https://cdn.jsdelivr.net/npm/@qasimfida/accessiblit/dist/accessiblit.min.js` | 404         | `text/plain; charset=utf-8` | No IIFE to compare  |

These are discovery URLs, not invented version-pinned release URLs: npm supplied no version. Error text was not hashed and presented as JavaScript SRI. A real CDN-backed HTML consumer is **not run** because these URLs do not serve the package. A freshly built local SRI, if recorded below, is local diagnostic evidence only and cannot certify a missing CDN artifact.

### Live site: actual Chromium browser

Opened all five intended URLs in Chromium `158.0.8127.18` through Playwright, with no response interception or substituted local build. Ran the default axe rules without exclusions on each returned document.

| Path under `/accessiblit/` | HTTP | Returned page                | Axe rule violations |
| -------------------------- | ---- | ---------------------------- | ------------------- |
| Home                       | 200  | `Accessiblit \| accessiblit` | 3                   |
| `install/`                 | 404  | GitHub Pages default error   | 6                   |
| `options/`                 | 404  | GitHub Pages default error   | 6                   |
| `faq/`                     | 404  | GitHub Pages default error   | 6                   |
| `404.html`                 | 503  | GitHub service-error page    | 7                   |

The 503 is an observed response, not a claim that the URL always returns 503. Error-page violations belong to the external response actually received, not to the local Vite implementation.

The home violations are `landmark-one-main`, `link-in-text-block`, and `region`. The raw receipt retains every rule ID, impact, node target and incomplete result for all pages. Each page has zero `[data-accessiblit-host]` elements. Widget-open/closed axe cannot be claimed because the deployed page does not contain the widget.

Recorded seven page/asset requests. One was third-party: `https://cdnjs.cloudflare.com/ajax/libs/anchor-js/4.1.0/anchor.min.js`. Therefore the live no-third-party check **fails**; the request comes from the old Jekyll site, not a demonstrated widget runtime call. Two discovered same-origin link destinations were checked: the project home returned 200 and `https://qasimfida.github.io/` returned 404. The three expected documentation routes also failed their explicit route checks. There is no passing live link-check verdict.

## Review findings and fixes

| Severity | Finding                                                                                                  | Fix or required resolution                                                                                                      | Status |
| -------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------ |
| High     | R-1: README falsely said widget features were not implemented                                            | `eb9b382`: replace the stale foundation-only description and retain honest conformance wording                                  | Fixed  |
| Blocker  | R-2: configured package is unavailable publicly; CDN and registry consumers cannot run                   | Maintainer must supply the exact published package/version or correct the publication independently                             | Open   |
| Blocker  | R-3: required Phase 10/release tag is absent on origin                                                   | Maintainer must identify the correct repository/tag; no fabricated predecessor or completion tag                                | Open   |
| High     | R-4: live Pages deployment is the old site, with missing routes, axe violations and a third-party script | Resolve earlier deployment prerequisites; deploy the actual audited Vite output using GitHub Actions and repeat the live checks | Open   |

No source workaround, suppressed axe rule, loosened gate or retry was used to turn these failures into passes. Registry lookup, independent HTTP confirmation and fresh installation all failed; repeating the same unavailable-package checks would not create a release artifact.

## Audits

### Accessibility

The live axe results above are failures. A separate keyboard-only browser walk used four Tab presses: project-title link → “Improve this page” → document body → project-title link. Alt+A exposed no launcher; widget host and launcher counts remained zero. The two observed focused link boxes were 156.046875×38px and 129.203125×18px; the latter is an inline footer link. Browser-provided focused-link outlines were 1px `auto` with 1px offset. These are measurements of the old deployed page, not widget target/focus evidence. Computed widget contrast and widget keyboard operation remain **not verified** because no widget is present. No screen reader or physical mobile device was used.

### Security and privacy

Registry and CDN access was read-only. The throwaway install disabled lifecycle scripts. No credentials, token operations, runtime network code, runtime dependencies, cookies or storage mechanisms were introduced. The existing 21 development dependencies and package lockfile are unchanged. The public site's observed cdnjs request is explicitly retained as a failed privacy/network check. `npm audit --json` and `npm audit --omit=dev --json` each reported zero vulnerabilities of every severity in this session. Workflow permissions are unchanged; `actionlint` also passed.

### Performance and size

No runtime source changed. Fresh local build: IIFE **57,849 bytes raw / 19,603 bytes gzip**, below the unchanged 35,000-byte limit. `node scripts/sri.mjs` produced `sha384-16q5Bwqwx+EGwUWGN1IpmuUfkCwMctpxWVZg84pmiOw3FRectQlkJ9Q4RW30QS7M`. This certifies only the freshly built local bytes, **not a published release or CDN response**, and was not inserted into a purported release snippet. Coverage is recorded above. No historical timing is relabelled as a fresh benchmark.

## Known limitations (honest)

- Published package/version, public tarball contents, registry license, dist-tags and provenance: unavailable/not verified.
- Registry-installed TypeScript/ESM/CJS/React consumers and real CDN HTML integration: blocked, not executed.
- Correct live Vite deployment and widget accessibility/network behavior: not verified; the observed old deployment fails.
- No screen-reader, physical-device or new absolute performance qualification was performed.

## Deviations from the prompt (and why)

The release premise and required previous tag do not match the public registry and configured repository. Version-pinned snippets and release SRI were withheld rather than invented. The complete consumer/live-widget checks and `phase-11-complete` tag are withheld until a real published artifact and correct deployment are available. The useful independent README correction and failure evidence are committed separately, following section 10.

## Handoff notes for the next phase

Supply the exact public package name/version and release/tag URL. For Pages, select **Settings → Pages → Build and deployment → Source: GitHub Actions**, resolve any remaining mandatory CI failure and deploy the actual `site/dist` output. Repository administration and npm publication remain maintainer actions. After those changes, rerun registry metadata/attestation and tarball inspection, hash the version-pinned bytes from both CDNs against `scripts/sri.mjs`, install that exact registry version in fresh consumers, then repeat live axe/link/network and keyboard checks. Do not approve a completion tag while these checks fail.

### First 30 days maintenance plan

1. **Days 1–2 after a verifiable release:** confirm npm metadata, exact-version installation, public files, optional provenance and both pinned CDN files/SRI; verify Pages routes, widget keyboard behavior, axe and first-party-only assets. Record the actual release hash/version.
2. **Every week:** review dependency-update proposals and npm audit output; update development dependencies in granular commits with verify and relevant consumer/browser checks. Keep runtime dependencies at zero and all existing gates unchanged. Review CI timing failures against retained baseline evidence; do not inflate the baseline to hide a regression.
3. **Issue triage within two business days:** reproduce against the reporter's exact version, browser, host-page styles and integration. Prioritize security/privacy, tenant-independent host-page breakage, keyboard traps and data/lifecycle residue. Avoid asking for private page data or credentials; use a minimal public reproduction.
4. **Versioning:** follow SemVer. For the 0.x line, use patches for compatible bug fixes and minor versions for intentionally breaking API/behavior changes, documenting migrations. Never replace a published artifact or reuse its version; only the maintainer publishes. Preserve pinned CDN URLs and provide new SRI for each new artifact.
5. **By day 30:** review unresolved limitations and regressions, execute the human screen-reader/device scripts, update the changelog and prioritize the next compatible fixes. Keep claims limited to observed tests; publish a patch only through the reviewed human release process.

## Attempt commit list

The required preceding phase tag is missing. These commits are relative to the checked-out attempt baseline `349134a`, not a fabricated Phase 10 boundary:

```text
eb9b382 docs(readme): replace the stale foundation-only description
84bdb60 docs(audit): record unavailable registry CDN and live-site checks
```
