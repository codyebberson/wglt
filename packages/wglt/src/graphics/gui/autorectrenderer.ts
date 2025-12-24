import { Component } from '../../core/gui/component';
import { Container } from '../../core/gui/container';
import { GUI } from '../../core/gui/gui';
import type { Renderer } from '../../core/gui/renderer';
import { Rect } from '../../core/rect';
import { GraphicsApp } from '../graphicsapp';

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
