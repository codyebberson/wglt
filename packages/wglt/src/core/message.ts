import type { Color } from './color';
import { serializable } from './serialize';

@serializable
export class Message {
  readonly text: string | undefined;
  readonly fg: Color | undefined;

  constructor(text: string | undefined, fg?: Color | undefined) {
    this.text = text;
    this.fg = fg;
  }
}
