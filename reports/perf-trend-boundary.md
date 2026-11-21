# Init trend — inclusive boundary correction

Status: PASS WITH NOTES
Date: 2026-11-21
Commit: c7d4d90 (fix); follow-up report commit.

## Summary

The maintainer supplied the missing Node 20 CI output from source `1bdc0ce`. Chromium reported a median of 2.250000000014552 ms against a 2.25 ms inclusive limit. The excess was 0.000000000014552 ms. WebKit passed at 2 ms (limit 4.5 ms). This was a numerical comparison defect, not evidence of an init duration above the reference machine's 50 ms limit.

## What changed

`scripts/perf/statistics.mjs` compares current and limit values at nine decimal places in milliseconds (one picosecond), below browser timer resolution. Raw samples, raw medians, p95, baseline files, the 50% multiplier and the absolute 50 ms gate are unchanged. No runtime, UI, dependency or CI configuration changed.

`tests/perf/statistics.test.mjs` guards the supplied boundary, and proves 2.25000001 ms, 2.2501 ms and 2.3 ms still fail against 1.5 ms. Existing exact-boundary and invalid-baseline checks remain.

## Verification

- `npm run lint`, `npm run typecheck`: passed before the fix commit.
- `npm run test:perf`: 7 tests passed, 0 skipped.
- `npm run verify`: passed, including 197 unit tests, coverage, build, SSR, package formats/types and size checks. IIFE gzip remains 21,863 bytes against 35,000 bytes.
- Replayed all 30 samples per engine from the maintainer's output: Chromium median 2.250000000014552 ms / p95 4 ms / corrected guard PASS; WebKit median 2 ms / p95 5 ms / guard PASS.
- Raw replay input: [timing-boundary.json](assets/white-gradient/timing-boundary.json). This is supplied CI evidence, not a new local benchmark.
- Fresh CI [44880327368](https://github.com/qasimfida/accessiblit/actions/runs/44880327368) was triggered by pushing `c7d4d90` and was queued when checked; its result must be checked separately. A future measured regression still fails the unchanged guard.

## Review findings and fixes

| Severity | Finding                                                        | Fix                                                 | Status                                      |
| -------- | -------------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------- |
| Medium   | R-1: timestamp subtraction noise rejects an inclusive boundary | c7d4d90: comparison precision plus regression tests | Fixed; supplied samples replay successfully |

## Audits

- Accessibility: no DOM, UI, CSS, keyboard or semantics changed; no new browser accessibility pass claimed in this follow-up.
- Security/privacy: no network, storage, credentials, unsafe DOM or dependency changes. Test runner and comparison helper only.
- Performance/size: no runtime code changed; no new official Mac benchmark claimed. Raw CI values preserved. No baseline replacement or timing threshold increase.

## Known limitations and handoff

Shared CI can still produce a real regression on another run. Do not retry away a genuine excess or replace the baseline to hide it. No phase tag is created for this unnumbered correction. npm publication remains human-managed. The GitHub log connector was still unavailable during the retry; the maintainer-provided output supplied the diagnosis.
