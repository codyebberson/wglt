import { Pico8Palette } from '@wglt/core';
import { Message } from '@wglt/graphics';
import { Sprite } from '@wglt/graphics';
import { Ability, TargetType } from '@wglt/roguelike';
import { Bubble } from '../buffs/bubble';
import { StatsActor } from '../entities/statsactor';

const SPRITE = new Sprite(896, 216, 16, 16, 1, true);
const TOOLTIP_MESSAGES = [
  new Message('Bubble', Pico8Palette.WHITE),
  new Message('20 mana', Pico8Palette.WHITE),
  new Message('Instant cast', Pico8Palette.WHITE),
  new Message('Shields the caster absorbing 4 + INT', Pico8Palette.YELLOW),
  new Message('damage.', Pico8Palette.YELLOW),
];

export class BubbleAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = SPRITE;
    this.name = 'Bubble';
    this.targetType = TargetType.SELF;
    this.minRange = 1;
    this.maxRange = 1;
    this.cooldown = 20;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: StatsActor): boolean {
    for (let i = 0; i < caster.buffs.length; i++) {
      if (caster.buffs[i] instanceof Bubble) {
        if (caster === caster.game.player) {
          caster.game.log('You already have a bubble.', Pico8Palette.LIGHT_GRAY);
        }
        return false;
      }
    }

    const absorb = 4 + caster.intelligenceModifier;
    caster.buffs.push(new Bubble(caster, absorb));
    caster.ap--;
    return true;
  }
}
