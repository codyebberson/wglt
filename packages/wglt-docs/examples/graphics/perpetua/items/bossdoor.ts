import { Monster } from '../entities/monster';
import { Player } from '../entities/player';
import { Game } from '../game';
import { Door } from './door';

export class BossDoor extends Door {
  readonly boss: Monster;

  constructor(game: Game, x: number, y: number, boss: Monster) {
    super(game, x, y);
    this.boss = boss;
    this.zIndex = 0;
  }

  onBump(player: Player): boolean {
    if (this.boss.hp <= 0) {
      // Boss is dead
      this.openDoor();
      player.moveTo(this.x, this.y);
      return true;
    }

    const dotProduct =
      (this.x - player.x) * (this.boss.x - player.x) +
      (this.y - player.y) * (this.boss.y - player.y);

    if (dotProduct > 0) {
      // Walking toward the boss
      const dx = this.x - player.x;
      const dy = this.y - player.y;
      player.move(dx * 2, dy * 2);
      player.game.log('The door slams shut behind you.');
      return true;
    }

    // Otherwise, door is locked
    return false;
  }
}
