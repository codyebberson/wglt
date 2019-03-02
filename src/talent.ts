import {Ability} from './ability';
import {Actor} from './actor';

export class Talent {
  readonly actor: Actor;
  readonly ability: Ability;
  rank: number;
  cooldown: number;

  constructor(actor: Actor, ability: Ability, rank?: number) {
    this.actor = actor;
    this.ability = ability;
    this.rank = rank || 1;
    this.cooldown = 0;
  }

  use() {
    if (this.cooldown > 0) {
      // Ability still on cooldown
      return false;
    }

    this.actor.cast(this.ability, () => {
      this.cooldown = this.ability.cooldown;
    });

    return true;
  }
}
