# Init performance — defer closed-panel CSS

Status: PASS WITH NOTES
Date: 2026-11-21
Range: 17a0969 → 118c20a (runtime fix), followed by this report commit.

## Summary

The supplied native macOS Node 20 run rejected Chromium's 2.65 ms median against
its unchanged 2.25 ms CI limit (1.5 × the committed 1.5 ms baseline). WebKit passed
at 2 ms. This is a real relative-guard rejection, not the earlier floating-point
boundary defect and not a failure of the reference Mac's absolute 50 ms gate.

Commit 118c20a removes avoidable work from closed initialization: the full panel
stylesheet is installed synchronously on first open instead of parsing it during
init. Both fresh native CI init-trend jobs passed with the original baselines,
runner and thresholds. No benchmark, sampling, comparison or CI gate changed.

## What changed (files and why)

- `src/ui/launcher-styles.ts`: shared launcher foundation, focus and system
  appearance remain available synchronously before the first paint.
- `src/ui/styles.ts`: full panel rules reuse that foundation.
- `src/ui/controller.ts`: first open installs the complete sheet before preparing
  and showing the dialog. Reopening retains it; destroy releases the same owner.
- `tests/ui/controller.test.ts`: proves panel CSS is absent at closed init, present
  on first open, retained on reopen and removed on destroy.
- Raw supplied failure, local diagnostics, presentation comparison and native CI
  status receipts are under [assets/init-css-performance](assets/init-css-performance/).

## Profiling evidence

Compared the baseline source da4f8da and current source in separate fresh browser
processes using the same 5,000-paragraph host, default options, five discarded
warm-ups and thirty measured init calls. A separate thirty-call instrumented pass
recorded stylesheet parsing, popover, computed-style and geometry calls. Wrapper
costs are diagnostic and are not used as benchmark samples.

Closed init parsed a 9,444-character UI sheet versus 5,649 at baseline. After the
fix it parses 3,036 characters, a 67.9% reduction from the failing source. The
full CSS remains ready before the panel becomes visible.

| Diagnostic engine | Before median / p95 | After median / p95 |
| ----------------- | ------------------- | ------------------ |
| Chromium          | 1.75 / 2.70 ms      | 0.65 / 2.40 ms     |
| WebKit            | 4 / 5 ms            | 1 / 2 ms           |

These are local diagnostics on Mac15,6 / M3 Pro / 18 GiB / macOS 27.2.1 / Node
24.13.0, on battery with other apps open. They are **not an official reference-Mac
gate pass**. Baseline-source controls also varied between batches: Chromium
1.65 → 1.40 ms and WebKit 4 → 2 ms. Do not interpret these separate batches as a
controlled causal estimate of the entire timing difference. The removed CSS work
is directly measured; fresh native CI supplies the regression verdict.

[Before data](assets/init-css-performance/before.json),
[after data](assets/init-css-performance/after-css.json).
The after diagnostic measured the working tree subsequently committed as 118c20a;
its recorded HEAD remains the pre-commit source and is explicitly annotated.

## Verification

- Native macOS CI run [44900220742](https://github.com/qasimfida/accessiblit/actions/runs/44900220742), source 118c20a:
  [Node 20 init trend](https://github.com/qasimfida/accessiblit/actions/runs/44900220742/job/136834357044)
  and [Node 22 init trend](https://github.com/qasimfida/accessiblit/actions/runs/44900220742/job/136834357207)
  both completed **successfully**. Both engines must pass for each job to succeed.
  [Status receipt](assets/init-css-performance/native-ci-status.json).
- `npm run verify`: passed; 198 unit tests in 62 files, seven performance-script
  tests, lint, typecheck, coverage, build, SSR checks, size, publint and attw.
  Core lines 98.63%, branches 97.96%.
- Panel accessibility/design: **54 passed in 41.4 seconds**, Chromium, Firefox,
  WebKit, light/dark, forced colours, reduced motion and 320×256.
- Panel interaction/layout/CSP: **41 passed in 18.4 seconds**, two existing
  capability skips for CDP pinch emulation in Firefox/WebKit. No new skips.
- Computed-style comparison against 17a0969: zero differences across all nine
  engine/appearance profiles, comparing launcher, panel and descendants' colour,
  backgrounds, fonts, display, padding, radius, borders and outline width.
  [Comparison receipt](assets/init-css-performance/style-equivalence.json).
- Full and production-only npm audits: zero vulnerabilities. No dependencies,
  lockfile, CI configuration, baseline or threshold changes.

## Review findings and fixes

| Severity   | Finding                                                      | Fix                                                                                 | Status                               |
| ---------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------ |
| Medium R-1 | Closed init pays for all panel CSS after the visual redesign | 118c20a defers panel rules until first open while keeping launcher styles immediate | Fixed; native Node 20/22 guards pass |

No Blocker or High findings remain for this fix. First-open installation happens
before showPopover, preserving styled presentation. Reopen avoids repeat parsing.

## Audits

- Accessibility: native semantics, first-open/reopen, Escape/focus return, keyboard,
  zoom, system appearance and CSP scenarios pass the relevant browser tests. No
  screen-reader or physical-device pass is claimed.
- Security/privacy: no network, new storage, credentials, unsafe DOM APIs or new
  dependencies. Existing nonce-capable stylesheet fallback is retained.
- Performance/size: IIFE 65,958 raw bytes, **21,921 gzip bytes**, below 35,000.
  Sampling remains five warm-ups plus thirty measurements, init only. The 50 ms
  absolute limit and 50% CI regression guard remain unchanged. No baseline refresh.
- Public API: no deviation. ESM/CJS SSR imports and lifecycle smoke checks pass.

## Known limitations

Native CI status proves the guard passed, but authenticated timing-log retrieval
was unavailable in this session. No new native median/p95 is invented or quoted.
The broader remote workflow was still running when the init jobs were checked;
this report does not claim every remote job passed. Local battery diagnostics do
not replace the existing official Mac reference receipt.

## Deviations from the prompt

None in the requested fix. This unnumbered correction does not create or move a
numbered phase-completion tag. No publication or credential operation occurred.

## Handoff notes

The runtime fix is pushed on main. Follow the linked CI run for the remaining
jobs and the normal Pages deployment. npm publication remains human-managed.

## Commit list

- 118c20a perf(ui): defer panel stylesheet parsing until first open

- ecf708a docs(report): record init optimization and native CI guard passes
