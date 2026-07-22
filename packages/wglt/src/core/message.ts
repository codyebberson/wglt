import type { Color } from './color';
import { registerSerializable } from './serialize';

export class Message {
  static {
    registerSerializable('wglt.Message', Message);
  }

  readonly text: string | undefined;
  readonly fg: Color | undefined;

  constructor(text: string | undefined, fg?: Color | undefined) {
    this.text = text;
    this.fg = fg;
  }
}
