import {Message} from '../message';
import {Rect} from '../rect';
import {XArray} from '../xarray';

import {Dialog} from './dialog';

const WIDTH = 100;
const MARGIN = 5;
const LINE_PADDING = 2;

export class TooltipDialog extends Dialog {
  messages: Message[];

  constructor() {
    super(new Rect(0, 0, WIDTH, 10));
    this.messages = [];
    this.visible = false;
    // this.modal = true;
  }

  showAt(x: number, y: number) {
    if (!this.gui) {
      return;
    }

    // Resize
    const app = this.gui.app;
    const font = app.font;
    const lineHeight = font.getHeight() + LINE_PADDING;
    this.rect.width = 2 * MARGIN;
    this.rect.height = 2 * MARGIN + this.messages.length * lineHeight;

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      const width = 2 * MARGIN + font.getStringWidth(msg.text);
      this.rect.width = Math.max(this.rect.width, width);
    }

    if (x + this.rect.width >= app.size.width) {
      this.rect.x = x - this.rect.width - 2;
    } else {
      this.rect.x = x + 2;
    }

    if (y - this.rect.height < 0) {
      this.rect.y = y + 2;
    } else {
      this.rect.y = y - this.rect.height - 2;
    }

    this.visible = true;
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    // Draw the dialog border
    super.drawContents();

    const lineHeight = this.gui.app.font.getHeight() + LINE_PADDING;
    const x = this.rect.x + MARGIN;
    let y = this.rect.y + MARGIN;

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      this.gui.app.drawString(msg.text, x, y, msg.color);
      y += lineHeight;
    }
  }

  handleInput() {
    if (!this.gui) {
      return false;
    }

    if (this.gui.app.mouse.isClicked()) {
      this.visible = false;
    }

    return false;
  }
}