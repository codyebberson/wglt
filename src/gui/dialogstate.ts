import { Console } from '../console';
import { Point } from '../point';
import { Rect } from '../rect';
import { Dialog } from './dialog';

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
