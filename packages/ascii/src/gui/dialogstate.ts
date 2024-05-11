import { Point, Rect } from '@wglt/core';
import { Console } from '../console';
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
