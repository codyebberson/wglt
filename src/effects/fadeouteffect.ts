import {fromRgb} from '../color';
import {Game} from '../game';

import {Effect} from './effect';

export class FadeOutEffect extends Effect {
  readonly duration: number;

  constructor(duration: number) {
    super(duration, true);
    this.duration = duration;
  }

  draw(game: Game) {
    const x = 1.0 - this.countdown / this.duration;
    const alpha = Math.max(1, Math.min(255, (255.0 * x) | 0));
    const color = fromRgb(0, 0, 0, alpha);
    game.app.drawImage(0, 0, 0, 32, 16, 16, color, game.app.size.width, game.app.size.height);
  }
}
