import {Actor} from '../actor';
import {Color} from '../color';
import {Colors} from '../colors';
import {Game} from '../game';

import {Effect} from './effect';

export class FloatingTextEffect extends Effect {
  readonly actor: Actor;
  readonly str: string;
  readonly color: Color;

  constructor(actor: Actor, str: string, color?: Color) {
    super(40, false);
    this.actor = actor;
    this.str = str;
    this.color = color || Colors.WHITE;
  }

  draw(game: Game) {
    const frame = 40 - this.countdown;
    const x = this.actor.pixelX + ((this.actor.sprite.width / 2) | 0) - game.viewport.x;
    const y = this.actor.pixelY - 3 - game.viewport.y;
    const y2 = y - Math.min(4, Math.floor(frame / 2));
    game.app.drawCenteredString(this.str, x, y2, this.color);
  }
}
