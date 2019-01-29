import {GUI} from '../gui';
import {Keys} from '../keys';
import {Rect} from '../rect';
import {Dialog} from './dialog';
import {SelectOption} from './selectoption';

const MARGIN = 4;
const LINE_HEIGHT = 10;

export class SelectDialog extends Dialog {
  options: SelectOption[];
  callback: Function;

  constructor(gui: GUI, rect: Rect, title: string, options: SelectOption[], callback: Function) {
    super(gui, rect, title);
    this.options = options;
    this.callback = callback;
  }

  drawContents() {
    super.drawContents();
    const offset = this.rect;
    for (let i = 0; i < this.options.length; i++) {
      const str = String.fromCharCode(65 + i) + ' - ' + this.options[i].name;
      this.gui.app.drawString(str, offset.x + MARGIN, offset.y + MARGIN + i * LINE_HEIGHT);
    }
  }

  handleInput() {
    for (let i = 0; i < this.options.length; i++) {
      if (this.gui.app.isKeyPressed(Keys.VK_A + i)) {
        this.callback(this.options[i]);
        this.close();
      }
    }

    if (this.gui.app.isKeyPressed(Keys.VK_ESCAPE)) {
      this.close();
    }

    const mouse = this.gui.app.mouse;
    const offset = this.rect;
    if (mouse.upCount === 1 && mouse.x >= offset.x1 && mouse.x < offset.x2) {
      for (let i = 0; i < this.options.length; i++) {
        const startY = offset.y + MARGIN + i * LINE_HEIGHT;
        const endY = startY + LINE_HEIGHT;
        if (mouse.y >= startY && mouse.y < endY) {
          this.callback(this.options[i]);
          this.close();
        }
      }
    }

    return true;
  }
}
