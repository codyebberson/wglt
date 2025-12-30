import type { Font } from '../../core/font';
import { Button, getShortcutKeyDisplay } from '../../core/gui/button';
import { GUI } from '../../core/gui/gui';
import type { Renderer } from '../../core/gui/renderer';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsButtonRenderer implements Renderer<GraphicsApp, Button> {
  readonly font: Font | undefined;

  static render(gui: GUI<GraphicsApp>, component: Button, font?: Font): void {
    const app = gui.context;

    const sourceRect = component.sprite;
    const destRect = component.screenRect;

    // Start with the rectangle position
    let x = destRect.x;
    let y = destRect.y;

    // Add the rectangle offset
    x += ((destRect.width - sourceRect.width) / 2) | 0;
    y += ((destRect.height - sourceRect.height) / 2) | 0;

    app.drawImage(x, y, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height);

    if (component.shortcutKey) {
      app.drawRightString(
        x + sourceRect.width - 2,
        y + 2,
        getShortcutKeyDisplay(component.shortcutKey),
        undefined,
        undefined,
        font
      );
    }
  }

  constructor(font?: Font) {
    this.font = font;
  }

  render(gui: GUI<GraphicsApp>, component: Button): void {
    GraphicsButtonRenderer.render(gui, component, this.font);
  }
}
