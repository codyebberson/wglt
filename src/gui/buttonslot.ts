import {Key} from '../keys';
import {Rect} from '../rect';

import {Button} from './button';
import {Panel} from './panel';

export class ButtonSlot extends Panel {
  shortcutKey?: Key;

  constructor(rect: Rect, shortcutKey?: Key) {
    super(rect);
    this.shortcutKey = shortcutKey;
  }

  get button() {
    return this.children.length > 0 ? this.children.get(0) as Button : undefined;
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    const dst = this.rect;
    const src = this.gui.renderer.buttonSlotRect;
    if (src) {
      this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
    }

    const button = this.button;
    if (button && !button.isDragging()) {
      button.rect.x = this.rect.x;
      button.rect.y = this.rect.y;
      this.drawChildren();
    }

    if (this.shortcutKey) {
      this.gui.app.drawString(String.fromCharCode(this.shortcutKey), dst.x2 - 7, dst.y + 3);
    }
  }

  handleInput() {
    if (!this.gui) {
      return false;
    }

    if (this.handleChildrenInput()) {
      return true;
    }

    const app = this.gui.app;
    const mouse = app.mouse;
    const button = this.button;
    if (button) {
      if ((this.shortcutKey && app.isKeyPressed(this.shortcutKey)) ||
          (this.rect.contains(mouse) && mouse.isClicked())) {
        button.click();
        return true;
      }
    }

    return mouse.down && this.rect.contains(mouse);
  }
}