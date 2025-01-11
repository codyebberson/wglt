import { GUI } from '../../core/gui/gui';
import { Renderer } from '../../core/gui/renderer';
import { SelectInput } from '../../core/gui/selectinput';
import { SimplePalette } from '../../core/palettes/simple';
import { Terminal } from '../terminal';

export class TerminalSelectInputRenderer implements Renderer<Terminal, SelectInput> {
  render(gui: GUI<Terminal>, input: SelectInput): void {
    const terminal = gui.context;
    const x = input.screenRect.x;
    const y = input.screenRect.y;

    for (let i = 0; i < input.options.length; i++) {
      const str = `${String.fromCharCode(65 + i)} - ${input.options[i].name}`;
      const selected = i === input.selectedIndex;
      const fg = selected ? SimplePalette.BLACK : SimplePalette.WHITE;
      const bg = selected ? SimplePalette.WHITE : SimplePalette.BLACK;
      terminal.console.drawString(x, y + i, str, fg, bg);
    }
  }
}
