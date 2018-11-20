
import {Dialog} from './dialog';
import {Keys} from './keys';
import {Rect} from './rect';
import {Terminal} from './terminal';

export class MessageDialog extends Dialog {
  readonly message: string;

  constructor(terminal: Terminal, title: string, message: string) {
    const width = message.length + 6;
    const height = 5;
    const x = ((terminal.width - width) / 2) | 0;
    const y = ((terminal.height - height) / 2) | 0;
    const rect = new Rect(x, y, width, height);
    super(terminal, rect, title);
    this.message = message;
  }

  drawContents() {
    this.terminal.drawCenteredString(
        this.rect.x + (this.rect.width / 2) | 0, this.rect.y + 2, this.message);
  }

  handleInput() {
    return this.terminal.isKeyPressed(Keys.VK_ESCAPE);
  }
}
