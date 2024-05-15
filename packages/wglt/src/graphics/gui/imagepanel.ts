import { Rect } from '../../core/rect';
import { Panel } from './panel';

export class ImagePanel extends Panel {
  readonly srcRect: Rect;

  constructor(srcRect: Rect, destRect: Rect) {
    super(destRect);
    this.srcRect = srcRect;
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }

    const src = this.srcRect;
    const dst = this.rect;
    this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
  }
}
