import { Entity } from '../entity';
import { Animation, AnimationFunction } from './animation';

export class SlideAnimation extends Animation {
  readonly entity: Entity;
  readonly dx: number;
  readonly dy: number;

  constructor(entity: Entity, dx: number, dy: number, count: number, onDone?: AnimationFunction) {
    super(count, true, onDone);
    this.entity = entity;
    this.dx = dx;
    this.dy = dy;
  }

  update(): void {
    this.countdown--;
    if (this.countdown >= 0) {
      this.entity.offset.x += this.dx;
      this.entity.offset.y += this.dy;
    }
    if (this.countdown === 0) {
      this.entity.offset.x = 0;
      this.entity.offset.y = 0;
    }
  }
}
