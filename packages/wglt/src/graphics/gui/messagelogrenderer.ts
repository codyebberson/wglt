import type { Font } from '../../core/font';
import { GUI } from '../../core/gui/gui';
import { MessageLog } from '../../core/gui/messagelog';
import type { Renderer } from '../../core/gui/renderer';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsMessageLogRenderer implements Renderer<GraphicsApp, MessageLog> {
  readonly font: Font;

  constructor(font: Font) {
    this.font = font;
  }

  render(gui: GUI<GraphicsApp>, component: MessageLog): void {
    const app = gui.context;
    const x = component.rect.x;
    let y = component.rect.y;
    for (let i = 0; i < component.messages.length; i++) {
      const msg = component.messages[i];
      app.drawString(this.font, x, y, msg.text ?? '', msg.fg);
      y += 10;
    }
  }
}
