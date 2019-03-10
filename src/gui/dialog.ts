import {Rect} from '../rect';

import {Panel} from './panel';
import {Keys} from '../keys';

export class Dialog extends Panel {
  closeButton: boolean;

  constructor(rect: Rect) {
    super(rect);
    this.closeButton = false;
  }

  drawContents() {
    if (!this.gui) {
      return;
    }
    this.gui.renderer.draw(this.gui.app, this);
  }

  handleInput() {
    if (!this.gui) {
      return false;
    }

    if (this.handleChildrenInput()) {
      return true;
    }

    if (this.gui.app.isKeyPressed(Keys.VK_ESCAPE)) {
      this.visible = false;
      return true;
    }

    const mouse = this.gui.app.mouse;
    if (mouse.isClicked() && !this.rect.contains(mouse)) {
      this.visible = false;
      return true;
    }

    return false;
  }

  close() {
    if (!this.gui) {
      return;
    }
    this.gui.remove(this);
  }
}
