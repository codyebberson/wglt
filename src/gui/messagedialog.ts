
import {Dialog} from './dialog';
import {Keys} from '../keys';
import {Rect} from '../rect';
import {Terminal} from '../terminal';

export class MessageDialog extends Dialog {
  readonly lines: string[];

  constructor(terminal: Terminal, title: string, message: string) {
    const lines = message.split('\n');
    let width = title.length + 6;
    for (let i = 0; i < lines.length; i++) {
      width = Math.max(width, lines[i].length + 6);
    }

    const height = 4 + lines.length;
    const x = ((terminal.width - width) / 2) | 0;
    const y = ((terminal.height - height) / 2) | 0;
    const rect = new Rect(x, y, width, height);
    super(terminal, rect, title);
    this.lines = lines;
  }

  drawContents() {
    const centerX = this.rect.x + (this.rect.width / 2) | 0;
    const startY = this.rect.y + 2;

    for (let i = 0; i < this.lines.length; i++) {
      this.terminal.drawCenteredString(centerX, startY + i, this.lines[i]);
    }
  }

  handleInput() {
    return this.terminal.isKeyPressed(Keys.VK_ESCAPE);
  }
}
