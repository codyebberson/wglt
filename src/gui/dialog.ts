
import {Colors} from '../colors';
import {Rect} from '../rect';
import {Terminal} from '../terminal';

export abstract class Dialog {
  readonly terminal: Terminal;
  readonly rect: Rect;
  readonly title: string;

  constructor(terminal: Terminal, rect: Rect, title: string) {
    this.terminal = terminal;
    this.rect = rect;
    this.title = title;
  }

  draw(term: Terminal) {
    const {x, y, width, height} = this.rect;
    term.fillRect(x, y, width, height, 0, Colors.WHITE, Colors.BLACK);
    term.drawSingleBox(x, y, width, height);
    term.drawCenteredString(x + (width / 2) | 0, y, ' ' + this.title + ' ');
    this.drawContents();
  }

  abstract drawContents(): void;

  abstract handleInput(): object|boolean;
}
