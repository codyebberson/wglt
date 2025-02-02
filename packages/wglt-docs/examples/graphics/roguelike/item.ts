import { Message } from 'wglt';
import { Actor } from './actor';
import { Entity } from './entity';
import { Palette } from './palette';

export abstract class Item extends Entity {
  tooltipMessages?: Message[];

  onPickup(entity: Actor): void {
    this.game.log(`${entity.name} picked up a ${this.name}`, Palette.GREEN);
  }

  abstract onUse(user: Actor): void;
  abstract onUpdateTooltip(): void;

  /**
   * Returns true if this item can be stacked with the other item
   * in containers such as chests and bags.
   *
   * By default, items are stackable if they have the same name.
   * Overriding classes can change this logic.
   *
   * @param other Other item to stack with.
   */
  isStackable(other: Item): boolean {
    return this.name === other.name;
  }

  onBump(player: Actor): boolean {
    player.pickup(this);
    player.moveToward(this.x, this.y);
    return true;
  }
}
