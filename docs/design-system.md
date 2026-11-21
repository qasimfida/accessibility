# Design system — Quietly expressive

This is the visual and interaction contract for the Accessiblit website and
shadow-root toolkit. Product truth and AGENTS.md accessibility/privacy gates take
precedence. The supplied reference informs space, rhythm and composition, never
copy, assets, certifications or compliance claims.

## Art direction

Use warm paper, deep ink and a deliberate electric-blue accent. Pair spacious,
balanced headlines with small editorial labels and generous reading measures.
Prefer asymmetric product compositions, fine rules and soft, tactile surfaces to
repeated generic cards. Use the existing locally hosted Manrope on the website;
the drop-in toolkit keeps its system font and makes no network requests.

- Light surfaces: paper #faf8f5, white, pale blue #e9f0fa.
- Text: existing ink/muted tokens; maintain measured AA contrast.
- Primary action: existing accessible blue; one dominant action per section.
- Shapes: subtle gridded texture, restrained radial light and outlined orbits.
  Decorative layers are CSS, non-interactive and never the source of meaning.
- Radius: 24 px feature surfaces, 16 px document surfaces, pill actions.
- Spacing: 8 px rhythm; 64–112 px desktop section padding, 40–64 px mobile.
- Layout: maximum 78 rem; retain safe-area gutters and 320 px reflow.
- Dark appearance and forced colours use existing semantic tokens. Never place
  essential text on an unmeasured translucent surface.

## Motion language

Motion describes hierarchy: a product stack gently assembles, related cards
settle into a grid and actions acknowledge hover. No looping ornaments, autoplay
carousels, cursor followers, scroll hijacking or animation-dependent content.

- Entry: once per element; 450–650 ms, up to 18 px translation and 2 degrees
  rotation on decorative/card surfaces. The final state is always static.
- Hover: fine pointers only; up to 3 px lift or 1.015 scale, 180–220 ms. Transform
  the surface rather than changing document dimensions. Keep focus rings intact.
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
