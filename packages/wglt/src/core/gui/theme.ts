import { BaseApp } from '../baseapp';
import { RendererMap } from './renderermap';

export class Theme<TContext extends BaseApp = BaseApp> {
  readonly renderers: RendererMap<TContext>;

  constructor() {
    this.renderers = new RendererMap<TContext>();
  }
}
