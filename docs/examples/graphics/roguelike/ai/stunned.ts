import { Actor } from '../actor';
import { AI } from './ai';

export class Stunned extends AI {
  numTurns: number;
  oldAi?: AI;

  constructor(actor: Actor, turns: number) {
    super(actor);
    this.numTurns = turns;
    this.oldAi = actor.ai;
  }

  doAi(): void {
    if (this.numTurns > 0) {
      // Stunned.  Sit still.
      this.numTurns--;
    } else {
      this.actor.ai = this.oldAi;
    }
  }
}
