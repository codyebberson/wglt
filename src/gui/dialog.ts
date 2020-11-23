import { Rect } from '../rect';
import { Point } from '../point';
import { Console } from '../console';
import { Terminal } from '../terminal';

export abstract class Dialog {
  readonly contentsRect: Rect;
  readonly title: string;

  constructor(contentsRect: Rect, title: string) {
    this.contentsRect = contentsRect;
    this.title = title;
  }

  abstract drawContents(console: Console, offset: Point): void;

  abstract handleInput(terminal: Terminal, offset: Point): boolean;
}
