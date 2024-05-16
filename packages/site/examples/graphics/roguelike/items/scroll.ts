import { Sprite } from 'wglt';
import { Ability, Actor, Item, ItemQuality, TargetType } from 'wglt';
import { Game } from '../game';

const SPRITE = new Sprite(736, 168, 16, 16, 1, true);

export class Scroll extends Item {
  readonly ability: Ability;

  constructor(game: Game, x: number, y: number, ability: Ability) {
    super(game, `Scroll of ${ability.name}`, SPRITE, ItemQuality.UNCOMMON, 1, 10, 10);
    this.ability = ability;
    this.tooltipMessages = ability.tooltipMessages;
    this.onUpdateTooltip();
    this.x = x;
    this.y = y;
  }

  onUse(user: Actor): boolean {
    this.game.hideAllDialogs();

    const ability = this.ability;
    if (ability.targetType === TargetType.SELF) {
      if (ability.cast(user)) {
        user.inventory.remove(this);
      }
    } else {
      this.game.startTargeting(ability, () => {
        user.inventory.remove(this);
      });
    }
    return true;
  }

  onUpdateTooltip(): void {
    if (this.ability) {
      this.tooltipMessages = this.ability.tooltipMessages;
    }
  }
}
