# Website — reference layout redesign

Status: PASS WITH NOTES
Date: 2026-11-20
Commit range: b648ac2 to the report commit; unnumbered design follow-up.

## Summary

Rebuilt the landing page around the supplied full-page reference rather than the previous rounded hero. The composition now has an announcement strip, compact white navigation on a warm background, a spacious centred hero, a layered product illustration, an integration strip, a three-panel introduction, blue callout, alternating split sections, feature disclosures, privacy section, free pricing, original FAQs and a dark multi-column footer.

The copy describes Accessiblit's actual 18 personalisation features. The illustration is original SVG, explicitly described as an illustration. No reference-company artwork, code, logos, testimonials, awards or claims are included.

## What changed (files and why)

- `site/index.html`: complete landing-page narrative and layout, actual local-build demo, native feature/FAQ disclosures, free plan and toolkit-only navigation.
- `site/src/campaign.css`: shared compact navigation, rectangular rounded actions and blue/navy palette, preserving appearance and system-colour tokens.
- `site/src/landing.css`, `landing-sections.css`, `landing-end.css`: responsive section layouts, product-led composition, dark appearance and forced-colour support. The CSS is split by purpose.
- `site/public/images/toolkit-preview.svg`: original local vector artwork of a sample reading site and representative widget controls. It is static artwork; the separately labelled demo runs the real widget.
- All six authored pages: light browser theme metadata matches the new white site background.
- `e2e/site/landing.spec.ts`: keyboard disclosure operation, all 18 visible catalogue entries when expanded, and axe on the expanded content.
- Persistence/browser tests: use a marked body-text paragraph and the current CTA label instead of depending on old marketing copy or the first decorative paragraph.

## Verification

- On main, initially clean; git pull --ff-only reported already up to date.
- npm run verify: passed lint/format, strict typecheck, 195 unit tests in 61 files, six performance-script tests, library build and Node SSR checks, size-limit, publint and attw. Core coverage: 98.63% lines and 97.96% branches.
- Closing npm run test:site -- --workers=2: **285 passed in 3.4 minutes**, zero retries and zero skipped tests. Chromium, Firefox, WebKit, iPhone and Pixel emulations; all six pages and seven appearance/layout profiles. All 210 page/profile cases have zero axe violations with the toolkit both closed and open; expanded catalogue/FAQ tests also pass.
- Minimum measured solid-text contrast: **6.045:1** on the site and **5.705:1** in the toolkit; minimum site action dimension **43.1875px**, widget **24px** (range input; buttons at least 44px). These exceed the unchanged gates. The separate keyboard disclosure tests cover native summary targets.
- All internal link, third-party network, metadata, keyboard and persisted-first-frame checks pass. Stable 16px content samples remain 19.2px at 120% scaling, including streamed and delayed text.
- npm run test:site-snippets: extracted all 11 installation snippets; Node16 and Bundler types passed; all 18 browser/snippet consumers passed, including real CDN/SRI and React/Next StrictMode cleanup. Five shell examples passed syntax checks.
- npm audit and npm audit --omit=dev: zero vulnerabilities; no dependency changes.
- Real Chromium keyboard review: demo opened, Escape restored launcher focus, FAQ disclosure opened and closed, and mobile width remained 390/390px without overflow.
- Raw [matrix/audit evidence](assets/reference-layout/checks.json) and [keyboard/network observations](assets/reference-layout/browser-review.json).

## Review findings and fixes

| Severity | Finding                                                                                            | Fix                                                                                                                                              | Status   |
| -------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| Medium   | R-1: announcement content was outside landmarks in the first browser run                           | `4d0707e`: named complementary landmark; tested in all seven home appearance profiles                                                            | Fixed    |
| Low      | R-2: browser theme metadata retained the previous background colour                                | `68dde17`: update all six authored pages                                                                                                         | Fixed    |
| Medium   | R-3: an integration caption used aria-label on a generic div, producing an axe incomplete          | `44a079e`: valid named group semantics; subsequent direct axe review shows this incomplete removed                                               | Fixed    |
| Medium   | R-4: old copy-based browser probes no longer identified the hero CTA or 16px body sample           | `cd44775`: explicit semantic sample marker and copy-independent parser split; all 30 affected cases passed without changing numerical assertions | Fixed    |
| Low      | R-5: final warm-hero refinement changed the homepage body colours after the shared metadata update | `b2f210c`: homepage-specific light and dark theme values; all five metadata cases passed                                                         | Fixed    |
| Low      | Decorative check mark produces an axe colour-contrast incomplete                                   | Checked: aria-hidden decoration beside the visible heading “Offer more choice”; meaning does not depend on that glyph                            | Reviewed |

The initial full matrix had 262 passes and 23 failures from R-4; it is not counted as a successful run. Its expected 19.2px values, first-frame sampling, 4.5:1 contrast, target size and forced-colour assertions remain unchanged. No retries or exclusions were added. A subsequent run passed 280 cases and found the five homepage metadata failures from R-5; those were corrected before the closing run.

## Audits

### Accessibility

The page has one h1, a main landmark, named navigation and announcement landmarks, a skip link and native links, buttons and disclosures. Images have dimensions and descriptive alternative text; purely decorative artwork is hidden from assistive technology. All content remains readable without JavaScript, while the demo explains its JavaScript requirement.

A real Chromium keyboard walkthrough used Tab from the skip link through announcement, brand, navigation, calls to action and the demo button. Enter opened the actual panel; Escape closed it and returned focus to the launcher. Space opened and closed the commercial-use FAQ. The five-project suite additionally exercises the full demo change/reset flow and page navigation. See [raw browser review](assets/reference-layout/browser-review.json).

The design adds no animation, autoplay, drag-only interaction, focus trap or fixed navigation. Native details preserve names, expanded states and keyboard behaviour. The static panel illustration is labelled as artwork and does not impersonate an interactive control.

[Desktop](assets/reference-layout/desktop.png), [hero](assets/reference-layout/hero.png), [mobile](assets/reference-layout/mobile.png), and [dark appearance](assets/reference-layout/dark.png) screenshots are committed. Desktop and mobile screenshots were visually inspected. Human screen-reader and physical-device testing are not claimed.

### Security and privacy

No runtime-library source, dependencies, credentials, cookies, storage keys or network behaviour changed. All new artwork is local and all new disclosure interactions are native HTML. No dynamic HTML injection, runtime fetches, remote fonts or reference-site assets were introduced. Source and privacy links are ordinary explicit user navigation. Both full and production-only npm audits report zero vulnerabilities.

### Performance and size

The IIFE remains 65,339 raw bytes and 21,807 gzip bytes, within the unchanged 35KB gate. The new SVG is 5,045 bytes and scales without a raster payload. A single local Chromium load sampled 99,267 encoded subresource bytes (excluding the HTML document and cache/protocol effects), with a load event at 51.3ms. These are local page observations, not an init benchmark or a production performance claim. No new absolute init result or baseline update is claimed for this website-only change.

## Known limitations

Reference-company AI, automated remediation, audits, monitoring, certification, legal protection, customer endorsements and commercial subscriptions are not features of this toolkit and are not represented as such. The page offers visitor personalisation and an MIT-licensed free toolkit. Site owners still need accessible foundations and testing.

The feature catalogue is expandable to preserve the reference's section rhythm without hiding the full specification. It remains available with JavaScript disabled. Dark and mobile layouts adapt the composition rather than forcing a desktop-sized screenshot onto a small viewport.

Axe incompletes require human interpretation; zero violations does not imply complete accessibility conformance. Screen readers and real devices remain a human handoff.

## Deviations from the prompt (and why)

“Exactly” is implemented as matching the reference's visual composition and section flow with original content and artwork. AGENTS.md §§1–2 prohibit misleading product claims and copying another widget's assets. Unsupported proof points and paid tiers are replaced by truthful integrations, privacy, accessibility responsibilities and free pricing. No runtime API or package publication is changed. This unnumbered follow-up does not invent or move a numbered phase tag.

## Handoff notes

After GitHub Pages deploys, review the home page at `/accessiblit/`, open the real demo and check the installation, options, pricing and FAQ links. Existing external CDN releases are independent of this website deployment.

## Commit list

- b2f210c fix(site): align home browser chrome with warm hero palette
- cd44775 test(site): decouple persistence probes from marketing copy
- 458bade style(site): refine navigation and hero surface continuity
- 44a079e fix(site): give integration labels valid group semantics
- 68dde17 fix(site): match browser theme colour to new page background
- 4d0707e fix(site): place announcement inside a named landmark
- 18933e9 style(site): rebuild landing around supplied reference layout
- 0745ef4 style(site): draw original toolkit product illustration
