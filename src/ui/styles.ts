import { CARD_CSS } from './card-styles';
import { LAUNCHER_CSS } from './launcher-styles';
import type { placeUI } from './placement';

/** Panel rules are installed synchronously on first open, before exposing the dialog. */
export const UI_CSS = `${LAUNCHER_CSS}
.accessiblit-panel { display:flex; flex-direction:column; padding:0; border:1px solid var(--ui-border); border-radius:24px; box-shadow:0 16px 48px #12263826; overflow:hidden; }
.accessiblit-header { flex:none; display:grid; grid-template-columns:32px minmax(0,1fr) 44px; gap:2px 8px; padding:12px; color:var(--ui-ink); background:var(--ui-body); border-block-end:1px solid var(--ui-border); }
.accessiblit-emblem { grid-column:1; grid-row:1/3; display:flex; align-items:center; justify-content:center; inline-size:32px; block-size:32px; border:1px solid var(--ui-accent); border-radius:12px; color:var(--ui-accent-ink); background:var(--ui-accent); }
.accessiblit-emblem svg { inline-size:24px; block-size:24px; }
.accessiblit-header h2 { grid-column:2; grid-row:1; margin:0; align-self:end; min-inline-size:0; font-size:20px; line-height:1.4; font-weight:400; text-wrap:balance; letter-spacing:-.015em; }
.accessiblit-brand { grid-column:2; grid-row:2; color:var(--ui-muted); font-size:13px; font-weight:500; }
.accessiblit-surface .accessiblit-close { grid-column:3; grid-row:1/3; display:flex; align-items:center; justify-content:center; min-inline-size:44px; inline-size:44px; block-size:44px; padding:0; border:1px solid var(--ui-border); border-radius:12px; color:var(--ui-ink); background:var(--ui-bg); }
.accessiblit-intro { grid-column:1/-1; margin:6px 0 0; color:var(--ui-muted); font-size:13px; line-height:1.5; }
.accessiblit-body { flex:1; min-block-size:0; padding:12px 12px 0; container-type:inline-size; background:var(--ui-body); overflow:auto; overscroll-behavior:contain; scroll-padding:12px; }
.accessiblit-footer { flex:none; padding:10px 12px; border-block-start:1px solid var(--ui-border); background:var(--ui-bg); }
${CARD_CSS}
.accessiblit-cursor-note { display:none; }
@media not all and (any-pointer:fine) { .accessiblit-cursor-note { display:block; } }
.accessiblit-forced-colours-note { display:none; }
@media (forced-colors:active) {
  .accessiblit-forced-colours-note,.accessiblit-cursor-note { display:block; }
  .accessiblit-surface .accessiblit-step,.accessiblit-surface .accessiblit-reset { background:Canvas; color:CanvasText; border-color:CanvasText; }
  .accessiblit-choice input { accent-color:auto; }
  .accessiblit-header { color:CanvasText; background:Canvas; }
  .accessiblit-intro { color:CanvasText; }
  .accessiblit-feature,.accessiblit-emblem { border-color:CanvasText; box-shadow:none; }
  .accessiblit-surface .accessiblit-close { --ui-focus:LinkText; --ui-bg:Canvas; background:Canvas; color:CanvasText; border-color:CanvasText; }
  .accessiblit-choice:has(input:checked) { background:Canvas; color:CanvasText; border-color:CanvasText; }

}
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
