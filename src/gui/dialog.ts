import { Console } from '../console';
import { Point } from '../point';
import { Rect } from '../rect';
import { Terminal } from '../terminal';

export abstract class Dialog {
  constructor(
    readonly contentsRect: Rect,
    readonly title: string
  ) {}

  abstract drawContents(console: Console, offset: Point): void;

  abstract handleInput(terminal: Terminal, offset: Point): boolean;
}
