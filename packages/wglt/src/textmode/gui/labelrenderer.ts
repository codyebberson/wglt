import { GUI } from '../../core/gui/gui';
import { Label } from '../../core/gui/label';
import { Renderer } from '../../core/gui/renderer';
import { Terminal } from '../terminal';

export class TerminalLabelRenderer implements Renderer<Terminal, Label> {
  render(gui: GUI<Terminal>, component: Label): void {
    if (!component.text) {
      return;
    }

    const app = gui.context;

    // TODO: Implement halign and valign
    app.console.drawString(
      component.screenRect.x,
      component.screenRect.y,
      component.text,
      component.fg,
      component.bg
    );
  }
}
