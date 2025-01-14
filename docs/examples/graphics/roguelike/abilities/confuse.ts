import { Message, Sprite } from 'wglt';
import { TargetType } from '../ability';
import { Actor } from '../actor';
import { ConfusedMonster } from '../ai/confusedmonster';
import { Game } from '../game';
import { Palette } from '../palette';
import { Sprites } from '../sprites';

const CONFUSE_RANGE = 8;

export class ConfuseAbility {
  name: string;
  sprite: Sprite;
  targetType: TargetType;
  cooldown: number;
  tooltipMessages: Message[];
  minRange = 1;
  maxRange = 25;

  constructor(readonly game: Game) {
    this.name = 'Confuse';
    this.sprite = Sprites.CONFUSE_ICON;
    this.targetType = TargetType.ENTITY;
    this.cooldown = 20;
    this.tooltipMessages = [
      new Message('Confuse', Palette.WHITE),
      new Message('2% of base mana', Palette.WHITE),
      new Message('2 turn cast', Palette.WHITE),
      new Message('Throws a fiery ball causing 10 damage', Palette.YELLOW),
      new Message('to all enemies within 3 tiles.', Palette.YELLOW),
    ];
  }

  cast(caster: Actor, target: Actor): boolean {
    if (caster.distanceTo(target) > CONFUSE_RANGE) {
      this.game.log('Target out of range.', Palette.LIGHT_GRAY);
      return false;
    }

    target.ai = new ConfusedMonster(target);
    this.game.log(
      `The eyes of the ${target.name} look vacant, as he stumbles around!`,
      Palette.GREEN
    );
    caster.ap--;
    return true;
  }
}
