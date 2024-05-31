import { Point } from '../../core/point';
import { Sprite } from '../../core/sprite';
import { BaseGame } from '../basegame';
import { Animation, AnimationFunction } from './animation';

export class ProjectileAnimation extends Animation {
  readonly sprite: Sprite;
  readonly position: Point;
  readonly velocity: Point;
  readonly duration: number;

  constructor(
    sprite: Sprite,
    position: Point,
    velocity: Point,
    duration: number,
    onDone?: AnimationFunction
  ) {
    super(duration, true, onDone);
    this.sprite = sprite;
    this.position = position;
    this.velocity = velocity;
    this.duration = duration;
  }

  update(): void {
    super.update();
    this.position.add(this.velocity);
  }

  draw(game: BaseGame): void {
    const x = this.position.x - game.viewport.x;
    const y = this.position.y - game.viewport.y;
    this.sprite.draw(game.app, x, y);
  }
}
