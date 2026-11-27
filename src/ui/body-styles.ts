/** Body-only tile styling preserves the independently composed popup header. */
export const BODY_CSS = `
.accessiblit-body { padding:14px 12px 0; background:light-dark(#f5f5f7,#101c28); }
.accessiblit-body .accessiblit-group { gap:12px; margin-block-end:26px; }
.accessiblit-body .accessiblit-group h3 { margin:4px 4px 2px; color:var(--ui-ink); font-size:17px; font-weight:650; }
.accessiblit-body .accessiblit-feature { grid-column:auto; display:flex; flex-direction:column; align-items:center; gap:0; padding:16px 10px; border-radius:22px; text-align:center; box-shadow:0 3px 8px #0a254008; }
.accessiblit-body .accessiblit-feature--options { grid-column:1/-1; }
.accessiblit-body .accessiblit-feature-icon { flex:none; inline-size:52px; block-size:52px; margin:0 0 10px; border-radius:50%; color:var(--ui-ink); }
.accessiblit-body .accessiblit-feature-icon svg { inline-size:26px; block-size:26px; }
.accessiblit-body .accessiblit-feature h4 { margin:0; font-size:15px; line-height:1.4; font-weight:600; }
.accessiblit-body .accessiblit-feature p { margin:6px 0 0; font-size:12px; line-height:1.5; }
.accessiblit-body .accessiblit-feature .accessiblit-stepper { margin-block-start:auto; padding-block-start:12px; inline-size:100%; max-inline-size:168px; grid-template-columns:44px minmax(0,1fr) 44px; gap:2px; }
.accessiblit-body .accessiblit-step { border-radius:50%; }
.accessiblit-body .accessiblit-value { font-size:15px; }
.accessiblit-body .accessiblit-feature .accessiblit-options { justify-content:center; margin-block-start:12px; }
.accessiblit-body .accessiblit-feature .accessiblit-toggle { flex:none; margin-block-start:auto; padding-block-start:0; }
.accessiblit-body .accessiblit-binary-feature p { margin-block-end:8px; }
@container (max-width:320px) { .accessiblit-body .accessiblit-group { grid-template-columns:minmax(0,1fr); } }
@media(forced-colors:active) { .accessiblit-body { background:Canvas; } .accessiblit-body .accessiblit-feature { box-shadow:none; } }
`;
