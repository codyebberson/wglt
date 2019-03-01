import { Ability } from './ability';
import { Actor } from './actor';
import { Entity } from './entity';
import { TileMapCell } from './tilemap';
export declare class Talent {
    readonly actor: Actor;
    readonly ability: Ability;
    rank: number;
    cooldown: number;
    constructor(actor: Actor, ability: Ability, rank?: number);
    cast(target?: Entity | TileMapCell): boolean;
}
