import { CARD_CSS } from './card-styles';
import type { placeUI } from './placement';

/** Shadow-local tokens isolate typography and support system appearance without remote assets. */
export const UI_CSS = `
.accessiblit-surface {
  all:initial; --ui-bg:#ffffff; --ui-ink:#162b3d; --ui-muted:#42566c; --ui-border:#6b8094;
  --ui-quiet:#f1f3f7; --ui-body:#ffffff; --ui-accent:#004cde; --ui-accent-ink:#ffffff; --ui-focus:#1456a0;
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
.accessiblit-panel { display:flex; flex-direction:column; padding:0; border:1px solid var(--ui-border); border-radius:14px; box-shadow:0 12px 40px #12263833; overflow:hidden; }
.accessiblit-header { flex:none; display:grid; grid-template-columns:40px 1fr 44px; gap:4px 12px; padding:20px; color:var(--ui-ink); background:var(--ui-bg); background-image:linear-gradient(125deg,var(--ui-bg) 35%,var(--ui-quiet)); border-block-end:1px solid var(--ui-border); }
.accessiblit-emblem { grid-column:1; grid-row:1/3; display:flex; align-items:center; justify-content:center; inline-size:40px; block-size:40px; border:1px solid var(--ui-accent); border-radius:10px; color:var(--ui-accent-ink); background:var(--ui-accent); }
.accessiblit-emblem svg { inline-size:26px; block-size:26px; }
.accessiblit-header h2 { grid-column:2; grid-row:1; margin:0; align-self:end; min-inline-size:0; font-size:19px; line-height:1.3; font-weight:600; text-wrap:balance; letter-spacing:-.025em; }
.accessiblit-brand { grid-column:2; grid-row:2; color:var(--ui-muted); font-size:12px; font-weight:500; }
.accessiblit-surface .accessiblit-close { grid-column:3; grid-row:1/3; display:flex; align-items:center; justify-content:center; min-inline-size:44px; inline-size:44px; block-size:44px; padding:0; border:1px solid var(--ui-border); border-radius:8px; color:var(--ui-ink); background:var(--ui-bg); }
.accessiblit-intro { grid-column:1/-1; margin:12px 0 0; color:var(--ui-muted); font-size:13px; line-height:1.5; }
.accessiblit-body { flex:1; min-block-size:0; padding:18px 16px 0; container-type:inline-size; background:var(--ui-body); overflow:auto; overscroll-behavior:contain; scroll-padding:12px; }
.accessiblit-footer { flex:none; padding:14px 16px; border-block-start:1px solid var(--ui-border); background:var(--ui-bg); }
${CARD_CSS}
@media (prefers-color-scheme:dark) {
  .accessiblit-surface { --ui-bg:#142331; --ui-ink:#f5f8fc; --ui-muted:#c4d2e1; --ui-border:#91a8bc; --ui-quiet:#22384b; --ui-body:#101c28; --ui-accent:#a5d0ff; --ui-accent-ink:#142331; --ui-focus:#a5d0ff; }
}
@media (prefers-reduced-motion:reduce) {
  .accessiblit-surface, .accessiblit-surface * { animation:none!important; transition:none!important; scroll-behavior:auto!important; }
}
.accessiblit-cursor-note { display:none; }
@media not all and (any-pointer:fine) { .accessiblit-cursor-note { display:block; } }
.accessiblit-forced-colours-note { display:none; }
@media (forced-colors:active) {
  .accessiblit-forced-colours-note,.accessiblit-cursor-note { display:block; }
  .accessiblit-surface { --ui-bg:Canvas; --ui-ink:CanvasText; --ui-muted:CanvasText; --ui-border:CanvasText; --ui-quiet:Canvas; --ui-body:Canvas; --ui-accent:CanvasText; --ui-accent-ink:Canvas; --ui-focus:CanvasText; forced-color-adjust:auto; box-shadow:none; }
  .accessiblit-surface button, .accessiblit-launcher { background:Canvas; color:CanvasText; border-color:CanvasText; }
  .accessiblit-surface .accessiblit-step { background:Canvas; color:CanvasText; border-color:CanvasText; }
  .accessiblit-choice input { accent-color:auto; }
  .accessiblit-header { color:CanvasText; background:Canvas; }
  .accessiblit-intro { color:CanvasText; }
  .accessiblit-feature,.accessiblit-emblem { border-color:CanvasText; box-shadow:none; }
  .accessiblit-surface .accessiblit-close { --ui-focus:CanvasText; --ui-bg:Canvas; background:Canvas; color:CanvasText; border-color:CanvasText; }
  .accessiblit-choice:has(input:checked) { background:Canvas; color:CanvasText; border-color:CanvasText; }

}
.accessiblit-surface::backdrop { background:transparent; pointer-events:none; }
`;

/** Numeric placement lives in the owned sheet rather than per-element inline style attributes. */
export function positionCSS(
  position: ReturnType<typeof placeUI>,
  zoom: number,
): string {
  return `.accessiblit-surface{z-index:${position.zIndex};zoom:${zoom}}
.accessiblit-launcher{inset-block-start:${position.launcherTop}px;inset-inline-start:${position.launcherLeft}px}
.accessiblit-launcher:dir(rtl){inset-inline-start:${position.layoutWidth - position.launcherLeft - 48}px}
.accessiblit-panel{inline-size:${position.panelWidth}px;max-block-size:${position.panelMaxHeight}px;inset-inline-start:${position.panelLeft}px;inset-block-start:${position.panelTop === undefined ? 'auto' : `${position.panelTop}px`};inset-block-end:${position.panelBottom === undefined ? 'auto' : `${position.panelBottom}px`}}
.accessiblit-panel:dir(rtl){inset-inline-start:${position.layoutWidth - position.panelLeft - position.panelWidth}px}
${position.panelMaxHeight < 360 ? `.accessiblit-panel{display:block;overflow:auto;overscroll-behavior:contain;scroll-padding:12px}.accessiblit-body{overflow:visible}.accessiblit-header{padding:14px 18px;grid-template-columns:1fr 44px;gap:8px}.accessiblit-emblem,.accessiblit-brand{display:none}.accessiblit-header h2{grid-column:1;grid-row:1;font-size:18px}.accessiblit-close{grid-column:2;grid-row:1}.accessiblit-intro{font-size:12px}` : ''}`;
}
