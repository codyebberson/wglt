import {Key} from '../keys';
import {Rect} from '../rect';

import {Button} from './button';
import {Panel} from './panel';

export class ButtonSlot extends Panel {
  readonly srcRect: Rect;
  shortcutKey?: Key;

  constructor(srcRect: Rect, destRect: Rect, shortcutKey?: Key) {
    super(destRect);
    this.srcRect = srcRect;
    this.shortcutKey = shortcutKey;
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    const src = this.srcRect;
    const dst = this.rect;
    this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);

    this.drawChildren();
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

    return this.rect.contains(mouse);
  }
}