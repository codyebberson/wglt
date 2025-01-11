import { Component } from '../../core/gui/component';
import { Container } from '../../core/gui/container';
import { GUI } from '../../core/gui/gui';
import { Renderer } from '../../core/gui/renderer';
import { Rect } from '../../core/rect';
import { GraphicsApp } from '../graphicsapp';

export class AutoRectRenderer implements Renderer<GraphicsApp, Component> {
  constructor(readonly sourceRect: Rect) {}

  render(gui: GUI<GraphicsApp>, component: Component): void {
    const app = gui.context;

    app.drawAutoRect(this.sourceRect, component.screenRect);

    if (component instanceof Container) {
      gui.drawChildren(component);
    }
  }
}
