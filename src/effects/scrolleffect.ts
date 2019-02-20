import {Rect} from '../rect';

import {Effect} from './effect';

export class ScrollEffect extends Effect {
  readonly viewport: Rect;
  readonly dx: number;
  readonly dy: number;

  constructor(entity: Rect, dx: number, dy: number, count: number) {
    super(count, true);
    this.viewport = entity;
    this.dx = dx;
    this.dy = dy;
  }

  update() {
    this.countdown--;
    if (this.countdown >= 0) {
      this.viewport.x += this.dx;
      this.viewport.y += this.dy;
    }
  }
}
