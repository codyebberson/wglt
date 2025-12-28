import type { Font } from '../../core/font';
import { GUI } from '../../core/gui/gui';
import { Label } from '../../core/gui/label';
import type { Renderer } from '../../core/gui/renderer';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsLabelRenderer implements Renderer<GraphicsApp, Label> {
  readonly font: Font;

  constructor(font: Font) {
    this.font = font;
  }

  render(gui: GUI<GraphicsApp>, component: Label): void {
    if (!component.text) {
      return;
    }

    const app = gui.context;

    // TODO: Implement halign and valign
    app.drawString(
      this.font,
      component.screenRect.x,
      component.screenRect.y,
      component.text,
      component.fg
    );
  }
}
