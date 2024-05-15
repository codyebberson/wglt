import { Point } from '../../core/point';
import { Rect } from '../../core/rect';
import { Console } from '../console';
import { Terminal } from '../terminal';

export abstract class Dialog {
  constructor(
    readonly contentsRect: Rect,
    readonly title: string
  ) {}

  abstract drawContents(console: Console, offset: Point): void;

  abstract handleInput(terminal: Terminal, offset: Point): boolean;
}
