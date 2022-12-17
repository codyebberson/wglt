import { Console } from '../console';
import { Key } from '../keys';
import { Colors } from '../palettes/colors';
import { Point } from '../point';
import { Rect } from '../rect';
import { Terminal } from '../terminal';
import { Dialog } from './dialog';

export class SelectDialog extends Dialog {
  readonly options: string[];
  readonly callback: (i: number) => void;
  protected hoverIndex: number;

  constructor(title: string, options: string[], callback: (i: number) => void) {
    let width = title.length;
    for (let i = 0; i < options.length; i++) {
      width = Math.max(width, options[i].length + 4);
    }

    const height = options.length;
    const rect = new Rect(0, 0, width, height);
    super(rect, title);
    this.options = options;
    this.callback = callback;
    this.hoverIndex = -1;
  }

  drawContents(console: Console, offset: Point): void {
    for (let i = 0; i < this.options.length; i++) {
      const str = String.fromCharCode(65 + i) + ' - ' + this.options[i];
      if (i === this.hoverIndex) {
        console.drawString(offset.x, offset.y + i, str, Colors.BLACK, Colors.WHITE);
      } else {
        console.drawString(offset.x, offset.y + i, str, Colors.WHITE, Colors.BLACK);
      }
    }
  }

  handleInput(terminal: Terminal, offset: Point): boolean {
    const moveKey = terminal.getMovementKey();
    if (moveKey && moveKey.y !== 0) {
      this.hoverIndex = (this.hoverIndex + this.options.length + moveKey.y) % this.options.length;
    }
    if (this.hoverIndex >= 0 && (terminal.isKeyPressed(Key.VK_ENTER) || terminal.isKeyPressed(Key.VK_NUMPAD_ENTER))) {
      this.callback(this.hoverIndex);
      return true;
    }
    if (
      terminal.mouse.x >= offset.x &&
      terminal.mouse.x < offset.x + this.contentsRect.width &&
      terminal.mouse.y >= offset.y &&
      terminal.mouse.y < offset.y + this.contentsRect.height
    ) {
      this.hoverIndex = terminal.mouse.y - offset.y;
      if (terminal.mouse.buttons.get(0).isClicked()) {
        terminal.mouse.buttons.clear();
        this.callback(this.hoverIndex);
        return true;
      }
    }
    const startCharCode = 'A'.charCodeAt(0);
    for (let i = 0; i < this.options.length; i++) {
      if (terminal.isKeyPressed(('Key' + String.fromCharCode(startCharCode + i)) as Key)) {
        this.callback(i);
        return true;
      }
    }
    return terminal.isKeyPressed(Key.VK_ESCAPE);
  }

  isMouseOverOption(terminal: Terminal, offset: Point, index: number): boolean {
    return (
      terminal.mouse.x >= offset.x &&
      terminal.mouse.x < offset.x + this.contentsRect.width &&
      terminal.mouse.y === offset.y + index
    );
  }
}
