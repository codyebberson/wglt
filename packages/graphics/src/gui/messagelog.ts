import { Color } from '@wglt/core';
import { SimplePalette } from '@wglt/core';
import { Rect } from '@wglt/core';
import { Vec2 } from '@wglt/core';
import { Message } from '../message';
import { Panel } from './panel';

export class MessageLog extends Panel {
  private readonly messages: Message[];
  readonly maxItems: number;

  constructor(rect: Rect, maxItems?: number) {
    super(rect);
    this.messages = [];
    this.maxItems = maxItems || 5;
  }

  addMessage(message: string | Message, color: Color = SimplePalette.WHITE): void {
    if (message instanceof Message) {
      this.messages.push(message);
    } else {
      this.messages.push(new Message(message, color));
    }

    if (this.messages.length > this.maxItems) {
      this.messages.splice(0, this.messages.length - this.maxItems);
    }
  }

  drawContents(): void {
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

  handleInput(): boolean {
    return false;
  }
}
