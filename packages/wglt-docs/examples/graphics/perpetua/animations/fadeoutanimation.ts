import { fromRgb, Rect } from 'wglt';
import type { Game } from '../game';
import type { AnimationFunction } from './animation';
import { Animation } from './animation';

export class FadeOutAnimation extends Animation {
  readonly duration: number;
  readonly fillRect: Rect;

  constructor(duration: number, fillRect: Rect, onDone?: AnimationFunction) {
    super(duration, true, onDone);
    this.duration = duration;
    this.fillRect = fillRect;
  }

  draw(game: Game): void {
    const app = game.app;
    const src = this.fillRect;
    const x = 1.0 - this.countdown / this.duration;
    const alpha = Math.max(1, Math.min(255, (255.0 * x) | 0));
    const color = fromRgb(0, 0, 0, alpha);
    app.drawImage(x, 0, src.x, src.y, src.width, src.height, color, app.width, app.height);
  }
}
