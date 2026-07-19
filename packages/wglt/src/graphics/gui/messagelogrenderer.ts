import type { Font } from '../../core/font';
import { GUI } from '../../core/gui/gui';
import { MessageLog } from '../../core/gui/messagelog';
import type { Renderer } from '../../core/gui/renderer';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsMessageLogRenderer implements Renderer<GraphicsApp, MessageLog> {
  readonly spacing: number;
  readonly font: Font | undefined;

  constructor(spacing: number = 2, font?: Font) {
    this.spacing = spacing;
    this.font = font;
  }

  render(gui: GUI<GraphicsApp>, component: MessageLog): void {
    const app = gui.context;

    const font = this.font ?? app.defaultFont;
    if (!font) {
      throw new Error('No font available for rendering MessageLog');
    }

    const x = component.screenRect.x;
    let y = component.screenRect.y;
    for (let i = 0; i < component.messages.length; i++) {
      const msg = component.messages[i];
      app.drawString(x, y, msg.text ?? '', msg.fg, undefined, font);
      y += font.lineHeight + this.spacing;
    }
  }
}
