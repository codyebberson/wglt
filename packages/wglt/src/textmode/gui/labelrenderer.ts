import { GUI } from '../../core/gui/gui';
import { alignStart, Label } from '../../core/gui/label';
import type { Renderer } from '../../core/gui/renderer';
import { Terminal } from '../terminal';

export class TerminalLabelRenderer implements Renderer<Terminal, Label> {
  render(gui: GUI<Terminal>, component: Label): void {
    if (!component.text) {
      return;
    }

    const app = gui.context;
    const rect = component.screenRect;

    // Text-mode extents are measured in cells: width is the longest line, and
    // height is the number of lines (Console.drawString splits on newlines).
    const lines = component.text.split('\n');
    let textWidth = 0;
    for (const line of lines) {
      textWidth = Math.max(textWidth, line.length);
    }

    const x = alignStart(rect.x, rect.width, textWidth, component.halign);
    const y = alignStart(rect.y, rect.height, lines.length, component.valign);

    app.console.drawString(x, y, component.text, component.fg, component.bg);
  }
}
