import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { Component } from './component';
import { SelectOption } from './selectoption';

const MARGIN = 4;
const LINE_HEIGHT = 10;

export class SelectInput extends Component {
  options: SelectOption[];
  callback: (option: SelectOption) => void;
  selectedIndex = -1;

  constructor(rect: Rect, options: SelectOption[], callback: (option: SelectOption) => void) {
    super(rect);
    this.options = options;
    this.callback = callback;
  }

  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    for (let i = 0; i < this.options.length; i++) {
      const key = `Key${String.fromCharCode('A'.charCodeAt(0) + i)}` as Key;
      if (app.isKeyPressed(key)) {
        this.callback(this.options[i]);
        // this.close();
        return true;
      }
    }

    if (app.isKeyPressed(Key.VK_UP)) {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      return true;
    }

    if (app.isKeyPressed(Key.VK_DOWN)) {
      if (this.selectedIndex < this.options.length - 1) {
        this.selectedIndex++;
      }
      return true;
    }

    if (app.isKeyPressed(Key.VK_ENTER) && this.selectedIndex >= 0) {
      this.callback(this.options[this.selectedIndex]);
      // this.close();
      return true;
    }

    if (app.isKeyPressed(Key.VK_ESCAPE)) {
      // this.close();
      return true;
    }

    const mouse = app.mouse;
    const offset = this.rect;
    if (mouse.isClicked() && mouse.x >= offset.x1 && mouse.x < offset.x2) {
      // if (this.closeButton && mouse.x >= offset.x2 - 16 && mouse.y < offset.y + 16) {
      //   this.close();
      //   return true;
      // }

      for (let i = 0; i < this.options.length; i++) {
        const startY = offset.y + MARGIN + i * LINE_HEIGHT;
        const endY = startY + LINE_HEIGHT;
        if (mouse.y >= startY && mouse.y < endY) {
          this.callback(this.options[i]);
          // this.close();
        }
      }
    }

    return true;
  }
}
