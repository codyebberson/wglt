import { Sprite } from 'wglt';
import { Actor } from '../actor';
import { BasicMonster } from '../ai/basicmonster';
import { Game } from '../game';
import { Sprites } from '../sprites';
import { Fighter } from './fighter';
import { Player } from './player';

export class Monster extends Fighter {
  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite) {
    super(game, x, y, name, sprite);
    this.hp = 20;
    this.ai = new BasicMonster(this, calculateDamage);
  }

  onBump(player: Actor): boolean {
    player.attack(this, 10);
    return true;
  }

  onDeath(): void {
    this.game.log(`${this.name} is dead`);
    this.blocks = false;
    this.ai = undefined;
    this.name = `remains of ${this.name}`;
    this.sendToBack();

    const xpGain = 10;
    const player = this.game.player as Player;
    player.xp += xpGain;

    while (player.xp >= player.maxXp) {
      player.level++;
      player.xp = 0;
      player.maxXp *= 2;
      this.game.log(`You reached level ${player.level}`, 0xff8000ff);
    }
  }
}

export class Orc extends Monster {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Orc', Sprites.ORC);
  }
}

export class Troll extends Monster {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Troll', Sprites.TROLL);
  }
}

function calculateDamage(_attacker: Actor, _target: unknown): number {
  return 10;
}
