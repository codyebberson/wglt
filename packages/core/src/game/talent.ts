import { TileMapCell } from '@wglt/tilemap';
import { Ability } from './ability';
import { Actor } from './actor';
import { Entity } from './entity';

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

  use(target?: Entity | TileMapCell): boolean {
    if (this.cooldown > 0) {
      // Ability still on cooldown
      return false;
    }

    this.actor.cast(this.ability, target, () => {
      this.cooldown = this.ability.cooldown;
    });

    return true;
  }
}
