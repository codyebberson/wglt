import { Color } from '../../core/color';
import { Actor } from '../actor';
import { BaseGame } from '../basegame';
import { Animation } from './animation';

const DURATION = 40;

export class FloatingTextAnimation extends Animation {
  readonly actor: Actor;
  readonly str: string;
  readonly color: Color;

  constructor(actor: Actor, str: string, color: Color) {
    super(DURATION, false);
    this.actor = actor;
    this.str = str;
    this.color = color;
  }

  draw(game: BaseGame): void {
    const frame = DURATION - this.countdown;
    const x = this.actor.pixelX + ((this.actor.sprite.width / 2) | 0) - game.viewport.x;
    const y = this.actor.pixelY - 3 - game.viewport.y;
    const y2 = y - Math.min(4, Math.floor(frame / 2));
    game.app.drawCenteredString(x, y2, this.str, this.color);
  }
}
