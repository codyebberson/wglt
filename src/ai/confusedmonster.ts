import {Entity} from '../entity';
import {RNG} from '../rng';

import {AI} from './ai';

export class ConfusedMonster extends AI {
  readonly rng: RNG;
  numTurns: number;
  oldAi?: AI;

  constructor(entity: Entity) {
    super(entity);
    this.rng = new RNG();
    this.numTurns = 10;
    this.oldAi = entity.ai;
  }

  doAi() {
    if (this.numTurns > 0) {
      // Still confused...
      // Move in a random direction, and decrease the number of turns confused
      this.entity.move(this.rng.nextRange(-1, 1), this.rng.nextRange(-1, 1));
      this.numTurns--;
    } else {
      this.entity.ai = this.oldAi;
      // addMessage('The ' + this.owner.name + ' is no longer confused!',
      // wglt.Colors.LIGHT_RED);
    }
  }
}
