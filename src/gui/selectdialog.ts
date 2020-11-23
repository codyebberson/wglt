
import {Keys} from '../keys';
import {Rect} from '../rect';
import {Dialog} from './dialog';
import {Point} from '../point';
import {Console} from '../console';
import {Terminal} from '../terminal';

export class SelectDialog extends Dialog {
  readonly options: string[];
  readonly callback: (i: number) => void;

  constructor(
      title: string, options: string[], callback: (i: number) => void) {
    let width = title.length;
    for (let i = 0; i < options.length; i++) {
      width = Math.max(width, options[i].length + 4);
    }

    const height = options.length;
    const rect = new Rect(0, 0, width, height);
    super(rect, title);
    this.options = options;
    this.callback = callback;
  }

  drawContents(console: Console, offset: Point) {
    for (let i = 0; i < this.options.length; i++) {
      const str = String.fromCharCode(65 + i) + ' - ' + this.options[i];
      console.drawString(offset.x, offset.y + i, str);
    }
  }

  handleInput(terminal: Terminal, offset: Point) {
    for (let i = 0; i < this.options.length; i++) {
      if (terminal.isKeyPressed(Keys.VK_A + i)) {
        this.callback(i);
        return true;
      }
    }
    return terminal.isKeyPressed(Keys.VK_ESCAPE);
  }
}
