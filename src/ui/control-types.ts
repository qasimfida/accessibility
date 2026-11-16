import type { Feature, Messages } from '../core/types';

/** Renderers depend on metadata and state callbacks, never on a particular feature id. */
export interface ControlContext {
  document: Document;
  feature: Feature;
  messages: Messages;
  prefix: string;
  /** A renderer can format an ordinal index without exposing it as a feature setting. */
  formatValue?(value: number): string;
  getValue(): unknown;
  setValue(value: unknown): void;
}

/** Rendered controls can synchronize external changes without replacing focused nodes. */
export interface RenderedControl {
  element: HTMLElement;
  update(value: unknown): void;
  destroy(): void;
}
