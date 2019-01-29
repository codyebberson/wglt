import {Game} from '../game';
import {Sprite} from '../sprite';
import {Vec2} from '../vec2';

import {Effect} from './effect';

export class ProjectileEffect extends Effect {
  readonly sprite: Sprite;
  readonly position: Vec2;
  readonly velocity: Vec2;
  readonly duration: number;

  constructor(sprite: Sprite, position: Vec2, velocity: Vec2, duration: number) {
    super(duration, true);
    this.sprite = sprite;
    this.position = position;
    this.velocity = velocity;
    this.duration = duration;
  }

  update() {
    super.update();
    this.position.add(this.velocity);
  }

  draw(game: Game) {
    const x = this.position.x - game.viewport.x;
    const y = this.position.y - game.viewport.y;
    this.sprite.draw(game.app, x, y);
  }
}
