import { BaseApp } from '../baseapp.ts';
import { Component } from './component.ts';
import { GUI } from './gui.ts';

export interface Renderer<
  TContext extends BaseApp = BaseApp,
  TComponent extends Component = Component,
> {
  render(gui: GUI<TContext>, component: TComponent): void;
}
