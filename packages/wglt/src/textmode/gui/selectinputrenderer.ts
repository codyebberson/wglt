import { GUI } from '../../core/gui/gui';
import { Renderer } from '../../core/gui/renderer';
import { SelectInput } from '../../core/gui/selectinput';
import { SimplePalette } from '../../core/palettes/simple';
import { Terminal } from '../terminal';

export class TerminalSelectInputRenderer implements Renderer<Terminal, SelectInput> {
  render(gui: GUI<Terminal>, input: SelectInput): void {
    const terminal = gui.context;

    // Set the margin and line height
    input.margin = 0;
    input.lineHeight = 1;

    const x = input.screenRect.x;
    const y = input.screenRect.y;

    const mouse = terminal.mouse;
    const mouseMoved = mouse.dx !== 0 || mouse.dy !== 0;
    if (mouseMoved && mouse.x >= x && mouse.x < x + input.screenRect.width) {
      const index = Math.floor(mouse.y - y);
      if (index >= 0 && index < input.options.length) {
        input.selectedIndex = index;
      }
    }

    for (let i = 0; i < input.options.length; i++) {
      const str = `${String.fromCharCode(65 + i)} - ${input.options[i].name}`;
      const selected = i === input.selectedIndex;
      const fg = selected ? SimplePalette.BLACK : SimplePalette.WHITE;
      const bg = selected ? SimplePalette.WHITE : SimplePalette.BLACK;
      terminal.console.drawString(x, y + i, str, fg, bg);
    }
  }
}
