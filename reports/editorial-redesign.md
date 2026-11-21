# Editorial website and toolkit redesign

Status: PASS WITH NOTES
Date: 2026-11-21
Commit range: 4a2f831 to closing report commit (see commit list below)

## Summary

Established “Quietly expressive” as the shared design direction: warm paper,
deep ink, electric blue, generous typography, fine borders, subtle radial texture
and layered product compositions. The supplied screenshot informs visual rhythm;
no reference code, copy, logos, awards, certifications or customer claims were
copied. Product copy continues to describe personalisation rather than automatic
accessibility remediation.

## What changed

- `docs/design-system.md` defines typography, spacing, surfaces, decorative shapes,
  motion, content and review rules. AGENTS.md §9 links this design contract.
- `site/src/editorial.css` applies shared editorial styling across all authored
  routes. Fine-pointer hover effects use transforms without changing layout.
- `site/src/motion.ts` progressively assembles product layers and cards on entry,
  and introduces document sections. Content starts visible and remains usable
  without animation or JavaScript. Reduced motion, forced colours, print,
  background tabs and Stop animations disable the enhancement. Focus cancels it.
- About, Contact and Toolkit pages provide real maintainer information, working
  issue/email links and a live local-build demo. Navigation and footer links
  connect these to Documentation, Pricing, FAQ and the options reference.
- The installation guide adds Vue, Angular 17+, WordPress and Shopify alongside
  the existing HTML, JavaScript/TypeScript, React and Next.js examples. It explains
  lifecycle cleanup and manual platform/theme integration honestly.
- The shadow-root toolkit uses softer paper surfaces, rounded cards, circular
  stepper buttons and a pill reset action. Native controls, labels, descriptions,
  keyboard semantics and the public API are retained.
- The page matrix covers all nine authored pages. Keyboard tests walk the new
  navigation; motion tests observe real browser animations and their cancellation.

## Verification

The full site matrix passed **435 tests in 5.8 minutes** across Chromium, Firefox, WebKit, emulated iPhone and Pixel. All nine pages passed the tested axe states with zero violations. After the final footer alignment and documentation-motion observation changes, **85 closing regressions passed in 1.3 minutes**, covering home appearance states, real motion, keyboard navigation, links and metadata. No retries or skipped tests were used.

- `npm run verify`: PASS, 197 unit tests in 62 files; six performance-script tests;
  build, SSR checks, lint, typecheck, publint and attw pass. Core coverage:
  98.63% lines, 97.96% branches.
- `npx playwright test e2e/panel-a11y.spec.ts e2e/panel-design.spec.ts --workers=2`:
  54 pass in 1.1 minutes, including Chromium/Firefox/WebKit and 320×256.
- `npm run test:site-snippets`: PASS. Extracted existing examples compile under
  Node16/Bundler resolution. Real CDN and local tarball examples run in all three
  browser engines; React/Next StrictMode creates and removes two instances.
- Additional fresh-tarball guide checks: Vue 3.5.46 SFC parse, compileScript and
  strict TypeScript pass; Angular 21.2.26 real framework types and strict
  TypeScript pass. These are compiler checks, not production platform deployments.
- Full and production-only npm audits: zero vulnerabilities. No dependencies or
  lockfile changes.

## Review findings and fixes

| Severity   | Finding                                                                                      | Fix                                                          | Status |
| ---------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ------ |
| Medium R-1 | `e2e/site/helpers.ts:11`: new pages appeared twice in the browser route matrix               | cb3c372 removes duplicate entries, retaining all nine routes | Fixed  |
| Low R-2    | `site/index.html:936`: added project links were outside the landing footer's content gutters | 65f399d aligns them with the shared wrapper                  | Fixed  |
| Low        | Initial motion observation covered marketing sections but did not prove documentation entry  | 6da0456 observes real documentation animations               | Fixed  |

No Blocker or High findings remain in the reviewed implementation. Gates and
thresholds remain unchanged.

## Audits

### Accessibility

The browser keyboard walkthrough traversed the skip link, brand, navigation and
page actions, opened the toolkit with Alt+A and closed with Escape. Launcher focus
returned on every inspected route. Raw paths and overflow checks are in
[browser-walk.json](assets/editorial-redesign/browser-walk.json).

Toolkit measurements: 24 px minimum native radio targets; normal buttons remain
44 px. Light text contrast is at least 6.799:1, focus ring 3 px with 7.321:1 contrast,
control boundary contrast at least 3.677:1. The conservative header-gradient bound
is 6.802:1. Automated axe colour-contrast incompletes on layered backgrounds are
retained and disclosed, rather than disabling rules or treating them as passes.

Static screenshots were captured with reduced motion to show resting states:
[landing](assets/editorial-redesign/landing.png),
[mobile](assets/editorial-redesign/mobile.png),
[About](assets/editorial-redesign/about.png),
[Contact](assets/editorial-redesign/contact.png),
[Toolkit page](assets/editorial-redesign/toolkit.png),
[documentation](assets/editorial-redesign/install.png),
[toolkit light](assets/editorial-redesign/panel-open.png),
[toolkit dark](assets/editorial-redesign/panel-dark.png) and
[toolkit mobile](assets/editorial-redesign/panel-mobile.png).

Site measurements across 315 page/profile results: minimum solid-text contrast **6.045:1**, minimum target **24 px**, zero axe violations with the panel open and closed. Gradient-related incomplete results are retained in [checks.json](assets/editorial-redesign/checks.json).

### Security and privacy

No runtime network behaviour, cookies, tracking, new storage or unsafe DOM APIs
were added to the widget. No remote assets or fonts were introduced. Existing
site media/font assets remain local. External issue/email links require visitor
action. Contact has no pretend form or data collection. No registry writes or
credential changes occurred.

### Performance and size

The IIFE is 65,869 raw bytes and **21,879 gzip bytes**, below the unchanged 35 KB
budget. Animations use compositor transforms, run once and release their fill
styles; there is no continuous scroll handler, looping effect or layout-reading
animation loop. Hover scale/lift changes appearance, not the layout footprint.
No new reference-machine init-time measurement is claimed for these cosmetic
changes.

Single local Chromium load samples with reduced motion and fresh contexts: landing: 271,790 resource bytes, load event 90.6 ms, observed layout shift 0; toolkit/: 169,185 resource bytes, load event 30.2 ms, observed layout shift 0; install/: 169,185 resource bytes, load event 37.4 ms, observed layout shift 0. Resource totals exclude HTML; these are local samples, not an internet benchmark or init-time gate. [Raw load data](assets/editorial-redesign/load-samples.json).

## Known limitations

- Human screen-reader testing and real physical devices remain unverified.
- WordPress and Shopify instructions were reviewed but not deployed into live
  platform accounts. Angular and Vue examples passed compiler checks, not a full
  framework application deployment.
- The organization package's existing unpublished warning is retained. The live
  demo uses the current local build; the historical pinned CDN example remains
  the previous release. The human handles npm publication.
- Motion is intentionally suppressed for people requesting reduced motion or
  forced colours; decorative assembly is never needed to understand the page.
- The site retains a single deep-linked installation guide rather than creating
  duplicate pages for each framework. The options reference remains separate.

## Deviations from the prompt

The design is original and uses the reference as art direction. The product has
no AI, paid service, certification or automatic-conformance promise. This is an
unnumbered follow-up, so no numbered phase completion tag is invented or moved.
GitHub Pages remains the requested hosting path; no new hosting service is added.

## Handoff notes

Review the deployed site and try the live toolkit after Pages finishes. Use the
existing manual screen-reader script for human assistive-technology validation.
Preserve the new design contract when adding documentation or features.

## Commit list

- 783e73c docs(design): define quietly expressive visual and motion rules
- 6f3dbcb style(site): establish tactile editorial surfaces and typography
- a5a3c90 feat(motion): assemble product layers and reveal document sections
- c38f2f1 feat(about): introduce the toolkit purpose and maintainer
- 751b5f6 feat(contact): provide real maintainer and issue channels
- 7735491 feat(toolkit): add a dedicated interactive product page
- 535a025 docs(integrations): explain Vue Angular and theme lifecycle setup
- f063431 feat(navigation): connect product company and framework documentation
- a7d8803 test(navigation): walk every new destination with the keyboard
- fecc6ec style(toolkit): refine paper surfaces and rounded control details
- cb3c372 fix(site-tests): remove duplicate authored routes
- 6da0456 test(motion): prove real documentation entry animations run
- 65f399d fix(site): align project footer links with page gutters
- 75f6188 docs(design): make the shared visual contract discoverable
