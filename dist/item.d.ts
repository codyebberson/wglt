import { Entity } from './entity';
export declare class Item extends Entity {
    onPickup(user: Entity): void;
    onUse(user: Entity): boolean;
}
