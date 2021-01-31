import { Colors } from '../../src/colors';
import { Actor } from './actor';

const CONFUSE_NUM_TURNS = 10;

export interface AI {
  owner?: Actor;
  takeTurn(): void;
}

export class BasicMonster implements AI {
  owner?: Actor;

  constructor() {
    this.owner = undefined;
  }

  takeTurn(): void {
    const monster = this.owner;
    if (!monster) {
      return;
    }

    const game = monster.game;
    const player = game.player;

    // A basic monster takes its turn. if you can see it, it can see you
    if (game.map.isVisible(monster.x, monster.y)) {

      if (monster.distanceTo(player) >= 2) {
        // Move towards player if far away
        monster.moveToward(player.x, player.y);

      } else if (player.hp > 0) {
        // Close enough, attack! (if the player is still alive.)
        monster.attack(player);
      }
    }
  }
}

export class ConfusedMonster implements AI {
  owner?: Actor;
  oldAi: AI;
  numTurns: number;

  constructor(oldAi: AI) {
    this.owner = undefined;
    this.oldAi = oldAi;
    this.numTurns = CONFUSE_NUM_TURNS;
  }

  takeTurn(): void {
    if (!this.owner) {
      return;
    }
    const game = this.owner.game;
    if (this.numTurns > 0) {
      // Still confused...
      // Move in a random direction, and decrease the number of turns confused
      const rng = game.rng;
      this.owner.move(rng.nextRange(-1, 1), rng.nextRange(-1, 1));
      this.numTurns--;
    } else {
      this.owner.ai = this.oldAi;
      game.addMessage('The ' + this.owner.name + ' is no longer confused!', Colors.LIGHT_RED);
    }
  }
}
