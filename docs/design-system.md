# Design system — Reference-aligned product presentation

This is the visual and interaction contract for the Accessiblit website and
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
the OS requests dark appearance. The independently themed toolkit continues to
honour prefers-color-scheme; its Dark mode feature remains available for visitor
choice. Forced colours still override both. Browser metadata must match actual
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
- Shapes: framed browser surfaces and restrained outlined orbits. Keep the hero
  background flat rather than adding grain or an ambient glow. Decorative layers
  are non-interactive and never the source of meaning.
- Radius: 24 px feature surfaces, 16 px document surfaces, 12 px action corners.
- Spacing: 8 px rhythm; 64–112 px desktop section padding, 40–64 px mobile.
- Layout: maximum 81.25 rem; 70 px desktop gutters at 1440 px; safe-area mobile
  gutters and 320 px reflow.
- Marketing surfaces remain light under either OS scheme to match the reference;
  the toolkit itself continues to honour the OS dark preference. Forced colours
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
Contact, Pricing and FAQ. Documentation retains deep links to installation,
options and framework sections. Contact offers real maintainer channels, never a
nonfunctional form. Pricing clearly says free under MIT without invented tiers.

Every framework guide must explain loading, initialization and lifecycle cleanup;
SSR frameworks initialize only in the browser. WordPress and Shopify instructions
must describe manual integration honestly rather than claiming a native plugin.
Keep existing published-package availability warnings accurate.

## Toolkit

Use the same ink, paper, blue, fine borders and rounded surfaces. Group labels,
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
