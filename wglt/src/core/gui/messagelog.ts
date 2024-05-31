import { Color } from '../../core/color';
import { Panel } from '../../core/gui/panel';
import { Message } from '../../core/message';
import { SimplePalette } from '../../core/palettes/simple';
import { Point } from '../../core/point';
import { Rect } from '../../core/rect';
import { BaseApp } from '../baseapp';

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

  draw(app: BaseApp): void {
    const pos = new Point(this.rect.x, this.rect.y);

    if (pos.y < 0) {
      // Negative y value indicates attached to bottom of screen
      const bottom = app.size.height + pos.y + this.rect.height;
      pos.y = bottom - this.messages.length * 10;
    }

    for (let i = 0; i < this.messages.length; i++) {
      const msg = this.messages[i];
      msg.draw(app, pos);
      pos.x = 0;
      pos.y += 10;
    }
  }

  handleInput(app: BaseApp): boolean {
    return false;
  }
}
