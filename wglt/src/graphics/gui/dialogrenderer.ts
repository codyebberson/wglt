import { Dialog } from '../../core/gui/dialog';
import { GUI } from '../../core/gui/gui';
import { Renderer } from '../../core/gui/renderer';
import { Rect } from '../../core/rect';
import { GraphicsApp } from '../graphicsapp';

export class GraphicsDialogRenderer implements Renderer<GraphicsApp, Dialog> {
  constructor(readonly sourceRect: Rect) {}

  render(gui: GUI<GraphicsApp>, component: Dialog): void {
    const app = gui.context;
    app.drawAutoRect(this.sourceRect, component.rect);
    gui.drawChildren(component);
  }
}
