import { fromRgb } from '@wglt/core';
import { BaseGame } from '../basegame';
import { Animation, AnimationFunction } from './animation';

export class FadeOutAnimation extends Animation {
  readonly duration: number;

  constructor(duration: number, onDone?: AnimationFunction) {
    super(duration, true, onDone);
    this.duration = duration;
  }

  draw(game: BaseGame): void {
    const x = 1.0 - this.countdown / this.duration;
    const alpha = Math.max(1, Math.min(255, (255.0 * x) | 0));
    const color = fromRgb(0, 0, 0, alpha);
    game.app.fillRect(0, 0, game.app.size.width, game.app.size.height, color);
  }
}
