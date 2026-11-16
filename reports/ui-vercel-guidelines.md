# UI follow-up — Vercel web interface guidelines

Status: PASS WITH NOTES
Date: 2026-11-16, Asia/Karachi. UI commit range: 047c9ac..b52f562, followed by this report.

## Summary

Applied the explicitly selected Vercel Web Design Guidelines skill to the existing demo/documentation site. Added interaction feedback, balanced heading wrapping and anchor clearance, safe-area gutters, and matching browser theme declarations. Preserved the existing visual identity, native zoom, public labels, library API and accessibility gates. Two cross-browser issues found during the new interaction-state checks were fixed before pushing.

The skill was installed outside the repository at `/Users/dev/.codex/skills/web-design-guidelines/SKILL.md` and read completely. Review source: [Vercel Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md), fetched during this session. No third-party UI implementation, framework or asset was copied.

## What changed (files and why)

- `site/src/layout.css`: theme-aware hover/pressed feedback, balanced heading lines, linked-heading clearance and symmetric safe-area gutters.
- `site/src/media.css`: dark-mode hover palette and forced-colors feedback using the operating system's Canvas/CanvasText colors.
- All five site HTML files: preserve zoom with viewport-fit=cover and declare light/dark browser theme colors.
- `e2e/site/guidelines.spec.ts`: real anchor navigation, forced-color hover contrast and held-pointer feedback regressions.
- `e2e/site/metadata.spec.ts`: verify that exactly one active theme declaration matches the rendered page background in each scheme on every page.
- [Browser receipts](assets/ui-vercel-guidelines/browser-results.json), [visual checks](assets/ui-vercel-guidelines/visual-checks.json), and five original browser screenshots retain the evidence.

## Verification (commands run, real results)

- Before every commit: lint/Prettier, typecheck and six benchmark-tooling unit tests. Focused browser tests and site builds ran for the relevant changes.
- `npm run verify`: PASS; 190 units in 58 files, six benchmark self-tests, build/SSR, size, publint and attw. Overall line/branch coverage 96.15%/90.98%; core 98.63%/97.96%.
- `npm run test:site -- --workers=2`: **245 passed in 2.7 minutes**, zero retries/skips, Chromium/Firefox/WebKit/iPhone/Pixel. CI retains its existing worker count. Earlier 235/240-case runs passed before the final interaction regressions were added; the final 245-case receipt supersedes them.
- Fifteen focused guideline cases and five metadata cases pass across all projects.
- Real browser probe: twelve hover combinations across Chromium, Firefox and WebKit in both schemes, with and without forced colors. Minimum hover text contrast **9.809976:1**; targets at least 44px. Pressed feedback verified with the pointer held down.
- Narrow/RTL visual checks: no horizontal page overflow at 320px or with a modeled 64px symmetric gutter at 844px. Linked installation heading retains at least 15px clearance. Screenshots were opened and inspected.
- Both `npm audit` and `npm audit --omit=dev`: zero vulnerabilities. `actionlint`: PASS. No new dependencies.

## Review findings and fixes

| Severity | Finding                                                                                             | Fix                                                                                   | Status                       |
| -------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ---------------------------- |
| Medium   | site/src/layout.css:197 - action controls lack hover/pressed feedback                               | 8d25cbc; explicit theme-aware states                                                  | Fixed                        |
| Medium   | site/src/layout.css:107 - heading IDs lack anchor clearance; heading lines need balanced wrapping   | 2d6cdcc; heading rules and five-project navigation regression                         | Fixed                        |
| Medium   | site/src/layout.css:13 - gutters omit safe-area insets                                              | d60236c; larger physical inset plus the existing focus/text gutter, symmetric for RTL | Fixed; real hardware pending |
| Low      | site/index.html:42 and the other page heads - browser theme color absent                            | 752e13e; media-qualified metadata and rendered-color checks                           | Fixed                        |
| Medium   | site/src/media.css:47 - forced colors removes the pressed box shadow                                | d821766; an inset outline preserves feedback without layout change                    | Fixed                        |
| High     | site/src/media.css:32 - Firefox Highlight/HighlightText gives white on rgb(51,153,255), below 4.5:1 | b52f562; reverse the opaque OS Canvas pair and check hover contrast in both schemes   | Fixed                        |

The first diagnostic probe exposed the removed shadow; the next exposed the Firefox contrast problem. These were distinct defects, corrected in separate commits. Neither the contrast threshold nor an axe/focus rule was relaxed. Final hover measurements use opaque colors; no alpha-containing Highlight background is treated as opaque.

## Audits

### Accessibility

All 175 page/media cases pass closed/open axe scans (**350 scans, zero violations**). Incomplete results remain in the raw receipt, supplemented by computed contrast checks. Minimum authored-site text contrast is **6.240363:1**, widget **6.820450:1**. Minimum authored target is **43.1875px** under spacing overrides (above the unchanged 24px gate); widget minimum is **24px**.

The existing browser keyboard walk passes in all five projects: skip to main, open the demo, move through controls, change font size, reset, Escape/focus return, reverse navigation and visit Install/Options/FAQ/Home. Horizontal options-table navigation passes in LTR and RTL. Headings, labels and focus indicators remain intact. The forced-color pressed outline is 3px and does not affect geometry.

### Security and privacy

No runtime requests, cookies, new storage, credential operations, unsafe DOM APIs or dependencies were introduced. Site request/link checks pass. Skill installation and guideline retrieval are development tooling only. No library runtime source changed. The pre-existing 0.1.1 metadata preparation commit is preserved; this UI work does not claim it has been published.

### Performance and size

IIFE remains **58,089 raw / 19,734 gzip bytes**, under 35KB and identical to the pre-review library build. Site CSS is **9,982 raw / 2,128 gzip bytes**; site JavaScript **1,167 raw / 631 gzip bytes**. No additional fonts, images, animations or layout-measurement JavaScript were added. No new absolute init-time measurement is claimed. Hover/pressed effects do not change control dimensions.

## Known limitations (honest)

- Notch behavior was modeled with a CSS gutter override; a physical notched device was not tested.
- Browser chrome metadata was compared with rendered backgrounds; actual mobile browser chrome presentation is not visible in headless screenshots.
- No human screen reader, physical touch device or translated-page session was tested.
- The operating system still owns forced-color appearance; the checks cover the installed browser implementations.

## Deviations from the prompt (and why)

Used the chosen Vercel review skill, not a redesign generator. Existing sentence-case public labels and code literals remain intact. No remote-font preload or third-party preconnect was added because the project uses local/system assets and forbids runtime network dependencies. Native touch/zoom behavior is preserved. This is a UI follow-up, not completion of the still-pending npm publication phase; no numbered phase-complete tag is fabricated.

## Handoff notes for the next phase

The skill is installed for future turns. Review the [light hover](assets/ui-vercel-guidelines/home-hover-light.png), [dark narrow page](assets/ui-vercel-guidelines/home-dark-320.png), [anchor landing](assets/ui-vercel-guidelines/install-anchor-320.png), and [modeled RTL gutter](assets/ui-vercel-guidelines/modeled-safe-gutter-rtl.png). Repeat physical-device and screen-reader checks with the existing manual scripts. Resume the separately authorized release only after its package/consumer gates pass.
