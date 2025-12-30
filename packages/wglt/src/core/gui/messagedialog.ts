import type { Color } from '../color';
import type { Font } from '../font';
import type { Insets } from '../insets';
import { Message } from '../message';
import { Rect } from '../rect';
import { Dialog } from './dialog';
import { Label } from './label';

export class MessageDialog extends Dialog {
  readonly message: string | Message;

  constructor(
    rect: Rect,
    title: string | undefined,
    message: string | Message,
    font?: Font,
    padding?: Insets
  ) {
    super(rect, title);
    this.message = message;

    let text: string;
    let fg: Color | undefined;
    if (message instanceof Message) {
      text = message.text ?? '';
      fg = message.fg;
    } else {
      text = message;
    }

    const labelRect = new Rect(
      padding?.left ?? 0,
      padding?.top ?? 0,
      rect.width - (padding?.left ?? 0) - (padding?.right ?? 0),
      rect.height - (padding?.top ?? 0) - (padding?.bottom ?? 0)
    );
    this.addChild(new Label(labelRect, text, fg, undefined, undefined, undefined, font));
  }
}
