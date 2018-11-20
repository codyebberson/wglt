
import {Dialog} from './dialog';
import {Keys} from './keys';
import {Rect} from './rect';
import {Terminal} from './terminal';

export class SelectDialog extends Dialog {
  options: string[];
  callback: Function;

  constructor(
      terminal: Terminal, title: string, options: string[],
      callback: Function) {
    let width = title.length + 6;
    for (let i = 0; i < options.length; i++) {
      width = Math.max(width, options[i].length + 9);
    }

    const height = 4 + options.length;
    const x = ((terminal.width - width) / 2) | 0;
    const y = ((terminal.height - height) / 2) | 0;
    const rect = new Rect(x, y, width, height);
    super(terminal, rect, title);
    this.options = options;
    this.callback = callback;
  }

  drawContents() {
    for (let i = 0; i < this.options.length; i++) {
      const str = String.fromCharCode(65 + i) + ' - ' + this.options[i];
      this.terminal.drawString(this.rect.x + 2, this.rect.y + 2 + i, str);
    }
  }

  handleInput() {
    for (let i = 0; i < this.options.length; i++) {
      if (this.terminal.isKeyPressed(Keys.VK_A + i)) {
        this.callback(this.options[i]);
        return true;
      }
    }
    return this.terminal.isKeyPressed(Keys.VK_ESCAPE);
  }
}
