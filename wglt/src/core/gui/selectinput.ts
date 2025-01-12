import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { Component } from './component';
import { SelectOption } from './selectoption';

const MARGIN = 4;
const LINE_HEIGHT = 10;

export class SelectInput extends Component {
  options: SelectOption[];
  callback: (option: SelectOption, index: number) => void;
  selectedIndex = -1;

  constructor(
    rect: Rect,
    options: SelectOption[] | string[],
    callback: (option: SelectOption, index: number) => void
  ) {
    super(rect);

    if (typeof options[0] === 'string') {
      this.options = (options as string[]).map((name) => ({ name }));
    } else {
      this.options = options as SelectOption[];
    }

    this.callback = callback;
  }

  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    for (let i = 0; i < this.options.length; i++) {
      const key = `Key${String.fromCharCode('A'.charCodeAt(0) + i)}` as Key;
      if (app.keyboard.isKeyPressed(key)) {
        this.callback(this.options[i], i);
        return true;
      }
    }

    if (app.keyboard.isUpKeyPressed()) {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      return true;
    }

    if (app.keyboard.isDownKeyPressed()) {
      if (this.selectedIndex < this.options.length - 1) {
        this.selectedIndex++;
      }
      return true;
    }

    if (app.keyboard.isKeyPressed(Key.VK_ENTER) && this.selectedIndex >= 0) {
      this.callback(this.options[this.selectedIndex], this.selectedIndex);
      return true;
    }

    if (app.keyboard.isKeyPressed(Key.VK_ESCAPE)) {
      return true;
    }

    const mouse = app.mouse;
    const offset = this.rect;
    if (mouse.isClicked() && mouse.x >= offset.x1 && mouse.x < offset.x2) {
      for (let i = 0; i < this.options.length; i++) {
        const startY = offset.y + MARGIN + i * LINE_HEIGHT;
        const endY = startY + LINE_HEIGHT;
        if (mouse.y >= startY && mouse.y < endY) {
          this.callback(this.options[i], i);
        }
      }
    }

    return true;
  }
}
