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

  cast(caster: Entity, target?: Entity|TileMapCell): boolean;
}
