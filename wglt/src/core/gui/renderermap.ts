import { BaseApp } from '../baseapp';
import { Component, ComponentConstructor } from './component';
import { Renderer } from './renderer';

export class RendererMap<TContext extends BaseApp = BaseApp> {
  private readonly renderers = new Map<string, Renderer>();

  set<T extends Component>(type: ComponentConstructor<T>, renderer: Renderer<TContext, T>): void {
    this.renderers.set(type.name, renderer);
  }

  get<T extends Component>(type: ComponentConstructor<T>): Renderer<TContext, T> | undefined {
    return this.renderers.get(type.name);
  }

  get size(): number {
    return this.renderers.size;
  }
}
