import { Sprite } from 'wglt';
import { StatsActor } from '../entities/statsactor';
import { Buff } from './buff';

const SPRITE = new Sprite(96, 272, 16, 16, 2);

export class Rage extends Buff {
  countdown: number;

  constructor(actor: StatsActor, countdown: number) {
    super(actor);
    this.countdown = countdown;
  }

  update(): void {
    if (this.countdown > 0) {
      this.countdown--;
    }
  }

  modifyDamageDealt(damage: number): number {
    if (damage <= 0) {
      return damage;
    }

    return damage * 2;
  }

  draw(): void {
    const actor = this.actor;
    const game = actor.game;
    const app = game.app;
    SPRITE.draw(app, actor.pixelX - game.viewport.x, actor.pixelY - game.viewport.y);
  }

  isDone(): boolean {
    return this.countdown <= 0;
  }
}
