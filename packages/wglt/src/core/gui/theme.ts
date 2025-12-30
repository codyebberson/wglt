import { BaseApp } from '../baseapp';
import type { Font } from '../font';
import type { Insets } from '../insets';
import { RendererMap } from './renderermap';

export class Theme<TContext extends BaseApp = BaseApp> {
  readonly renderers: RendererMap<TContext>;
  defaultFont?: Font;
  tooltipPadding?: Insets;
  messageLogSpacing?: number;

  constructor() {
    this.renderers = new RendererMap<TContext>();
  }
}
