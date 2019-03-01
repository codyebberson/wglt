import {Ability} from './ability';
import {Actor} from './actor';
import {Entity} from './entity';
import {TileMapCell} from './tilemap';

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

  cast(target?: Entity|TileMapCell) {
    if (this.cooldown > 0) {
      // Ability still on cooldown
      return false;
    }

    if (!this.ability.cast(this.actor, target)) {
      // Failed to cast
      return false;
    }

    this.cooldown = this.ability.cooldown;
    return true;
  }
}
