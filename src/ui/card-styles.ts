/** Cards use native buttons and radios; the icon and selected outline supplement visible words. */
export const CARD_CSS = `
.accessiblit-group { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin:0 0 28px; }
.accessiblit-group h3 { grid-column:1/-1; margin:0 2px 4px; color:var(--ui-muted); font-size:13px; line-height:1.5; font-weight:650; }
.accessiblit-feature { grid-column:1/-1; display:grid; grid-template-columns:36px minmax(0,1fr); gap:0 12px; min-inline-size:0; padding:16px; border:1px solid var(--ui-quiet); border-radius:20px; background:var(--ui-bg); text-align:start; }
.accessiblit-feature h4 { grid-column:2; margin:0; font-size:16px; line-height:1.4; font-weight:500; }
.accessiblit-feature p,.accessiblit-empty { grid-column:2; margin:4px 0 0; color:var(--ui-muted); font-size:14px; line-height:1.5; }
.accessiblit-feature-icon { grid-column:1; grid-row:1/3; display:flex; align-items:center; justify-content:center; inline-size:36px; block-size:36px; border-radius:12px; background:var(--ui-quiet); color:var(--ui-accent); }
.accessiblit-feature-icon svg { display:block; inline-size:22px; block-size:22px; }
.accessiblit-feature:has(.accessiblit-toggle[aria-pressed=true]) { border-color:var(--ui-accent); box-shadow:inset 3px 0 0 var(--ui-accent); }
.accessiblit-feature .accessiblit-stepper,.accessiblit-feature .accessiblit-options,.accessiblit-feature .accessiblit-toggle { grid-column:2; margin-block-start:12px; }
.accessiblit-surface .accessiblit-toggle { display:flex; align-items:center; justify-content:space-between; gap:8px; inline-size:100%; border-radius:12px; font-size:14px; }
.accessiblit-badge { flex:none; border:1px solid var(--ui-border); border-radius:20px; padding:2px 8px; background:var(--ui-quiet); color:var(--ui-ink); font-size:13px; }
.accessiblit-toggle[aria-pressed=true] .accessiblit-badge { background:var(--ui-accent); color:var(--ui-accent-ink); border-color:var(--ui-accent); }
.accessiblit-value { min-inline-size:0; font-size:16px; font-weight:700; text-align:center; font-variant-numeric:tabular-nums; }
.accessiblit-stepper { inline-size:min(100%,220px); display:grid; grid-template-columns:44px minmax(0,1fr) 44px; align-items:center; gap:4px; }
.accessiblit-surface .accessiblit-step { display:flex; align-items:center; justify-content:center; inline-size:44px; block-size:44px; padding:0; border:1px solid var(--ui-accent-ink); border-radius:12px; color:var(--ui-accent-ink); background:var(--ui-accent); font-size:26px; line-height:1; }
.accessiblit-surface .accessiblit-step[aria-disabled=true] { border-color:var(--ui-border); }
.accessiblit-step-text { position:absolute; inline-size:1px; block-size:1px; overflow:hidden; clip-path:inset(50%); }
.accessiblit-options { display:flex; justify-content:flex-start; flex-wrap:wrap; gap:6px; }
.accessiblit-choice { display:flex; gap:6px; align-items:center; padding:8px 10px; min-block-size:44px; border:1px solid var(--ui-border); border-radius:12px; cursor:pointer; background:var(--ui-quiet); }
.accessiblit-choice:has(input:checked) { background:var(--ui-accent); color:var(--ui-accent-ink); border-color:var(--ui-accent-ink); }
.accessiblit-choice input { flex:none; inline-size:24px; block-size:24px; margin:0; accent-color:var(--ui-accent); }
.accessiblit-choice span { min-inline-size:0; font-size:14px; }
.accessiblit-surface .accessiblit-reset { inline-size:100%; border-radius:12px; font-weight:600; background:var(--ui-accent); color:var(--ui-accent-ink); border-color:var(--ui-accent-ink); }
.accessiblit-surface button,.accessiblit-choice input { scroll-margin:12px; touch-action:manipulation; }
@container (max-width:340px) { .accessiblit-feature .accessiblit-stepper,.accessiblit-feature .accessiblit-options,.accessiblit-feature .accessiblit-toggle { grid-column:1/-1; } }
@media (hover:hover) {
 .accessiblit-surface button:hover,.accessiblit-choice:hover { border-color:var(--ui-focus); box-shadow:inset 0 0 0 1px var(--ui-focus); }
}
@media (hover:hover) and (forced-colors:none) {
 .accessiblit-surface .accessiblit-reset:hover,.accessiblit-surface .accessiblit-step:not([aria-disabled=true]):hover { background:light-dark(#0038ac,#b8dcff); color:var(--ui-accent-ink); }
}
.accessiblit-binary-feature { grid-column:auto; grid-template-columns:1fr; gap:8px; padding:12px; text-align:center; }
.accessiblit-binary-feature .accessiblit-feature-icon { grid-column:1; grid-row:auto; margin-inline:auto; }
.accessiblit-binary-feature h4,.accessiblit-binary-feature p { grid-column:1; }
.accessiblit-binary-feature p { font-size:13px; }
.accessiblit-binary-feature .accessiblit-toggle { grid-column:1; margin-block-start:4px; justify-content:center; }
.accessiblit-surface .accessiblit-toggle[aria-pressed=true] { background:var(--ui-accent); color:var(--ui-accent-ink); border-color:var(--ui-accent); }
.accessiblit-toggle .accessiblit-badge { border:0; background:transparent; color:inherit; }
.accessiblit-feature:has(.accessiblit-toggle[aria-pressed=true]) .accessiblit-feature-icon { background:var(--ui-accent); color:var(--ui-accent-ink); }
.accessiblit-forced-colours-note,.accessiblit-empty { grid-column:1/-1; }
.accessiblit-surface .accessiblit-close { border-color:transparent; background:transparent; box-shadow:none; }
.accessiblit-surface .accessiblit-close:hover,.accessiblit-surface .accessiblit-close:focus { color:var(--ui-focus); border-color:transparent; }
@media(forced-colors:active) { .accessiblit-surface .accessiblit-toggle[aria-pressed=true] { background:Highlight; color:HighlightText; border-color:Highlight; } }
.accessiblit-binary-feature:has([aria-pressed=true]) { background:var(--ui-accent); color:var(--ui-accent-ink); }
.accessiblit-binary-feature:has([aria-pressed=true]) p { color:var(--ui-accent-ink); }
.accessiblit-binary-feature:has([aria-pressed=true]) .accessiblit-feature-icon { color:var(--ui-accent-ink); }
.accessiblit-toggle::after { content:""; inline-size:18px; block-size:18px; border-radius:50%; background:currentColor; box-shadow:-18px 0 0 -6px currentColor; }
.accessiblit-surface .accessiblit-binary-feature .accessiblit-toggle { justify-content:space-between; }
.accessiblit-choice input { appearance:none; border:1px solid currentColor; border-radius:50%; background:transparent; }
.accessiblit-choice input:checked::after { content:"✓"; display:block; text-align:center; line-height:22px; font-weight:700; }
.accessiblit-choice { position:relative; }
.accessiblit-choice input { position:absolute; opacity:0; }
.accessiblit-choice-icon { display:inline-flex; align-items:center; justify-content:center; inline-size:24px; block-size:24px; flex:none; }
.accessiblit-choice-icon svg { inline-size:22px; block-size:22px; }
.accessiblit-choice:has(input:checked) .accessiblit-choice-icon svg { display:none; }
.accessiblit-choice:has(input:checked) .accessiblit-choice-icon::after { content:"✓"; font-size:20px; font-weight:700; }
.accessiblit-choice:has(input:focus-visible) { outline:3px solid var(--ui-focus); outline-offset:3px; box-shadow:0 0 0 6px var(--ui-bg); }
.accessiblit-toggle::after { inline-size:34px; block-size:20px; border:1px solid currentColor; border-radius:20px; box-shadow:none; background:radial-gradient(circle at 9px 50%,currentColor 0 6px,transparent 7px); }
.accessiblit-toggle[aria-pressed=true]::after { background:radial-gradient(circle at 24px 50%,currentColor 0 6px,transparent 7px); }
.accessiblit-surface .accessiblit-toggle[aria-pressed=true] { border-color:var(--ui-accent-ink); }
.accessiblit-surface .accessiblit-close { border:0 solid var(--ui-focus); }
.accessiblit-surface .accessiblit-close:hover,.accessiblit-surface .accessiblit-close:focus { border-color:var(--ui-focus); }
@media(forced-colors:active) { .accessiblit-surface .accessiblit-toggle[aria-pressed=true] { border-color:HighlightText; } }
`;
