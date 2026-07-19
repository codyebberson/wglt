import { Dialog } from '../../core/gui/dialog';
import { GUI } from '../../core/gui/gui';
import type { Renderer } from '../../core/gui/renderer';
import { Rect } from '../../core/rect';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsDialogRenderer implements Renderer<GraphicsApp, Dialog> {
  readonly sourceRect: Rect;

  constructor(sourceRect: Rect) {
    this.sourceRect = sourceRect;
  }

  render(gui: GUI<GraphicsApp>, component: Dialog): void {
    const app = gui.context;
    app.drawAutoRect(this.sourceRect, component.screenRect);
    gui.drawChildren(component);
  }
}
