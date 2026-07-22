import { Component } from '../../core/gui/component.ts';
import { Container } from '../../core/gui/container.ts';
import { GUI } from '../../core/gui/gui.ts';
import type { Renderer } from '../../core/gui/renderer.ts';
import { Rect } from '../../core/rect.ts';
import { GraphicsApp } from '../graphicsapp.ts';

export class AutoRectRenderer<T extends Component = Component> implements Renderer<GraphicsApp, T> {
  readonly sourceRect: Rect;

  static render(gui: GUI<GraphicsApp>, sourceRect: Rect, component: Component): void {
    const app = gui.context;

    app.drawAutoRect(sourceRect, component.screenRect);

    if (component instanceof Container) {
      gui.drawChildren(component);
    }
  }

  constructor(sourceRect: Rect) {
    this.sourceRect = sourceRect;
  }

  render(gui: GUI<GraphicsApp>, component: Component): void {
    AutoRectRenderer.render(gui, this.sourceRect, component);
  }
}
