import { BaseApp } from '../baseapp.ts';
import { Component, type ComponentConstructor } from './component.ts';
import type { Renderer } from './renderer.ts';

export class RendererMap<TContext extends BaseApp = BaseApp> {
  private readonly renderers = new Map<string, Renderer>();

  set<T extends Component>(type: ComponentConstructor<T>, renderer: Renderer<TContext, T>): void {
    this.renderers.set(type.name, renderer);
  }

  get<T extends Component>(type: ComponentConstructor<T>): Renderer<TContext, T> | undefined {
    return this.renderers.get(type.name);
  }

  setAll(map: RendererMap<TContext>): void {
    for (const [key, renderer] of map.renderers.entries()) {
      this.renderers.set(key, renderer);
    }
  }

  get size(): number {
    return this.renderers.size;
  }
}
