import { Rect, fromRgb } from 'wglt';
import { Game } from '../game';
import { Animation, AnimationFunction } from './animation';

export class FadeInAnimation extends Animation {
  constructor(
    readonly duration: number,
    readonly fillRect: Rect,
    onDone?: AnimationFunction
  ) {
    super(duration, true, onDone);
  }

  draw(game: Game): void {
    const app = game.app;
    const src = this.fillRect;
    const x = this.countdown / this.duration;
    const alpha = Math.max(1, Math.min(255, (255.0 * x) | 0));
    const color = fromRgb(0, 0, 0, alpha);
    app.drawImage(
      x,
      0,
      src.x,
      src.y,
      src.width,
      src.height,
      color,
      app.size.width,
      app.size.height
    );
  }
}
