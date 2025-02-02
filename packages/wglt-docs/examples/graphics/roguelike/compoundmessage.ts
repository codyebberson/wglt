import { Message } from 'wglt';

export class CompoundMessage extends Message {
  readonly messages: Message[];

  constructor(...messages: Message[]) {
    super('', 0);
    this.messages = messages;
  }
}
