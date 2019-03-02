import {Rect} from '../rect';

import {Panel} from './panel';

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
    return false;
  }

  close() {
    if (!this.gui) {
      return;
    }
    this.gui.remove(this);
  }
}
