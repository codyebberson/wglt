
import {Keys} from '../keys';
import {Rect} from '../rect';
import {Dialog} from './dialog';
import {Console} from '../console';
import {Terminal} from '../terminal';
import {Point} from '../point';

export class MessageDialog extends Dialog {
  readonly lines: string[];

  constructor(title: string, message: string) {
    const lines = message.split('\n');
    let width = title.length;
    for (let i = 0; i < lines.length; i++) {
      width = Math.max(width, lines[i].length);
    }

    const height = lines.length;
    const rect = new Rect(0, 0, width, height);
    super(rect, title);
    this.lines = lines;
  }

  drawContents(console: Console, offset: Point) {
    for (let i = 0; i < this.lines.length; i++) {
      console.drawString(offset.x, offset.y + i, this.lines[i]);
    }
  }

  handleInput(terminal: Terminal, offset: Point) {
    return terminal.isKeyPressed(Keys.VK_ESCAPE);
  }
}
