import { Message, Sprite, TileMapCell } from 'wglt';
import { Actor } from './actor';
import { Entity } from './entity';

export const TargetType = {
  SELF: 0,
  ENTITY: 1,
  TILE: 2,
} as const;

export type TargetType = (typeof TargetType)[keyof typeof TargetType];

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
