import { BaseApp } from '../baseapp.ts';
import type { Font } from '../font.ts';
import type { Insets } from '../insets.ts';
import { RendererMap } from './renderermap.ts';

export class Theme<TContext extends BaseApp = BaseApp> {
  readonly renderers: RendererMap<TContext>;
  defaultFont?: Font;
  tooltipPadding?: Insets;
  messageLogSpacing?: number;

  constructor() {
    this.renderers = new RendererMap<TContext>();
  }
}
