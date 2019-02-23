import {Color} from '../color';
import {Colors} from '../colors';
import {GUI} from '../gui';
import {Message} from '../message';
import {Rect} from '../rect';

import {Panel} from './panel';

export class MessageLog extends Panel {
  private readonly messages: Message[];
  readonly maxItems: number;

  constructor(gui: GUI, rect: Rect, maxItems?: number) {
    super(gui, rect);
    this.messages = [];
    this.maxItems = maxItems || 5;
  }

  add(text: string, color?: Color) {
    this.messages.push(new Message(text, color || Colors.WHITE));

    if (this.messages.length > this.maxItems) {
      this.messages.splice(0, this.messages.length - this.maxItems);
    }
  }

  drawContents() {
    const x = this.rect.x;
    let y = this.rect.y;

    if (y < 0) {
      // Negative y value indicates attached to bottom of screen
      const bottom = this.gui.app.size.height + y + this.rect.height;
      y = bottom - this.messages.length * 10;
    }

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      this.gui.app.drawString(msg.text, x, y, msg.color);
      y += 10;
    }
  }

  handleInput() {
    return false;
  }
}