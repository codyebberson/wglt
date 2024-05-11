import { Pico8Palette } from '@wglt/core';
import { Message, Sprite } from '@wglt/graphics';
import { Ability, TargetType } from '@wglt/roguelike';
import { Rage } from '../buffs/rage';
import { StatsActor } from '../entities/statsactor';

const SPRITE = new Sprite(656, 192, 16, 16);
const TOOLTIP_MESSAGES = [
  new Message('Rage', Pico8Palette.WHITE),
  new Message('Instant cast', Pico8Palette.WHITE),
  new Message('Become enraged increasing damage by', Pico8Palette.YELLOW),
  new Message('100% for 8 turns.', Pico8Palette.YELLOW),
];

export class RageAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = SPRITE;
    this.name = 'Rage';
    this.targetType = TargetType.SELF;
    this.minRange = 1;
    this.maxRange = 1;
    this.cooldown = 20;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: StatsActor): boolean {
    for (let i = 0; i < caster.buffs.length; i++) {
      if (caster.buffs[i] instanceof Rage) {
        if (caster === caster.game.player) {
          caster.game.log('You already have rage.', Pico8Palette.LIGHT_GRAY);
        }
        return false;
      }
    }

    const duration = 8;
    caster.buffs.push(new Rage(caster, duration));
    caster.ap--;
    return true;
  }
}
