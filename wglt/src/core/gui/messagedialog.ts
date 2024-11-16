import { Message } from '../message';
import { Rect } from '../rect';
import { Dialog } from './dialog';
import { Label } from './label';

export class MessageDialog extends Dialog {
  constructor(
    rect: Rect,
    title: string | undefined,
    readonly message: string | Message
  ) {
    super(rect, title);

    const labelRect = new Rect(1, 1, rect.width - 2, rect.height - 2);
    this.addChild(new Label(labelRect, message as string));
  }
}
