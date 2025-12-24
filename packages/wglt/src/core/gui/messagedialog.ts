import { Message } from '../message';
import { Rect } from '../rect';
import { Dialog } from './dialog';
import { Label } from './label';

export class MessageDialog extends Dialog {
  readonly message: string | Message;
  constructor(rect: Rect, title: string | undefined, message: string | Message) {
    super(rect, title);
    this.message = message;

    const labelRect = new Rect(2, 2, rect.width - 2, rect.height - 2);
    this.addChild(new Label(labelRect, message as string));
  }
}
