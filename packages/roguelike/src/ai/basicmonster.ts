import { Actor } from '../actor';
import { AI } from './ai';

const DEFAULT_DAMAGE = 1;

export class BasicMonster extends AI {
  damageFunc?: (attacker: Actor, target: Actor) => number;

  constructor(actor: Actor, damageFunc?: (attacker: Actor, target: Actor) => number) {
    super(actor);
    this.damageFunc = damageFunc;
  }

  doAi(): void {
    const monster = this.actor;
    const player = monster.game.player;
    if (!player) {
      return;
    }

    if (monster.distanceTo(player) > 1.5) {
      // Move towards player if far away
      monster.moveToward(player.x, player.y);
    } else if (player.hp > 0) {
      // Close enough, attack! (if the player is still alive.)
      const damage = this.damageFunc ? this.damageFunc(monster, player) : DEFAULT_DAMAGE;
      monster.attack(player, damage);
    }
  }
}
