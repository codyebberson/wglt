import { Message } from 'wglt';
import { Ability } from '../ability';
import { Actor } from '../actor';
import { Game } from '../game';
import { Item } from '../item';
import { Palette } from '../palette';

export class Scroll extends Item {
  constructor(game: Game, x: number, y: number, ability: Ability) {
    super(game, x, y, `scroll of ${ability.name}`, ability.sprite);

    this.tooltipMessages = [
      new Message('Ancient Healing Potion', Palette.BLUE),
      new Message('Item Level 5', Palette.YELLOW),
      new Message('Use: Restore 10 health', Palette.GREEN),
    ];
  }

  onUse(caster: Actor, item: Item): void {
    const ability = item.ability as Ability;
    caster.cast(ability, undefined, () => {
      caster.inventory.remove(item);
    });
  }

  onUpdateTooltip(): void {
    throw new Error('Method not implemented.');
  }
}
