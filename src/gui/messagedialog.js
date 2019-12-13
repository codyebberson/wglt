
import {Keys} from '../keys.js';
import {Rect} from '../rect.js';
import {Dialog} from './dialog.js';

export class MessageDialog extends Dialog {

  constructor(title, message) {
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

  drawContents(console, offset) {
    for (let i = 0; i < this.lines.length; i++) {
      console.drawString(offset.x, offset.y + i, this.lines[i]);
    }
  }

  handleInput(terminal, offset) {
    return terminal.isKeyPressed(Keys.VK_ESCAPE);
  }
}
