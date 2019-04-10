import {Color} from '../color';
import {Colors} from '../colors';
import {Message} from '../message';
import {Rect} from '../rect';

import {Panel} from './panel';
import { Serializable } from '../serializable';
import { Vec2 } from '../vec2';

@Serializable('MessageLog')
export class MessageLog extends Panel {
  private readonly messages: Message[];
  readonly maxItems: number;

  constructor(rect: Rect, maxItems?: number) {
    super(rect);
    this.messages = [];
    this.maxItems = maxItems || 5;
  }

  add(message: string|Message|Panel, color?: Color) {
    if (message instanceof Panel) {
      // TODO:  This is a weird artifact of history
      // The original API was designed before Panels were hierarchical.
      return;
    }

    if (message instanceof Message) {
      this.messages.push(message);
    } else {
      this.messages.push(new Message(message, color || Colors.WHITE));
    }

    if (this.messages.length > this.maxItems) {
      this.messages.splice(0, this.messages.length - this.maxItems);
    }
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    const pos = new Vec2(this.rect.x, this.rect.y);

    if (pos.y < 0) {
      // Negative y value indicates attached to bottom of screen
      const bottom = this.gui.app.size.height + pos.y + this.rect.height;
      pos.y = bottom - this.messages.length * 10;
    }

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      msg.draw(this.gui.app, pos);
      pos.x = 0;
      pos.y += 10;
    }
  }

  handleInput() {
    return false;
  }
}