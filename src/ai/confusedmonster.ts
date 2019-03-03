import {Actor} from '../actor';

import {AI} from './ai';

export class ConfusedMonster extends AI {
  numTurns: number;
  oldAi?: AI;

  constructor(actor: Actor) {
    super(actor);
    this.numTurns = 10;
    this.oldAi = actor.ai;
  }

  doAi() {
    if (this.numTurns > 0) {
      // Still confused...
      // Move in a random direction, and decrease the number of turns confused
      const rng = this.actor.game.rng;
      this.actor.move(rng.nextRange(-1, 2), rng.nextRange(-1, 2));
      this.numTurns--;
    } else {
      this.actor.ai = this.oldAi;
    }
  }
}
