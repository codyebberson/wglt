import { BaseApp } from '../../core/baseapp';
import { Dialog } from '../../core/gui/dialog';
import { DialogRenderer } from '../../core/gui/dialogrenderer';
import { Rect } from '../../core/rect';

export class GraphicsDialogRenderer implements DialogRenderer {
  // baseRect: Rect;
  // closeButtonRect: Rect;
  // buttonSlotRect: Rect;

  // constructor(baseRect: Rect, closeButtonRect?: Rect) {
  //   this.baseRect = baseRect;
  //   this.closeButtonRect = closeButtonRect;

  //   // this.gui.renderer.baseRect = new Rect(0, 32, 48, 48);
  //   // this.gui.renderer.buttonSlotRect = new Rect(48, 32, 24, 24);
  // }

  constructor(
    readonly baseRect: Rect,
    readonly closeButtonRect: Rect,
    readonly buttonSlotRect: Rect
  ) {}

  drawFrame(app: BaseApp, rect: Rect): void {
    // Draws the dialog chrome using a 3x3 grid
    // 0   1   2   3
    //   x   x   x
    // 1
    //   x   x   x
    // 2
    //   x   x   x
    // 3

    // Source image is the baseRect
    const sx0 = this.baseRect.x;
    const sy0 = this.baseRect.y;
    const sw = (this.baseRect.width / 3) | 0;
    const sh = (this.baseRect.height / 3) | 0;
    const sx1 = sx0 + sw;
    const sy1 = sy0 + sh;
    const sx2 = sx0 + 2 * sw;
    const sy2 = sy0 + 2 * sw;

    // Destination rect is the dialog
    const dx0 = rect.x;
    const dy0 = rect.y;
    const dw = rect.width - 2 * sw;
    const dh = rect.height - 2 * sh;
    const dx1 = dx0 + sw;
    const dy1 = dy0 + sh;
    const dx2 = dx1 + dw;
    const dy2 = dy1 + dh;

    // Top-left corner
    app.drawImage(dx0, dy0, sx0, sy0, sw, sh, undefined, sw, sh);

    // Top edge
    app.drawImage(dx1, dy0, sx1, sy0, sw, sh, undefined, dw, sh);

    // Top-right corner
    app.drawImage(dx2, dy0, sx2, sy0, sw, sh, undefined, sw, sh);

    // Left edge
    app.drawImage(dx0, dy1, sx0, sy1, sw, sh, undefined, sw, dh);

    // Center
    app.drawImage(dx1, dy1, sx1, sy1, sw, sh, undefined, dw, dh);

    // Right edge
    app.drawImage(dx2, dy1, sx2, sy1, sw, sh, undefined, sw, dh);

    // Bottom-left corner
    app.drawImage(dx0, dy2, sx0, sy2, sw, sh, undefined, sw, sh);

    // Bottom edge
    app.drawImage(dx1, dy2, sx1, sy2, sw, sh, undefined, dw, sh);

    // Bottom-right corner
    app.drawImage(dx2, dy2, sx2, sy2, sw, sh, undefined, sw, sh);
  }

  draw(app: BaseApp, dialog: Dialog): void {
    this.drawFrame(app, dialog.rect);
    if (this.closeButtonRect && dialog.closeButton) {
      const w = this.closeButtonRect.width;
      const h = this.closeButtonRect.height;
      const dx = dialog.rect.x2 - w;
      const dy = dialog.rect.y;
      const sx = this.closeButtonRect.x;
      const sy = this.closeButtonRect.y;
      app.drawImage(dx, dy, sx, sy, w, h);
    }
  }
}
