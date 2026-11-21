# Design follow-up — Inner pages and toolkit appearance

Status: PASS WITH NOTES
Date: 2026-11-21
Commit range: `3fb7baa..HEAD` for this unnumbered follow-up on `main`.

## Summary

Redesigned About, Documentation, Options, FAQ, Toolkit, Contact and Pricing with
an original editorial system inspired by the [About reference](https://accessibe.com/about).
The homepage composition stays intact. The hosted popup now follows its light
brand even under a dark OS; ordinary package embeds retain system-aware colours.
Pricing has one complete free MIT offering and the requested static Donate button.

The reference was visited and scrolled in a real Chromium browser. Its centred
50/60 px regular-weight hero, staggered mosaic, broad blue sections and dark
footer informed the composition. No reference code, photographs, icons or copy
were reused. Toolkit facts replace company/team/customer claims.

## What changed (files and why)

- `src/ui/launcher-styles.ts` and `card-styles.ts`: semantic light/dark tokens
  follow an optional host CSS property, `--accessiblit-color-scheme`. The site
  sets it to `light`; forced colours retain system priority. The JavaScript API,
  persistence schema, feature catalogue and deferred panel stylesheet are unchanged.
- `site/src/inner-*.css` and the eight inner HTML routes, including 404: shared
  centred heroes, breadcrumbs, tactile cards, generous spacing and a dark footer.
  New selectors are scoped away from the homepage composition.
- About: a five-tile product mosaic using 18 controls, zero runtime dependencies,
  the actual toolkit image and MIT licensing; original mission and maintainer copy.
- Documentation: a desktop sidebar, readable article column and mobile wrapping
  navigation. Short windows use normal document scrolling. End clearance keeps
  complete link labels and focus outlines visible in Firefox too. All 11 tested
  integration snippets and the 12-option API reference remain intact.
- FAQ: native keyboard disclosures; Privacy and Limitations stay open for deep links.
  Toolkit: an actual working demo invitation with an isolated preview image and
  registry-backed feature descriptions. Contact: real issue and email channels.
- Pricing: free toolkit details and a focusable `aria-disabled` Donate button.
  Its native hover title says “Donations coming soon. Accessiblit stays free.”
  A permanent description explains that no payment is collected. There is no URL,
  payment handler or custom tooltip. This follows the user's explicit clarification.
- `docs/design-system.md`: inner-page composition, host appearance and donation rules.
  Browser tests cover the appearance override, semantic group, preview bounds,
  short-window keyboard navigation and static donation behaviour.

## Verification (commands run, real results)

Start: `main`, clean, `git pull --ff-only` up to date at `3fb7baa`.
Local tools: Node 24.13.0, npm 11.6.2, git 2.54.0.
Fast lint, typecheck and the 46 UI unit tests passed before each commit.

| Command / run                                              | Real result                                                                                                                             |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run verify`                                           | Passed; lint, typecheck, 198 tests / 62 files, 7 performance-statistics tests, build, SSR checks, size, publint and attw                |
| Coverage                                                   | Core 98.63% lines, 98.19% statements and 97.96% branches; overall 95.56% statements, 91.15% branches, 96.31% lines                      |
| Broad site run, 485 cases                                  | 484 passed, 1 failed in 11.1 min; identified R-9, then fixed                                                                            |
| About/Installation/Pricing + regression recheck, 130 cases | 129 passed, 1 failed in 3.1 min; R-9 fixed, identified Firefox R-10                                                                     |
| Final inner-page regression run                            | 25 passed in 14.5 s across all five projects; R-10 fixed                                                                                |
| Final panel, layout, keyboard and CSP run                  | 98 passed, 2 existing skips in 1.7 min; CDP pinch zoom is Chromium-only                                                                 |
| `npm run test:site-snippets`                               | 11 extracted snippets; Node16/Bundler types; 18 browser executions across Chromium/Firefox/WebKit; React/Next StrictMode cleanup passed |
| `npm audit --omit=dev` and `npm audit`                     | Both zero vulnerabilities; no dependency changes                                                                                        |
| `git diff --check`                                         | Passed                                                                                                                                  |

An early site run was deliberately interrupted after screenshot review found R-5.
Initial popup test assumptions about forced-colour serialization were corrected
in R-3/R-4; the complete final popup run above passes. No retries, thresholds,
axe rules, coverage rules or CI performance baselines were relaxed.

The final state coverage combines the broad run with every affected page/profile
rechecked after review fixes. The last change only adds sidebar scroll clearance;
the final 25-case run verifies it in all five projects. See the
[verification receipt](assets/inner-pages/verification.json) and
[browser measurements](assets/inner-pages/browser-review.json).

## Review findings and fixes

| Severity | Finding                                                          | Fix                                                                 | Status |
| -------- | ---------------------------------------------------------------- | ------------------------------------------------------------------- | ------ |
| High     | R-1: white inherited link ink hid white CTA labels               | `510bb8e`: exclude button links; visible focus on blue              | Fixed  |
| Medium   | R-2: shared preview selectors could change the homepage          | `095be9c`: scope inner preview styling                              | Fixed  |
| Low      | R-3: Firefox computes forced colour-scheme as normal             | `3beefff`: assert effective system colours                          | Fixed  |
| Low      | R-4: Safari system colours depend on the probe's scheme          | `3ada4de`: compare matching colour schemes                          | Fixed  |
| High     | R-5: inherited absolute positioning overlapped the mobile header | `e72fa63`: distinct preview class and bounds tests                  | Fixed  |
| Medium   | R-6: a named generic div lacked a semantic role                  | `57d2449`: named group and role test                                | Fixed  |
| High     | R-7: sticky sidebar left focused links below a short viewport    | `46625f5`: bounded desktop rail and keyboard test                   | Fixed  |
| Medium   | R-8: bounded flex navigation wrapped into hidden columns         | `cb0bf90`: single column, short-window normal flow, focus clearance | Fixed  |
| Medium   | R-9: Firefox GrayText failed the unchanged 4.5:1 gate            | `ec62231`: CanvasText, preserving unavailable semantics             | Fixed  |
| Medium   | R-10: Gecko left a partly visible next link clipped              | `e3d638d`: four-rem end clearance; full bounds tests retained       | Fixed  |

Review used the local web-design-guidelines skill and freshly fetched
[Vercel guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md).
Sentence-case editorial copy follows this project's design system. No unresolved
Blocker, High or Medium finding remains from this review.

## Audits

### Accessibility

- Observed zero axe violations across the final 315 page/profile combinations:
  nine pages, seven profiles, five projects. Closed and open popup states checked.
  Profiles include light, dark, forced colours, reduced motion, RTL, 320×256 and
  increased text spacing. Axe still marks some colour-contrast checks incomplete;
  computed contrast checks complement those, without claiming complete conformance.
- Minimum site text contrast **6.045:1**, popup **7.259:1**, standalone popup
  boundary contrast **3.805:1**. Focus outline **3 px**. Minimum measured target
  **24×24 px**; primary popup actions remain 44 px or larger.
- Scripted keyboard walkthrough in real browsers: skip link → main → demo →
  Close → increase font size → reset → Escape → launcher; then Documentation,
  Toolkit, About, Contact, Pricing, FAQ and Home. All five projects passed.
  Sidebar testing tabs through all 11 methods at 1440×256 with full link and
  focus-outline clearance. The donation button is focusable, describes its
  availability and does nothing on Enter/Space. Native FAQ summaries toggle on Enter.
- Named dialog, launcher relationship, pressed/selected states, live announcements,
  logical focus order, no trap and focus return remain tested. The About facts now
  have a valid named group. No known confusing name/state remains from browser review.
- Native hover titles are user-agent UI; the donation explanation is also permanently
  visible and programmatically associated for keyboard/touch users.
- [About desktop](assets/inner-pages/about-desktop.png),
  [mobile toolkit](assets/inner-pages/toolkit-mobile.png),
  [light popup under dark OS](assets/inner-pages/popup-dark-os.png),
  [short-window keyboard focus](assets/inner-pages/docs-short-keyboard.png),
  [mobile pricing](assets/inner-pages/pricing-mobile.png).

### Security and privacy

No production network code, storage, cookies, payment integration, unsafe DOM API,
secret or dependency was added. All five site network checks found zero third-party
hosts, zero cookies and only `accessiblit:v1` storage; widget interactions added no
requests. Site fonts/images are existing first-party assets. Both npm audits are
clean. License and package metadata are unchanged. No registry mutation was run.

### Performance and size

IIFE: **66,262 raw bytes / 21,909 gzip bytes**, 9 gzip bytes smaller than the
previous follow-up and below the unchanged 35 KB budget. Common site CSS:
**90,766 raw / 11,573 gzip bytes**; site JS **14,522 raw / 5,356 gzip bytes**.
Local diagnostic document-load samples were **27.0–37.4 ms**; raw
measurements are in the browser receipt. These warm local loads are not a public
network benchmark. Standard CLS was **0** on all six redesigned primary routes
in the measured load/open/close flow. Images reserve dimensions and entrance
motion uses transforms; reduced motion and Stop animations take precedence.

No new absolute init-time result is claimed: this design task did not run the
AC-powered, other-apps-closed reference protocol. Deferred full panel CSS remains
intact. The committed CI baseline, 50% regression guard and 50 ms reference
threshold are unchanged; performance-statistics tests pass.

## Known limitations (honest)

Screen readers and physical mobile devices were not run. Human checks with NVDA,
VoiceOver and TalkBack remain necessary; emulation is not real-device evidence.
Axe and computed samples do not certify WCAG conformance. Donation collection is
intentionally unavailable. The new host CSS appearance property targets the
supported modern browsers; ordinary embeds remain OS-aware by default.

Read-only `npm view @widgets/accessibility version --json` returned E404 in this
session. The site uses this repository's local build. The existing pinned CDN
example uses the previous published package and explicitly says it lacks the
redesigned panel. A human must publish a new release before CDN/npm consumers get
these changes; AGENTS.md forbids agent publication.

## Deviations from the prompt (and why)

This is an unnumbered design follow-up: no existing phase-complete tag was moved
and no new phase number was invented. The homepage layout is preserved as stated
at the start. Original product facts/artwork replace the reference's company
photographs and claims. A visible availability note supplements the requested
hover label so touch and keyboard users receive the same information.

## Handoff notes for the next phase

Review the deployed About, Toolkit and Pricing pages and the popup under a dark
OS. Keep donation collection inactive until a real destination is supplied.
Run the existing manual screen-reader script on real devices. Publish the new
organization package manually when ready; preserve accurate CDN version/SRI copy.
CI/Pages deployment results will be recorded after pushing this verified chunk.

## Commit list

Implementation, fixes and evidence since `3fb7baa` (this report follows):

```text
6738654 fix(theme): let the demo popup follow its host colour scheme
488cbe5 docs(theme): explain host-controlled toolkit appearance
3bd0af2 style(pages): introduce the About-inspired inner-page shell
71d35c7 style(layout): apply the shared inner-page hero and footer
541a124 style(about): add an original product mosaic and mission sections
0e66e59 style(pricing): present the free toolkit and planned donations
9d1e9a1 test(pricing): guard the static donation placeholder
1909e35 style(docs): add a readable sidebar and article composition
7e5d0e0 style(faq): present answers as native keyboard disclosures
5648f65 style(toolkit): frame the live demo as a product showcase
95401f0 style(contact): give maintainer channels a clear editorial layout
d191620 docs(design): define the inner-page editorial system
510bb8e fix(pages): preserve button ink and focus on blue sections
095be9c fix(toolkit): scope preview styling to the toolkit route
3beefff test(theme): assert the effective forced-colour palette
3ada4de test(theme): resolve Safari system colours in the surface scheme
2bc3f3e docs(evidence): record inner-page and popup browser review
e72fa63 fix(toolkit): isolate the detail preview from hero positioning
2642038 docs(evidence): refresh the corrected toolkit preview captures
57d2449 fix(about): expose the product facts as a named group
46625f5 fix(docs): keep sidebar keyboard focus inside short viewports
cb0bf90 fix(docs): retain a single scrollable sidebar column
ec62231 fix(pricing): retain readable donation text in forced colours
5ecdc1d docs(evidence): record sidebar focus and layout stability
e3d638d fix(docs): reserve full-link focus clearance in Firefox
d3830a3 docs(evidence): record completed cross-browser validation
```
