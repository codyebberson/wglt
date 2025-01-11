import { Dialog } from '../../core/gui/dialog';
import { GUI } from '../../core/gui/gui';
import { Renderer } from '../../core/gui/renderer';
import { SimplePalette } from '../../core/palettes/simple';
import { Terminal } from '../terminal';

export class TerminalDialogRenderer implements Renderer<Terminal, Dialog> {
  render(gui: GUI<Terminal>, component: Dialog): void {
    const app = gui.context;

    app.console.fillRect(
      component.rect.x,
      component.rect.y,
      component.rect.width,
      component.rect.height,
      0,
      SimplePalette.WHITE,
      SimplePalette.BLACK
    );

    app.console.drawDoubleBox(
      component.rect.x,
      component.rect.y,
      component.rect.width,
      component.rect.height
    );

    if (component.title) {
      app.console.drawString(
        component.rect.x + 2,
        component.rect.y,
        component.title,
        SimplePalette.YELLOW
      );
    }

    gui.drawChildren(component);
  }
}
