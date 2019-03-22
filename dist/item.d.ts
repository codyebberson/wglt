import { Actor } from './actor';
import { Entity } from './entity';
import { Message } from './message';
export declare class Item extends Entity {
    tooltipMessages?: Message[];
    onBump(player: Actor): void;
    onPickup(user: Actor): void;
    onUse(user: Actor): boolean;
}
