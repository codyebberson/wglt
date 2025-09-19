import { Rect } from '../../core/rect';
import { getKeyForLetterByIndex } from '../keys';
import { Component } from './component';
import { SelectOption } from './selectoption';

export class SelectInput extends Component {
  options: SelectOption[];
  callback: (option: SelectOption, index: number) => void;
  selectedIndex = -1;
  margin = 4;
  lineHeight = 10;

  constructor(
    rect: Rect,
    options: SelectOption[],
    callback: (option: SelectOption, index: number) => void
  ) {
    super(rect);
    this.options = options as SelectOption[];
    this.callback = callback;
  }

  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    const mouse = app.mouse;
    const keyboard = app.keyboard;

    for (let i = 0; i < this.options.length; i++) {
      const key = getKeyForLetterByIndex(i);
      if (keyboard.isKeyPressed(key)) {
        keyboard.clear();
        this.callback(this.options[i], i);
        return true;
      }
    }

    if (keyboard.isUpKeyPressed()) {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      return true;
    }

    if (keyboard.isDownKeyPressed()) {
      if (this.selectedIndex < this.options.length - 1) {
        this.selectedIndex++;
      }
      return true;
    }

    if (keyboard.isEnterKeyPressed() && this.selectedIndex >= 0) {
      keyboard.clear();
      this.callback(this.options[this.selectedIndex], this.selectedIndex);
      return true;
    }

    if (keyboard.isEscapeKeyPressed()) {
      keyboard.clear();
      return true;
    }

    const offset = this.screenRect;
    if (mouse.isClicked() && mouse.x >= offset.x1 && mouse.x < offset.x2) {
      for (let i = 0; i < this.options.length; i++) {
        const startY = offset.y + this.margin + i * this.lineHeight;
        const endY = startY + this.lineHeight;
        if (mouse.y >= startY && mouse.y < endY) {
          mouse.buttons.clear();
          this.callback(this.options[i], i);
        }
      }
    }

    return true;
  }
}
