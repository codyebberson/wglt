import {Actor} from '../actor';
import {Entity} from '../entity';
import {RNG} from '../rng';

import {AI} from './ai';

export class ConfusedMonster extends AI {
  readonly rng: RNG;
  numTurns: number;
  oldAi?: AI;

  constructor(actor: Actor) {
    super(actor);
    this.rng = new RNG();
    this.numTurns = 10;
    this.oldAi = actor.ai;
  }

  doAi() {
    if (this.numTurns > 0) {
      // Still confused...
      // Move in a random direction, and decrease the number of turns confused
      this.actor.move(this.rng.nextRange(-1, 2), this.rng.nextRange(-1, 2));
      this.numTurns--;
    } else {
      this.actor.ai = this.oldAi;
    }
  }
}
