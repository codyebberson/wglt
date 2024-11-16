import { BaseApp } from '../baseapp';
import { Component } from './component';
import { GUI } from './gui';

export interface Renderer<
  TContext extends BaseApp = BaseApp,
  TComponent extends Component = Component,
> {
  render(gui: GUI<TContext>, component: TComponent): void;
}
