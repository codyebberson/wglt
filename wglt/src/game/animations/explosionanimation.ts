import { Sprite } from '../../core/sprite';
import { Vec2 } from '../../core/vec2';
import { BaseGame } from '../basegame';
import { Animation, AnimationFunction } from './animation';
import { ProjectileAnimation } from './projectileanimation';

export class ExplosionAnimation extends Animation {
  readonly game: BaseGame;
  readonly center: Vec2;
  readonly radius: number;
  readonly duration: number;
  readonly sprites: Sprite[];

  constructor(
    game: BaseGame,
    center: Vec2,
    radius: number,
    duration: number,
    onDone?: AnimationFunction
  ) {
    super(duration, true, onDone);
    this.game = game;
    this.center = center;
    this.radius = radius;
    this.duration = duration;
    this.sprites = [];
  }

  update(): void {
    super.update();

    const game = this.game;
    const maxRadius = this.radius * (1.0 - (this.countdown + 1) / (this.duration + 1));
    const centerX = this.center.x * game.tileSize.width;
    const centerY = this.center.y * game.tileSize.height;

    for (let i = 0; i < 3; i++) {
      const radius = maxRadius;
      const angle = this.countdown + i;
      const x = centerX + game.tileSize.width * radius * Math.cos(angle);
      const y = centerY + game.tileSize.height * radius * Math.sin(angle);
      const explosion = new Sprite(512, 336, 16, 16, 4, false, 4);
      const animation = new ProjectileAnimation(explosion, new Vec2(x, y), new Vec2(0, 0), 16);
      animation.blocking = false;
      game.animations.push(animation);
    }
  }
}
