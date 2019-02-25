import {Key} from '../keys';
import {Rect} from '../rect';

import {Panel} from './panel';

export class Button extends Panel {
  readonly srcRect: Rect;
  shortcutKey?: Key;
  onClick?: Function;

  constructor(srcRect: Rect, destRect: Rect, shortcutKey?: Key, onClick?: Function) {
    super(destRect);
    this.srcRect = srcRect;
    this.shortcutKey = shortcutKey;
    this.onClick = onClick;
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    const src = this.srcRect;
    const dst = this.rect;
    const offsetX = ((dst.width - src.width) / 2) | 0;
    const offsetY = ((dst.height - src.height) / 2) | 0;
    this.gui.app.drawImage(dst.x + offsetX, dst.y + offsetY, src.x, src.y, src.width, src.height);
  }

  handleInput() {
    if (!this.gui) {
      return false;
    }

    const app = this.gui.app;
    const mouse = app.mouse;

    if (this.rect.contains(mouse) && this.rect.contains(mouse.start) && mouse.isDragging()) {
      this.gui.startDragging(this);
      return true;
    }

    if ((this.shortcutKey && app.isKeyPressed(this.shortcutKey)) || (this.rect.contains(mouse) && mouse.isClicked())) {
      this.click();
      return true;
    }

    return mouse.down && this.rect.contains(mouse);
  }

  click() {
    if (this.onClick) {
      this.onClick();
    }
  }
}