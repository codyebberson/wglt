import { Actor } from './actor';
import { Entity } from './entity';
import { Message } from './message';
export declare class Item extends Entity {
    tooltipMessages?: Message[];
    onBump(player: Actor): boolean;
    onPickup(user: Actor): void;
    onUse(user: Actor): boolean;
    onUpdateTooltip(): void;
}
