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
    if (!app) {
      return;
    }

    let x = component.rect.x;
    let y = component.rect.y;

    if (component.parent) {
      x += component.parent.rect.x;
      y += component.parent.rect.y;
    }

    // TODO: Implement halign and valign
    app.console.drawString(x, y, component.text, component.fg, component.bg);
  }
}
