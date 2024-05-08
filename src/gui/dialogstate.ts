import type { Console } from '../console';
import type { Point } from '../point';
import type { Rect } from '../rect';
import type { Dialog } from './dialog';

export class DialogState {
  open = false;
  count = 0;
  buffer?: Console;

  constructor(
    readonly dialog: Dialog,
    readonly rect: Rect,
    readonly contentsOffset: Point
  ) {}
}
