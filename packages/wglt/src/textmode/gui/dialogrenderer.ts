import { Dialog } from '../../core/gui/dialog.ts';
import { GUI } from '../../core/gui/gui.ts';
import type { Renderer } from '../../core/gui/renderer.ts';
import { SimplePalette } from '../../core/palettes/simple.ts';
import { Terminal } from '../terminal.ts';

export class TerminalDialogRenderer implements Renderer<Terminal, Dialog> {
  render(gui: GUI<Terminal>, component: Dialog): void {
    const app = gui.context;

    app.console.fillRect(
      component.screenRect.x,
      component.screenRect.y,
      component.screenRect.width,
      component.screenRect.height,
      0,
      SimplePalette.WHITE,
      SimplePalette.BLACK
    );

    app.console.drawDoubleBox(
      component.screenRect.x,
      component.screenRect.y,
      component.screenRect.width,
      component.screenRect.height
    );

    if (component.title) {
      app.console.drawString(
        component.screenRect.x + 2,
        component.screenRect.y,
        ` ${component.title} `,
        SimplePalette.YELLOW
      );
    }

    gui.drawChildren(component);
  }
}
