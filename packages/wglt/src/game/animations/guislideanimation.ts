import { Vec2 } from '../../core/vec2';
import { Sprite } from '../../graphics/sprite';
import { BaseGame } from '../basegame';
import { Animation } from './animation';

export class GuiSlideAnimation extends Animation {
  readonly sprite: Sprite;
  readonly start: Vec2;
  readonly end: Vec2;
  readonly duration: number;

  constructor(sprite: Sprite, start: Vec2, end: Vec2, duration: number) {
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
