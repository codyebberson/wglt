import { Color } from '../../core/color';
import { Container } from '../../core/gui/container';
import { Message } from '../../core/message';
import { SimplePalette } from '../../core/palettes/simple';
import { Rect } from '../../core/rect';

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
