import { Actor } from './actor';
import { Entity } from './entity';
import { Message } from './message';
export declare class Item extends Entity {
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
    isStackable(other: Item): boolean;
    onBump(player: Actor): boolean;
    onPickup(user: Actor): void;
    onUse(user: Actor): boolean;
    onUpdateTooltip(): void;
}
