import { Actor } from './actor';
import { Entity } from './entity';
import { Sprite } from './sprite';
import { TileMapCell } from './tilemap';
export declare enum TargetType {
    SELF = 0,
    ENTITY = 1,
    TILE = 2
}
export interface Ability {
    readonly sprite: Sprite;
    readonly name: string;
    readonly targetType: TargetType;
    readonly minRange: number;
    readonly maxRange: number;
    cast(caster: Actor, target?: Entity | TileMapCell): boolean;
}
