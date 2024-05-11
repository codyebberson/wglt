import { Key } from '@wglt/core';
import { Rect } from '@wglt/core';
import { Dialog } from './dialog';
import { SelectOption } from './selectoption';

const MARGIN = 4;
const LINE_HEIGHT = 10;

export class SelectDialog extends Dialog {
  options: SelectOption[];
  callback: (option: SelectOption) => void;

  constructor(rect: Rect, options: SelectOption[], callback: (option: SelectOption) => void) {
    super(rect);
    this.options = options;
    this.callback = callback;
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }

    super.drawContents();
    const offset = this.rect;
    for (let i = 0; i < this.options.length; i++) {
      const str = `${String.fromCharCode(65 + i)} - ${this.options[i].name}`;
      this.gui.app.drawString(str, offset.x + MARGIN, offset.y + MARGIN + i * LINE_HEIGHT);
    }
  }

  handleInput(): boolean {
    if (!this.gui) {
      return false;
    }

    for (let i = 0; i < this.options.length; i++) {
      const key = `Key${String.fromCharCode('A'.charCodeAt(0) + i)}` as Key;
      if (this.gui.app.isKeyPressed(key)) {
        this.callback(this.options[i]);
        this.close();
        return true;
      }
    }

    if (this.gui.app.isKeyPressed(Key.VK_ESCAPE)) {
      this.close();
      return true;
    }

    const mouse = this.gui.app.mouse;
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
