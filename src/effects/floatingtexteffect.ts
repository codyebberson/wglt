
import {App} from '../app';
import {Color} from '../color';
import {Colors} from '../colors';
import {Game} from '../game';

import {Effect} from './effect';

export class FloatingTextEffect extends Effect {
  readonly str: string;
  readonly pixelX: number;
  readonly pixelY: number;
  readonly color: Color;

  constructor(str: string, pixelX: number, pixelY: number, color?: Color) {
    super(40, false);
    this.str = str;
    this.pixelX = pixelX;
    this.pixelY = pixelY;
    this.color = color || Colors.WHITE;
  }

  draw(game: Game) {
    const frame = 40 - this.countdown;
    const x = this.pixelX - game.viewport.x;
    const y = this.pixelY - game.viewport.y;
    const y2 = y - Math.min(4, Math.floor(frame / 2));
    game.app.drawCenteredString(this.str, x, y2, this.color);
  }
}
