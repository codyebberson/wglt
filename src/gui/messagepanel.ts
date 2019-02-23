import {GUI} from '../gui';
import {Message} from '../message';
import {Rect} from '../rect';

import {Panel} from './panel';

export class MessagePanel extends Panel {
  readonly message: Message;

  constructor(gui: GUI, rect: Rect, message: Message) {
    super(gui, rect);
    this.message = message;
  }

  drawContents() {
    const msg = this.message;
    const dst = this.rect;
    this.gui.app.drawString(msg.text, dst.x, dst.y, msg.color);
  }
}