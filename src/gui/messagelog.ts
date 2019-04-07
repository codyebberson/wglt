import {Color} from '../color';
import {Colors} from '../colors';
import {Message} from '../message';
import {Rect} from '../rect';

import {Panel} from './panel';
import { Serializable } from '../serializable';

@Serializable('MessageLog')
export class MessageLog extends Panel {
  private readonly messages: Message[];
  readonly maxItems: number;

  constructor(rect: Rect, maxItems?: number) {
    super(rect);
    this.messages = [];
    this.maxItems = maxItems || 5;
  }

  add(text: string|Panel, color?: Color) {
    if (text instanceof Panel) {
      // TODO:  This is a weird artifact of history
      // The original API was designed before Panels were hierarchical.
      return;
    }

    this.messages.push(new Message(text, color || Colors.WHITE));

    if (this.messages.length > this.maxItems) {
      this.messages.splice(0, this.messages.length - this.maxItems);
    }
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

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