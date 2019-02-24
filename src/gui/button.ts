import {GUI} from '../gui';
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
    this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
  }

  handleInput() {
    if (!this.gui) {
      return false;
    }

    const app = this.gui.app;
    const mouse = app.mouse;

    if (this.onClick &&
        ((this.shortcutKey && app.isKeyPressed(this.shortcutKey)) ||
         (this.rect.contains(mouse) && mouse.isClicked()))) {
      this.onClick();
      return true;
    }

    return this.rect.contains(mouse);
  }
}