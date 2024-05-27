import { Dialog } from '../../core/gui/dialog';
import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { BaseApp } from '../baseapp';
import { SelectOption } from './selectoption';

const MARGIN = 4;
const LINE_HEIGHT = 10;

export class SelectDialog extends Dialog {
  options: SelectOption[];
  callback: (option: SelectOption) => void;

  constructor(
    rect: Rect,
    title: string,
    options: SelectOption[],
    callback: (option: SelectOption) => void
  ) {
    super(rect);
    this.title = title;
    this.options = options;
    this.callback = callback;
  }

  draw(app: BaseApp): void {
    super.draw(app);
    const offset = this.rect;
    for (let i = 0; i < this.options.length; i++) {
      const str = `${String.fromCharCode(65 + i)} - ${this.options[i].name}`;
      app.drawString(offset.x + MARGIN, offset.y + MARGIN + i * LINE_HEIGHT, str);
    }
  }

  handleInput(app: BaseApp): boolean {
    for (let i = 0; i < this.options.length; i++) {
      const key = `Key${String.fromCharCode('A'.charCodeAt(0) + i)}` as Key;
      if (app.isKeyPressed(key)) {
        this.callback(this.options[i]);
        this.close();
        return true;
      }
    }

    if (app.isKeyPressed(Key.VK_ESCAPE)) {
      this.close();
      return true;
    }

    const mouse = app.mouse;
    const offset = this.rect;
    if (mouse.isClicked() && mouse.x >= offset.x1 && mouse.x < offset.x2) {
      if (this.closeButton && mouse.x >= offset.x2 - 16 && mouse.y < offset.y + 16) {
        this.close();
        return true;
      }

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
