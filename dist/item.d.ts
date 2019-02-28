import { Actor } from './actor';
import { Entity } from './entity';
export declare class Item extends Entity {
    onPickup(user: Actor): void;
    onUse(user: Actor): boolean;
}
