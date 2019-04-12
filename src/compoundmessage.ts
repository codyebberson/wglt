import {Color} from './color';
import { App } from './app';
import { Vec2 } from './vec2';
import { Message } from './message';

export class CompoundMessage extends Message {
  readonly messages: Message[];

  constructor(...messages: Message[]) {
    super('', 0);
    this.messages = messages;
  }

  draw(app: App, pos: Vec2) {
    // app.drawString(this.text, pos.x, pos.y, this.color, pos);
    for (let i = 0; i < this.messages.length; i++) {
      this.messages[i].draw(app, pos);
    }
  }
}
