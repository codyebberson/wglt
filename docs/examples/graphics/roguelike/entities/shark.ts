import { Sprite } from 'wglt';
import { AI } from 'wglt';
import { Game } from '../game';
import { Monster } from './monster';

const SPRITE = new Sprite(96, 272, 16, 16, 2);

class SharkAI extends AI {
  doAi(): void {
    const shark = this.actor as Shark;
    const player = shark.game.player;
    if (!player) {
      return;
    }

    if (shark.distanceTo(player) < 2) {
      shark.attack(player, shark.getDamage());
    }
  }
}

export class Shark extends Monster {
  constructor(game: Game, x: number, y: number, level: number) {
    super(game, x, y, 'Shark', SPRITE, level);
    this.ai = new SharkAI(this);
  }
}
