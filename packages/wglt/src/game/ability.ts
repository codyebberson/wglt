import { Message } from '../core/message';
import { Sprite } from '../graphics/sprite';
import { Actor } from './actor';
import { Entity } from './entity';
import { TileMapCell } from './tilemap/tilemapcell';

export enum TargetType {
  SELF = 0,
  ENTITY = 1,
  TILE = 2,
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
