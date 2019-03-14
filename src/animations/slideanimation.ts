
import {Entity} from '../entity';

import {Animation} from './animation';

export class SlideAnimation extends Animation {
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
      this.entity.offset.x += this.dx;
      this.entity.offset.y += this.dy;
    }
    if (this.countdown === 0) {
      this.entity.x += this.entity.offset.x / this.entity.game.tileSize.width;
      this.entity.y += this.entity.offset.y / this.entity.game.tileSize.height;
      this.entity.offset.x = 0;
      this.entity.offset.y = 0;
    }
  }
}
