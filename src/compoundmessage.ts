import { App } from './app';
import { Vec2 } from './vec2';
import { Message } from './message';
import { Font } from './font';

export class CompoundMessage extends Message {
  readonly messages: Message[];

  constructor(...messages: Message[]) {
    super('', 0);
    this.messages = messages;
  }

  draw(app: App, pos: Vec2) {
    for (let i = 0; i < this.messages.length; i++) {
      this.messages[i].draw(app, pos);
    }
  }

  getWidth(font: Font) {
    let sum = 0;
    for (let i = 0; i < this.messages.length; i++) {
      sum += this.messages[i].getWidth(font);
    }
    return sum;
  }
}
