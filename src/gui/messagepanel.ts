import {Message} from '../message';
import {Rect} from '../rect';

import {Panel} from './panel';

export class MessagePanel extends Panel {
  readonly message: Message;

  constructor(rect: Rect, message: Message) {
    super(rect);
    this.message = message;
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    const msg = this.message;
    const dst = this.rect;
    this.gui.app.drawString(msg.text, dst.x, dst.y, msg.color);
  }
}