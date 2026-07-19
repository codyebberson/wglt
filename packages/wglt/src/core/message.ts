import type { Color } from './color';
import { registerSerializable } from './serialize';

export class Message {
  static {
    registerSerializable(Message);
  }

  readonly text: string | undefined;
  readonly fg: Color | undefined;

  constructor(text: string | undefined, fg?: Color | undefined) {
    this.text = text;
    this.fg = fg;
  }
}
