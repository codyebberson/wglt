import { Pico8Palette } from '@wglt/core';
import { Message, Sprite } from '@wglt/graphics';
import { Ability, TargetType } from '@wglt/roguelike';
import { Curse } from '../buffs/curse';
import { StatsActor } from '../entities/statsactor';

const RANGE = 8;
const SPRITE = new Sprite(880, 144, 16, 16, 1, false);
const TOOLTIP_MESSAGES = [
  new Message('Curse', Pico8Palette.WHITE),
  new Message('20 mana', Pico8Palette.WHITE),
  new Message('Instant cast', Pico8Palette.WHITE),
  new Message('Corrupts the target, causing (1 + INT) / 4', Pico8Palette.YELLOW),
  new Message('damage per turn for 8 turns.', Pico8Palette.YELLOW),
];

export class CurseAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = SPRITE;
    this.name = 'Curse';
    this.targetType = TargetType.ENTITY;
    this.minRange = 1;
    this.maxRange = RANGE;
    this.cooldown = 3;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: StatsActor, target: StatsActor): boolean {
    const game = caster.game;

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

    const damage = Math.round((1 + caster.intelligenceModifier) / 4);
    target.buffs.push(new Curse(caster, target, damage, 8));
    caster.ap--;
    return true;
  }
}
