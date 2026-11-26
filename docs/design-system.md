# Design system — Reference-aligned product presentation

This is the visual and interaction contract for the Accessibility website and
shadow-root toolkit. Product truth and AGENTS.md accessibility/privacy gates take
precedence. The supplied reference informs space, rhythm and composition, never
copy, assets, certifications or compliance claims.

## Measured reference baseline

Inspect https://accessibe.com/accesswidget in a browser at 1440 × 1000 before
making visual changes. The 2026-11-21 inspection found a 50 px / 60 px regular
hero heading, 36 px section headings, 12 px action corners, navy #0a2540, blue
#0047d8 and warm-white hero surfaces. Use our local Manrope as an original
geometric alternative; do not download or copy proprietary font files or assets.

The marketing site intentionally keeps this light brand presentation even when
the OS requests dark appearance. The hosted demo pins its popup to the light brand with
`--accessiblit-color-scheme: light` on its host. Other package integrations
continue to follow the OS by default; the page Dark mode feature remains
available for visitor choice. Forced colours still override both. Browser metadata must match actual
page backgrounds in both OS appearances.

## Art direction

Use warm paper, deep ink and a deliberate electric-blue accent. Pair spacious,
balanced headlines with small editorial labels and generous reading measures.
Prefer asymmetric product compositions, fine rules and soft, tactile surfaces to
repeated generic cards. Use the existing locally hosted Manrope on the website;
the drop-in toolkit keeps its system font and makes no network requests.

- Light surfaces: paper #faf8f5, white, pale blue #e9f0fa.
- Text: existing ink/muted tokens; maintain measured AA contrast.
- Primary action: existing accessible blue; one dominant action per section.
- Shapes: framed browser surfaces and restrained outlined orbits. Use static, low-opacity dot textures and outlined abstract orbits at hero edges,
  keeping the reading area quiet and text on a measured opaque surface. Decorative layers
  are non-interactive and never the source of meaning.
- Radius: 24 px feature surfaces, 16 px document surfaces, 12 px action corners.
- Spacing: 8 px rhythm; 64–112 px desktop section padding, 40–64 px mobile.
- Layout: maximum 81.25 rem; 70 px desktop gutters at 1440 px; safe-area mobile
  gutters and 320 px reflow.
- Marketing surfaces remain light under either OS scheme to match the reference;
  ordinary toolkit integrations continue to honour the OS dark preference. Forced colours
  retain system palettes. Never place
  essential text on an unmeasured translucent surface.

## Motion language

Motion describes hierarchy: a wide product stack converges into a centred demonstration, related cards
settle into a grid and actions acknowledge hover. No looping ornaments, autoplay
carousels, cursor followers, scroll hijacking or animation-dependent content.

- Entry: content settles once over 650 ms and 20 px. Decorative hero layers
  converge over 1000 ms with up to 80 px travel on desktop; mobile travel is
  limited to 12 px to preserve caption clearance. The final state is static.
- Hover: fine pointers only; up to 3 px lift or 1.015 scale, 180–220 ms. Transform
  action surfaces rather than changing their dimensions. Selected journey cards
  use a single grid-layout update and a 450 ms FLIP transform; native selection
  buttons stay outside that moving grid. Keyboard selection settles immediately.
  Keep focus rings intact.
- All animation is transform/opacity only. Never transition all properties.
- Reduced motion, forced colours, print and the toolkit's Stop animations setting
  suppress motion. Preference changes cancel active effects immediately.
- Focus cancels motion; never move a control containing keyboard focus. Visible
  content, links and controls must work before JavaScript and without it.
- Apply motion progressively across authored pages, including documentation.
  Never delay the real toolkit's initialization to animate marketing content.

## Page and content system

Use a shared navigation and footer for Home, Toolkit, Documentation, About,
Contact and FAQ. Documentation retains deep links to installation,
options and framework sections. Contact offers real maintainer channels, never a
nonfunctional form. The home support section states that the toolkit is free under MIT without invented tiers.

Every framework guide must explain loading, initialization and lifecycle cleanup;
SSR frameworks initialize only in the browser. WordPress and Shopify instructions
must describe manual integration honestly rather than claiming a native plugin.
Keep existing published-package availability warnings accurate.

## Toolkit

Use the home page's #0a2540 ink, #0047d8 blue, #faf8f5 paper and white cards.
Use 12 px action corners, 20 px cards, a 24 px panel frame and regular-weight
heading typography. Keep the header flat rather than using a decorative gradient. Group labels,
visible descriptions and native controls remain central. Express selection with
words and states, not colour alone. Keep 44 px action targets, 24 px minimum radio
targets, open dialog semantics, no focus trap, and Escape focus return. Small
hover feedback may enhance controls, but the toolkit never depends on animation.
Do not transform the entire launcher or panel: positioning and focus protection
belong to the core lifecycle.

## Review gate

Audit every authored route with axe, keyboard, links, no third-party requests,
320 px reflow, dark mode, forced colours and reduced motion. Test motion
cancellation and final resting states. Report real bundle size, screenshot
results and remaining human screen-reader checks. Keep the core API unchanged.

## Inner-page editorial composition

The About reference (https://accessibe.com/about, inspected 21 November 2026)
provides composition cues, not reusable content or assets: centred 50/60 px
regular-weight desktop heroes, generous white space, a staggered mosaic,
broad blue story sections and a structured navy footer. Use original product
facts and locally owned toolkit images. Never invent customers, awards or team
photographs. Keep the existing home composition intact.

Inner pages omit breadcrumbs and share a centred hero, 24 px tactile surfaces and the
same footer. Documentation pairs a desktop contents rail with a readable article;
the rail becomes normal flow on smaller screens. FAQ answers use native details
and summary, with privacy and limitations expanded for direct links. Contact
provides real email and issue links. The former Pricing route is removed; optional support lives on the home page.
Its static Donate button is focusable, aria-disabled and described by a visible
“Donations coming soon” note; a native title provides the same hover message.
It must not navigate or imply that payment collection is available.

The hosted toolkit explicitly inherits the light brand through
`--accessiblit-color-scheme: light` on its host. Ordinary package embeds remain
system-aware; forced colours always retain operating-system priority. No new
JavaScript option or persisted appearance preference is introduced.

## Compact toolkit controls and hints

Binary features use two compact neutral cards per row with inset switches and a quiet header rule, with one visible name and
description. Switches have no repeated On/Off text: a moved knob, a changed track
colour and aria-pressed expose state. Selection must not repaint the whole card.
Keep action targets at least 44 px while reducing padding and icon sizes.
Cap the desktop popup at 400 × 680 px; smaller viewports still control its actual size.

Option lists remain native radio groups. Text alignment uses distinct icon-only
choices with accessible names and hover/focus hints. Cursor options preserve their
pointer artwork when selected; colour, a heavier stroke and a stronger boundary
supplement the checked state. Other option lists may use selected checkmarks.

The header uses 12 px padding and a centred, wrapping row of at most six frequent actions, selected
through registry metadata: Dark mode, High contrast, Reading guide, Reading mask, Stop animations and Focus
highlight. These are shortcuts to the same store, respect feature exclusions and
are prepared on first open. Names distinguish shortcuts from the full controls.

Close has no outline, border or hover frame. Its solid 3 px icon becomes blue on
hover/focus; contrast is measured for the painted icon rather than an absent ring.
Keep its 44 px hit area and preserve Escape focus return. Forced colours always
use the operating system palette.

Icon actions have persistent hover/focus hints, black with white text in light
mode and white with black text in dark mode. Forced colours use the system palette.
Hints occupy an owned sibling layer, stay inside the visible viewport and hide on
Escape, scroll or viewport changes. They add no runtime requests. Construct hint
DOM and CSS only after the first action receives pointer or keyboard attention.

The shared logo is editable through `src/ui/brand.ts`; see [branding](branding.md)
for synchronising website assets and real panel previews. Avoid independent logo
copies or mock panel illustrations that drift from the working widget.

## Public name and integration marks

The visible product name is **Accessibility**. Keep `Accessiblit`, package paths,
TypeScript symbols and the storage key stable for existing integrations. Use the
original editable layered mark in all site headers/footers, the popup, launcher,
favicon and social artwork. Integration marks are locally authored inline SVGs;
retain readable platform names and hide decorative paths from assistive technology.

The home support section offers a static Donate button with “Donations coming soon”
on hover and a visible explanation. It must not collect payments or navigate until
the maintainer supplies a destination. Do not advertise a separate Pricing page.

## Shared editorial components

All eight routes use one build-time footer partial: brand, toolkit, integration
links and project information. Framework links point to real install-guide
anchors, including React, Next.js, JavaScript, TypeScript, WordPress, Shopify,
Angular and Vue. No runtime request is needed to render shared content.

Toolkit, Documentation, Contact and FAQ heroes use the homepage's warm paper,
centred eyebrow, balanced regular-weight headline, generous reading measure and
blue action treatment. Documentation uses a clearly grouped contents rail,
numbered integration steps and distinct code surfaces without hiding content
behind JavaScript. FAQ and home share the same native disclosure component,
chevron, separator and answer spacing.

Use original outlined platform symbols in integration tiles, with visible names.
The brand mark is a compact layered stack with an open centre: three offset
planes express adaptable reading, colour and navigation choices. Its editable
source remains `src/ui/brand.ts`. Keep it distinct from platform trademarks.

Popup cards use compact 16 px surfaces, clear labels and descriptions, and an
inset switch dock. Only the switch track and knob change with binary state;
never recolour the entire card. Centre six registry-driven shortcuts in one
wrapping row. Keep every shortcut 44 px, so narrow widths wrap rather than
shrink targets or overflow. Native pressed states, focus visibility, tooltip
behaviour and forced-colour support remain mandatory.

## Navigation and scrolling

Remove breadcrumb rows beneath the header. Mobile navigation opens downward
from a native details/summary disclosure; the desktop navigation stays visible.
Only one navigation is exposed at each breakpoint. Escape closes the drawer and
returns focus to its summary; outside clicks and leaving the drawer close it
without stealing focus. Keep a scrollable drawer on short screens and no focus
trap. Native links and no-JavaScript navigation remain available.

Use native smooth document scrolling for fragment links when reduced motion,
forced colours and Stop animations do not prohibit it. Preserve URLs, history,
modified clicks and ordinary cross-document navigation; the latter has no scroll
journey to animate until the destination loads. Keep anchor clearance below the
sticky header. Entry motion extends to article sections, FAQ disclosures and
footer columns, without opacity-hidden content or nested moving surfaces.

Footer order is brand, Toolkit, Project, Integrations, Good to know. About,
Contact and Options reference appear only in Project, never as a trailing row.
On small screens the brand spans a compact two-column link grid; preserve at
least 24 px targets and readable labels. Hero eyebrows, headlines and ledes share
the same centre axis at every viewport size. Decorative textures/orbits are
static, non-interactive, clipped to their own section, and hidden in forced
colours and print.
