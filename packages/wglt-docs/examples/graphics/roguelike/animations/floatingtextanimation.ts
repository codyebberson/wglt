import type { Color, Font } from 'wglt';
import type { Actor } from '../actor';
import type { Game } from '../game';
import { Palette } from '../palette';
import { Animation } from './animation';

const DURATION = 40;

export class FloatingTextAnimation extends Animation {
  readonly actor: Actor;
  readonly font: Font;
  readonly str: string;
  readonly color: Color;

  constructor(actor: Actor, font: Font, str: string, color?: Color) {
    super(DURATION, false);
    this.actor = actor;
    this.font = font;
    this.str = str;
    this.color = color || Palette.WHITE;
  }

  draw(game: Game): void {
    const frame = DURATION - this.countdown;
    const x = this.actor.pixelX + ((this.actor.sprite.width / 2) | 0) - game.viewport.x;
    const y = this.actor.pixelY - 3 - game.viewport.y;
    const y2 = y - Math.min(4, Math.floor(frame / 2));
    game.app.drawCenteredString(this.font, x, y2, this.str, this.color);
  }
}
