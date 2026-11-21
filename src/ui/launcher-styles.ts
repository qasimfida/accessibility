/** Shared launcher foundation and system appearance are sufficient before the panel opens. */
export const LAUNCHER_CSS = `
.accessiblit-surface {
  all:initial; --ui-bg:#ffffff; --ui-ink:#162b3d; --ui-muted:#42566c; --ui-border:#6b8094;
  --ui-quiet:#f1f3f7; --ui-body:#faf8f5; --ui-accent:#004cde; --ui-accent-ink:#ffffff; --ui-focus:#1456a0;
  position:fixed; display:block; box-sizing:border-box; margin:0; padding:0;
  color:var(--ui-ink); background:var(--ui-bg); font:15px/1.5 "Avenir Next",Arial,system-ui,sans-serif;
  color-scheme:light dark; text-align:start; letter-spacing:normal; word-spacing:normal; text-transform:none; text-indent:0;
  pointer-events:auto; overflow-wrap:anywhere; animation:none; transition:none; scroll-behavior:auto;
}
.accessiblit-surface[hidden] { display:none!important; }
.accessiblit-surface *, .accessiblit-surface *::before, .accessiblit-surface *::after { box-sizing:border-box; letter-spacing:inherit; word-spacing:inherit; }
.accessiblit-surface button {
  appearance:none; font:inherit; color:var(--ui-ink); background:var(--ui-bg); border:1px solid var(--ui-border);
  border-radius:8px; min-inline-size:44px; min-block-size:44px; padding:8px 12px; cursor:pointer; text-align:center; overflow-wrap:anywhere;
}
.accessiblit-surface:focus, .accessiblit-surface :focus {
  outline:3px solid var(--ui-focus); outline-offset:3px; box-shadow:0 0 0 6px var(--ui-bg);
}
.accessiblit-surface button[aria-disabled=true] { color:var(--ui-muted); background:var(--ui-quiet); cursor:default; }
.accessiblit-launcher {
  display:flex; align-items:center; justify-content:center; inline-size:48px; block-size:48px; padding:0; border:2px solid var(--ui-accent);
  border-radius:50%; color:var(--ui-accent-ink); background:var(--ui-accent); box-shadow:0 4px 16px #12263833; cursor:pointer;
}
.accessiblit-launcher svg { display:block; flex:none; }
@media (prefers-color-scheme:dark) {
  .accessiblit-surface { --ui-bg:#142331; --ui-ink:#f5f8fc; --ui-muted:#c4d2e1; --ui-border:#91a8bc; --ui-quiet:#22384b; --ui-body:#101c28; --ui-accent:#a5d0ff; --ui-accent-ink:#142331; --ui-focus:#a5d0ff; }
}
@media (prefers-reduced-motion:reduce) {
  .accessiblit-surface, .accessiblit-surface * { animation:none!important; transition:none!important; scroll-behavior:auto!important; }
}
@media (forced-colors:active) {
  .accessiblit-surface { --ui-bg:Canvas; --ui-ink:CanvasText; --ui-muted:CanvasText; --ui-border:CanvasText; --ui-quiet:Canvas; --ui-body:Canvas; --ui-accent:CanvasText; --ui-accent-ink:Canvas; --ui-focus:CanvasText; forced-color-adjust:auto; box-shadow:none; }
  .accessiblit-surface button, .accessiblit-launcher { background:Canvas; color:CanvasText; border-color:CanvasText; }
}

.accessiblit-surface::backdrop { background:transparent; pointer-events:none; }
`;
