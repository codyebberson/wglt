import { Pico8Palette } from '@wglt/core';
import { Message, Sprite } from '@wglt/graphics';
import { Ability, Animation, AnimationFunction, TargetType } from '@wglt/roguelike';
import { StatsActor } from '../entities/statsactor';

const RANGE = 10;
const SPRITE = new Sprite(512, 336, 16, 16);
const TOOLTIP_MESSAGES = [
  new Message('Nether Swap', Pico8Palette.WHITE),
  new Message('Instant cast', Pico8Palette.WHITE),
  new Message('Make two characters switch places. One of', Pico8Palette.YELLOW),
  new Message('the characters can be you.', Pico8Palette.YELLOW),
];

export class NetherSwapAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = SPRITE;
    this.name = 'Nether Swap';
    this.targetType = TargetType.ENTITY;
    this.minRange = 1;
    this.maxRange = RANGE;
    this.cooldown = 10;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: StatsActor, target: StatsActor): boolean {
    const game = caster.game;
    const distance = caster.distanceTo(target);
    if (distance > RANGE) {
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

    game.addAnimation(
      new NetherSwapAnimation(caster, target, () => {
        const tmpX = caster.x;
        const tmpY = caster.y;

        caster.x = target.x;
        caster.y = target.y;

        target.x = tmpX;
        target.y = tmpY;

        game.log(`Nether swapped with ${target.name}.`, Pico8Palette.WHITE);
        game.resetViewport();

        caster.ap--;
      })
    );

    return true;
  }
}

const ANIMATION = new Sprite(576, 288, 16, 16, 2, true);
const DURATION = 60;

export class NetherSwapAnimation extends Animation {
  readonly caster: StatsActor;
  readonly target: StatsActor;

  constructor(caster: StatsActor, target: StatsActor, onDone?: AnimationFunction) {
    super(DURATION, true, onDone);
    this.caster = caster;
    this.target = target;
  }

  update(): void {
    this.countdown--;

    const caster = this.caster;
    const target = this.target;
    const game = caster.game;
    const app = game.app;
    ANIMATION.draw(app, caster.pixelX - game.viewport.x, caster.pixelY - game.viewport.y);
    ANIMATION.draw(app, target.pixelX - game.viewport.x, target.pixelY - game.viewport.y);
  }
}
