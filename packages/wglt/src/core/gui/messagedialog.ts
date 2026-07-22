import type { Color } from '../color.ts';
import type { Font } from '../font.ts';
import type { Insets } from '../insets.ts';
import { Message } from '../message.ts';
import { Rect } from '../rect.ts';
import { Dialog } from './dialog.ts';
import { Label } from './label.ts';

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
