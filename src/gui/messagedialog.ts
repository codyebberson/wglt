import { Console } from '../console';
import { Keys } from '../keys';
import { Point } from '../point';
import { Rect } from '../rect';
import { Terminal } from '../terminal';
import { Dialog } from './dialog';
import { Message } from './message';

export class MessageDialog extends Dialog {
  constructor(
    title: string,
    readonly message: string | Message
  ) {
    let rect;
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
    return terminal.isKeyPressed(Keys.VK_ESCAPE);
  }
}
