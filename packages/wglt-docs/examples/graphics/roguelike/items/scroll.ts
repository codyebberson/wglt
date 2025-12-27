import type { Ability } from '../ability';
import { Actor } from '../actor';
import type { Game } from '../game';
import { Item } from '../item';
import { Sprites } from '../sprites';

export class Scroll extends Item {
  readonly ability: Ability;

  constructor(game: Game, x: number, y: number, ability: Ability) {
    super(game, x, y, `scroll of ${ability.name}`, Sprites.SCROLL);
    this.ability = ability;
    this.tooltipMessages = ability.tooltipMessages;
  }

  onUse(caster: Actor): void {
    const ability = this.ability;
    caster.cast(ability, undefined, () => {
      caster.inventory.remove(this);
    });
  }

  onUpdateTooltip(): void {
    throw new Error('Method not implemented.');
  }
}
