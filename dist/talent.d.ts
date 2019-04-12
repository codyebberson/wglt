import { Ability } from './ability';
import { Actor } from './actor';
import { Entity } from './entity';
import { TileMapCell } from './tilemap/tilemapcell';
export declare class Talent {
    readonly actor: Actor;
    readonly ability: Ability;
    rank: number;
    cooldown: number;
    constructor(actor: Actor, ability: Ability, rank?: number);
    use(target?: Entity | TileMapCell): boolean;
}
