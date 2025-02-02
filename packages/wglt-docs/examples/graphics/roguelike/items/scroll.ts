import { Ability } from '../ability';
import { Actor } from '../actor';
import { Game } from '../game';
import { Item } from '../item';

export class Scroll extends Item {
  constructor(
    game: Game,
    x: number,
    y: number,
    readonly ability: Ability
  ) {
    super(game, x, y, `scroll of ${ability.name}`, ability.sprite);
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
