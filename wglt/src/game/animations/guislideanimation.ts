import { Point } from '../../core/point';
import { Sprite } from '../../core/sprite';
import { BaseGame } from '../basegame';
import { Animation } from './animation';

export class GuiSlideAnimation extends Animation {
  readonly sprite: Sprite;
  readonly start: Point;
  readonly end: Point;
  readonly duration: number;

  constructor(sprite: Sprite, start: Point, end: Point, duration: number) {
    super(duration, false);
    this.sprite = sprite;
    this.start = start;
    this.end = end;
    this.duration = duration;
  }

  draw(game: BaseGame): void {
    const f = this.countdown / this.duration;
    const x = f * this.start.x + (1.0 - f) * this.end.x;
    const y = f * this.start.y + (1.0 - f) * this.end.y;
    this.sprite.draw(game.app, x, y);
  }
}
