import {Actor} from './actor';
import {Entity} from './entity';
import {Message} from './message';

export class Item extends Entity {
  tooltipMessages?: Message[];

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

  onPickup(user: Actor) {}

  onUse(user: Actor): boolean {
    return false;
  }

  onUpdateTooltip() { }
}