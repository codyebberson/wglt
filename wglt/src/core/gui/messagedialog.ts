import { Dialog } from '../../core/gui/dialog';
import { Rect } from '../../core/rect';
import { BaseApp } from '../baseapp';
import { Message } from '../message';

export class MessageDialog extends Dialog {
  constructor(
    rect: Rect,
    title: string,
    readonly message: string | Message
  ) {
    super(rect, title);
  }

  draw(app: BaseApp): void {
    super.draw(app);
  }
}
