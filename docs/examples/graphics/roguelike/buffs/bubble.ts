import { Pico8Palette } from 'wglt';
import { Sprite } from 'wglt';
import { StatsActor } from '../entities/statsactor';
import { Buff } from './buff';

const COLOR = Pico8Palette.BLUE;
const SPRITE = new Sprite(96, 272, 16, 16, 2);

export class Bubble extends Buff {
  remaining: number;

  constructor(actor: StatsActor, remaining: number) {
    super(actor);
    this.remaining = remaining;
  }

  modifyDamageTaken(damage: number): number {
    if (damage <= 0) {
      return damage;
    }

    const absorb = Math.min(this.remaining, damage);
    this.remaining -= absorb;
    if (this.remaining <= 0) {
      this.actor.game.log(`Absorbed the last ${absorb} of the bubble!`, COLOR);
    } else {
      this.actor.game.log(`Bubble absorbed ${absorb} damage.`, COLOR);
    }
    return damage - absorb;
  }

  draw(): void {
    const actor = this.actor;
    const game = actor.game;
    const app = game.app;
    SPRITE.draw(app, actor.pixelX - game.viewport.x, actor.pixelY - game.viewport.y);
  }

  isDone(): boolean {
    return this.remaining <= 0;
  }
}
