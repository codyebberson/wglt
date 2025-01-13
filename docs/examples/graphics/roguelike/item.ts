import { Message } from 'wglt';
import { Ability } from './ability';
import { Actor } from './actor';
import { Entity } from './entity';
import { Palette } from './palette';

export abstract class Item extends Entity {
  ability?: Ability;
  tooltipMessages?: Message[];

  onPickup(entity: Actor, item: Item): void {
    this.game.log(`${entity.name} picked up a ${item.name}`, Palette.GREEN);
  }

  abstract onUse(user: Actor, item: Item): void;
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
  isStackable(other: Item) {
    return this.name === other.name;
  }

  onBump(player: Actor) {
    player.pickup(this);
    player.moveToward(this.x, this.y);
    return true;
  }
}
