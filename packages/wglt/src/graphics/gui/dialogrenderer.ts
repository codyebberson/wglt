import { Dialog } from '../../core/gui/dialog.ts';
import { GUI } from '../../core/gui/gui.ts';
import type { Renderer } from '../../core/gui/renderer.ts';
import { Rect } from '../../core/rect.ts';
import { GraphicsApp } from '../graphicsapp.ts';

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
