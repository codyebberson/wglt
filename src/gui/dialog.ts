import type { Console } from '../console';
import type { Point } from '../point';
import type { Rect } from '../rect';
import type { Terminal } from '../terminal';

export abstract class Dialog {
  constructor(
    readonly contentsRect: Rect,
    readonly title: string
  ) {}

  abstract drawContents(console: Console, offset: Point): void;

  abstract handleInput(terminal: Terminal, offset: Point): boolean;
}
