import {AI} from './ai';

export class BasicMonster extends AI {
  doAi() {
    const monster = this.actor;
    const player = monster.game.player;
    if (!player) {
      return;
    }

    if (monster.distanceTo(player) > 1.0) {
      // Move towards player if far away
      monster.moveToward(player.x, player.y);

    } else if (player.hp > 0) {
      // Close enough, attack! (if the player is still alive.)
      monster.attack(player);
    }
  }
}
