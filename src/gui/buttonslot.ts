import {Key} from '../keys';
import {Rect} from '../rect';

import {Button} from './button';
import {Panel} from './panel';

export class ButtonSlot extends Panel {
  shortcutKey?: Key;

  constructor(destRect: Rect, shortcutKey?: Key) {
    super(destRect);
    this.shortcutKey = shortcutKey;
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

    this.drawChildren();

    if (this.shortcutKey) {
      this.gui.app.drawString(String.fromCharCode(this.shortcutKey), dst.x + 17, dst.y + 3);
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

    const child = this.children.length > 0 ? this.children[0] : null;
    if (child && child instanceof Button) {
      const button = child as Button;
      if ((this.shortcutKey && app.isKeyPressed(this.shortcutKey)) ||
          (this.rect.contains(mouse) && mouse.isClicked())) {
        button.click();
        return true;
      }
    }

    return mouse.down && this.rect.contains(mouse);
  }
}