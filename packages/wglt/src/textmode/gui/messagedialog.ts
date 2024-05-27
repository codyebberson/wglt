import { Dialog } from '../../core/gui/dialog';
import { Key } from '../../core/keys';
import { Point } from '../../core/point';
import { Rect } from '../../core/rect';
import { Console } from '../console';
import { Terminal } from '../terminal';
import { Message } from './message';

export class MessageDialog extends Dialog {
  constructor(
    title: string,
    readonly message: string | Message
  ) {
    let rect: Rect;
    if (message instanceof Message) {
      rect = new Rect(0, 0, message.getWidth(), message.getHeight());
    } else {
      rect = new Rect(0, 0, message.length, 1);
    }
    super(rect, title);
  }

  drawContents(console: Console, offset: Point): void {
    if (this.message instanceof Message) {
      console.drawMessage(offset.x, offset.y, this.message, this.message.getWidth());
    } else {
      console.drawString(offset.x, offset.y, this.message);
    }
  }

  handleInput(terminal: Terminal): boolean {
    return terminal.isKeyPressed(Key.VK_ESCAPE);
  }
}
