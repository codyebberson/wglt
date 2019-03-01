import {Actor} from './actor';
import {Entity} from './entity';
import {Sprite} from './sprite';
import {TileMapCell} from './tilemap';

export enum TargetType {
  SELF,
  ENTITY,
  TILE
}

export interface Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;

  cast(caster: Actor, target?: Entity|TileMapCell): boolean;
}
