import { fromRgb } from 'wglt';
import { Game } from '../game';
import { BLACKOUT } from '../sprites';
import { Animation } from './animation';

export class FadeOutAnimation extends Animation {
  readonly duration: number;

  constructor(duration: number) {
    super(duration, true);
    this.duration = duration;
  }

  draw(game: Game): void {
    const src = BLACKOUT;
    const x = 1.0 - this.countdown / this.duration;
    const alpha = Math.max(1, Math.min(255, (255.0 * x) | 0));
    const color = fromRgb(0, 0, 0, alpha);
    game.app.drawImage(
      0,
      0,
      src.x,
      src.y,
      src.width,
      src.height,
      color,
      game.app.width,
      game.app.height
    );
  }
}
