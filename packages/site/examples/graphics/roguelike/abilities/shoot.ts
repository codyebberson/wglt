import { Pico8Palette } from '@wglt/core';
import { Message, Sprite } from '@wglt/graphics';
import { Ability, TargetType } from '@wglt/roguelike';
import { StatsActor } from '../entities/statsactor';

const RANGE = 8;
const SPRITE = new Sprite(896, 96, 16, 16, 1, false);
const TOOLTIP_MESSAGES = [
  new Message('Shoot', Pico8Palette.WHITE),
  new Message('30 yard range', Pico8Palette.WHITE),
  new Message('Requires a ranged weapon.', Pico8Palette.WHITE),
];

export class ShootAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = SPRITE;
    this.name = 'Shoot';
    this.targetType = TargetType.ENTITY;
    this.minRange = 1;
    this.maxRange = RANGE;
    this.cooldown = 3;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: StatsActor, target: StatsActor): boolean {
    const game = caster.game;

    const weapon = caster.mainHandWeapon;
    if (!weapon || !weapon.ranged) {
      if (caster === game.player) {
        game.log('Shoot requires a ranged weapon.', Pico8Palette.LIGHT_GRAY);
      }
      return false;
    }

    if (caster.distanceTo(target) > RANGE) {
      if (caster === game.player) {
        game.log('Target out of range.', Pico8Palette.LIGHT_GRAY);
      }
      return false;
    }

    if (game.tileMap && !game.tileMap.isVisible(target.x, target.y)) {
      if (caster === game.player) {
        game.log('Target not visible.', Pico8Palette.LIGHT_GRAY);
      }
      return false;
    }

    target.takeDamage(caster, caster.getDamage());
    caster.ap--;
    return true;
  }
}
