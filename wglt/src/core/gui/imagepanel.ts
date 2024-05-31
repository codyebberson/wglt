import { Container } from '../../core/gui/container';
import { Rect } from '../../core/rect';
import { BaseApp } from '../baseapp';

export class ImagePanel extends Container {
  readonly srcRect: Rect;

  constructor(srcRect: Rect, destRect: Rect) {
    super(destRect);
    this.srcRect = srcRect;
  }

  draw(app: BaseApp): void {
    const src = this.srcRect;
    const dst = this.rect;
    app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
  }
}
