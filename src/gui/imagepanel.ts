import {GUI} from '../gui';
import {Rect} from '../rect';

import {Panel} from './panel';

export class ImagePanel extends Panel {
  readonly srcRect: Rect;

  constructor(gui: GUI, srcRect: Rect, destRect: Rect) {
    super(gui, destRect);
    this.srcRect = srcRect;
  }

  drawContents() {
    const src = this.srcRect;
    const dst = this.rect;
    this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
  }
}