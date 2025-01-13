import { Sprite } from 'wglt';
import { Actor } from '../actor';
import { Game } from '../game';

export class Fighter extends Actor {
  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite) {
    super(game, x, y, name, sprite, true);
  }

  onAttack(target: Actor, damage: number) {
    if (damage > 0) {
      this.game.log(`${this.name} attacks ${target.name} for ${damage} hit points.`, 0x808080ff);
    } else {
      this.game.log(`${this.name} attacks ${target.name} but it has no effect!`, 0x808080ff);
    }
  }
}
