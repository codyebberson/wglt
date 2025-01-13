import { Message, Sprite } from 'wglt';
import { Actor } from '../actor';
import { Game } from '../game';
import { Item } from '../item';
import { Palette } from '../palette';

const HEAL_AMOUNT = 4;

export class HealthPotion extends Item {
  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'healing potion', new Sprite(128, 16, 16, 16, 1));

    this.tooltipMessages = [
      new Message('Ancient Healing Potion', Palette.BLUE),
      new Message('Item Level 5', Palette.YELLOW),
      new Message('Use: Restore 10 health', Palette.GREEN),
    ];
  }

  onUse(caster: Actor, item: Item): void {
    if (caster.hp === caster.maxHp) {
      this.game.log('You are already at full health.', Palette.RED);
      return;
    }

    this.game.log('Your wounds start to feel better!', Palette.PINK);
    caster.takeHeal(HEAL_AMOUNT);
    caster.inventory.remove(item);
    caster.ap--;
  }

  onUpdateTooltip(): void {
    throw new Error('Method not implemented.');
  }
}
