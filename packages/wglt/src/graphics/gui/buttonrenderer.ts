import type { Font } from '../../core/font';
import { Button, getShortcutKeyDisplay } from '../../core/gui/button';
import { GUI } from '../../core/gui/gui';
import type { Renderer } from '../../core/gui/renderer';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsButtonRenderer implements Renderer<GraphicsApp, Button> {
  readonly font: Font;

  static render(gui: GUI<GraphicsApp>, font: Font, component: Button): void {
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
        font,
        x + sourceRect.width - 2,
        y + 2,
        getShortcutKeyDisplay(component.shortcutKey)
      );
    }
  }

  constructor(font: Font) {
    this.font = font;
  }

  render(gui: GUI<GraphicsApp>, component: Button): void {
    GraphicsButtonRenderer.render(gui, this.font, component);
  }
}
