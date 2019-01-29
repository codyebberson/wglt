
import {Entity} from '../entity';

import {Effect} from './effect';

export class SlideEffect extends Effect {
  readonly entity: Entity;
  readonly dx: number;
  readonly dy: number;

  constructor(entity: Entity, dx: number, dy: number, count: number) {
    super(count, true);
    this.entity = entity;
    this.dx = dx;
    this.dy = dy;
  }

  update() {
    this.countdown--;
    if (this.countdown >= 0) {
      this.entity.offsetX += this.dx;
      this.entity.offsetY += this.dy;
    }
    if (this.countdown === 0) {
      this.entity.x += this.entity.offsetX / this.entity.game.tileWidth;
      this.entity.y += this.entity.offsetY / this.entity.game.tileHeight;
      this.entity.offsetX = 0;
      this.entity.offsetY = 0;
    }
  }
}
