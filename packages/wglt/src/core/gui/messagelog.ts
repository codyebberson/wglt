import type { Color } from '../../core/color.ts';
import { Container } from '../../core/gui/container.ts';
import { Message } from '../../core/message.ts';
import { SimplePalette } from '../../core/palettes/simple.ts';
import { Rect } from '../../core/rect.ts';

export class MessageLog extends Container {
  readonly messages: Message[];
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

  handleInput(): boolean {
    return false;
  }
}
