import { Pico8Palette } from 'wglt';
import { Message, Sprite } from 'wglt';
import { Actor, Item, ItemQuality } from 'wglt';
import { Game } from '../game';

const HEAL_AMOUNT = 4;
const NAME = 'Healing Potion';
const SPRITE = new Sprite(656, 168, 16, 16, 1, true);

export class HealthPotion extends Item {
  constructor(game: Game) {
    super(game, NAME, SPRITE, ItemQuality.COMMON, 5, 20, 5);
  }

  addTooltipDescription(tooltipMessages: Message[]): void {
    tooltipMessages.push(new Message('Use: Restore 10 health', Pico8Palette.GREEN));
  }

  onUse(user: Actor): boolean {
    if (user.hp === user.maxHp) {
      this.game.log('You are already at full health.', Pico8Palette.DARK_RED);
      return false;
    }

    this.game.log('Your wounds start to feel better!', Pico8Palette.GREEN);
    user.takeHeal(HEAL_AMOUNT);
    user.inventory.remove(this);
    user.ap--;
    return true;
  }
}
