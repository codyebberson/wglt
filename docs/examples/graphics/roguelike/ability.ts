import { Actor } from './actor';
import { Entity } from './entity';
import { Message } from './message';
import { Sprite } from './sprite';
import { TileMapCell } from './tilemap/tilemapcell';

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
  readonly tooltipMessages: Message[];

  cast(caster: Actor, target?: Entity | TileMapCell): boolean;
}
