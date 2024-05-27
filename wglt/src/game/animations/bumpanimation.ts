import { Entity } from '../entity';
import { Animation } from './animation';

const DURATION = 12;

export class BumpAnimation extends Animation {
  readonly entity: Entity;
  readonly dx: number;
  readonly dy: number;

  constructor(entity: Entity, target: Entity) {
    super(DURATION, true);
    this.entity = entity;
    this.dx = target.x - entity.x;
    this.dy = target.y - entity.y;
  }

  update(): void {
    const t = DURATION - this.countdown;

    if (t >= 0 && t < 4) {
      this.entity.offset.x += this.dx;
      this.entity.offset.y += this.dy;
    }

    if (t >= 4 && t < 8) {
      this.entity.offset.x -= this.dx;
      this.entity.offset.y -= this.dy;
    }

    super.update();
  }
}
