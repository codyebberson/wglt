import { Vec2 } from '@wglt/core';
import { BaseApp } from './baseapp';
import { Font } from './font';
import { Message } from './message';

export class CompoundMessage extends Message {
  readonly messages: Message[];

  constructor(...messages: Message[]) {
    super('', 0);
    this.messages = messages;
  }

  draw(app: BaseApp, pos: Vec2): void {
    for (let i = 0; i < this.messages.length; i++) {
      this.messages[i].draw(app, pos);
    }
  }

  getWidth(font: Font): number {
    let sum = 0;
    for (let i = 0; i < this.messages.length; i++) {
      sum += this.messages[i].getWidth(font);
    }
    return sum;
  }
}
