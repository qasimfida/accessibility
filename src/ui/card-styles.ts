/** Cards use native buttons and radios; the icon and selected outline supplement visible words. */
export const CARD_CSS = `
.accessiblit-group { display:grid; grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr)); gap:12px; margin:0 0 24px; }
.accessiblit-group h3 { grid-column:1/-1; margin:0 4px 2px; font-size:17px; line-height:1.5; font-weight:700; }
.accessiblit-feature { min-inline-size:0; padding:20px 12px; border:1px solid transparent; border-radius:24px; background:var(--ui-bg); box-shadow:0 2px 8px #1226380d; text-align:center; }
.accessiblit-feature h4 { margin:12px 0 4px; font-size:17px; line-height:1.4; font-weight:650; }
.accessiblit-feature p,.accessiblit-empty { margin:4px 0 14px; color:var(--ui-muted); font-size:13px; line-height:1.5; }
.accessiblit-feature-icon { display:flex; align-items:center; justify-content:center; margin-inline:auto; inline-size:56px; block-size:56px; border-radius:50%; background:var(--ui-quiet); color:var(--ui-ink); }
.accessiblit-feature-icon svg { display:block; }
.accessiblit-feature:has(.accessiblit-options) { grid-column:1/-1; }
.accessiblit-feature:has(.accessiblit-toggle[aria-pressed=true]) { border-color:var(--ui-accent); box-shadow:inset 0 0 0 2px var(--ui-accent); }
.accessiblit-surface .accessiblit-toggle { display:flex; align-items:center; justify-content:center; gap:8px; inline-size:100%; border-radius:16px; }
.accessiblit-badge { flex:none; border:1px solid var(--ui-border); border-radius:20px; padding:2px 8px; background:var(--ui-quiet); color:var(--ui-ink); font-size:13px; }
.accessiblit-toggle[aria-pressed=true] .accessiblit-badge { background:var(--ui-accent); color:var(--ui-accent-ink); border-color:var(--ui-accent); }
.accessiblit-value { min-inline-size:0; font-size:16px; font-weight:700; text-align:center; font-variant-numeric:tabular-nums; }
.accessiblit-stepper { display:grid; grid-template-columns:44px minmax(0,1fr) 44px; align-items:center; gap:4px; }
.accessiblit-surface .accessiblit-step { display:flex; align-items:center; justify-content:center; inline-size:44px; block-size:44px; padding:0; border:1px solid var(--ui-accent-ink); border-radius:50%; color:var(--ui-accent-ink); background:var(--ui-accent); font-size:26px; line-height:1; }
.accessiblit-step-text { position:absolute; inline-size:1px; block-size:1px; overflow:hidden; clip-path:inset(50%); }
.accessiblit-options { display:flex; justify-content:center; flex-wrap:wrap; gap:6px; }
.accessiblit-choice { display:flex; gap:6px; align-items:center; padding:8px 10px; min-block-size:44px; border:1px solid var(--ui-border); border-radius:12px; cursor:pointer; background:var(--ui-quiet); }
.accessiblit-choice:has(input:checked) { background:var(--ui-accent); color:var(--ui-accent-ink); border-color:var(--ui-accent-ink); }
.accessiblit-choice input { flex:none; inline-size:24px; block-size:24px; margin:0; accent-color:var(--ui-accent); }
.accessiblit-choice span { min-inline-size:0; font-size:14px; }
.accessiblit-surface .accessiblit-reset { inline-size:100%; border-radius:16px; font-weight:650; }
.accessiblit-surface button,.accessiblit-choice input { scroll-margin:12px; touch-action:manipulation; }
@media (hover:hover) {
 .accessiblit-surface button:hover,.accessiblit-choice:hover { border-color:var(--ui-focus); box-shadow:inset 0 0 0 1px var(--ui-focus); }
}
`;
