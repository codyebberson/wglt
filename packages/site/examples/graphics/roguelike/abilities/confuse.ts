import { Pico8Palette } from '@wglt/core';
import { Message, Sprite } from '@wglt/graphics';
import { Ability, Actor, ConfusedMonster, TargetType } from '@wglt/roguelike';

const CONFUSE_RANGE = 8;
const CONFUSE_SPRITE = new Sprite(128, 32, 16, 16, 3, false);
const TOOLTIP_MESSAGES = [
  new Message('Confuse', Pico8Palette.WHITE),
  new Message('20 mana', Pico8Palette.WHITE),
  new Message('Befuddles an enemy into a random', Pico8Palette.YELLOW),
  new Message('stupor for 10 turns.', Pico8Palette.YELLOW),
];

export class ConfuseAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = CONFUSE_SPRITE;
    this.name = 'Confuse';
    this.targetType = TargetType.ENTITY;
    this.minRange = 1;
    this.maxRange = CONFUSE_RANGE;
    this.cooldown = 1;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: Actor, target: Actor): boolean {
    const game = caster.game;

    if (caster.distanceTo(target) > CONFUSE_RANGE) {
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

    target.ai = new ConfusedMonster(target);
    game.log(
      `The eyes of the ${target.name} look vacant, as he stumbles around!`,
      Pico8Palette.GREEN
    );
    caster.ap--;
    return true;
  }
}
