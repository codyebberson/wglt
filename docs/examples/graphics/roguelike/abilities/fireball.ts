import { Pico8Palette, Vec2 } from 'wglt';
import { Message, Sprite } from 'wglt';
import { Ability, Actor, ExplosionAnimation, ProjectileAnimation, TargetType } from 'wglt';
import { TileMapCell } from 'wglt';
import { StatsActor } from '../entities/statsactor';

const FIREBALL_RANGE = 10;
const FIREBALL_RADIUS = 3;

const SPRITE_WIDTH = 16;
const SPRITE_HEIGHT = 16;
const FIREBALL_SPRITE = new Sprite(512, 336, SPRITE_WIDTH, SPRITE_HEIGHT);
const TOOLTIP_MESSAGES = [
  new Message('Fireball', Pico8Palette.WHITE),
  new Message('2% of base mana', Pico8Palette.WHITE),
  new Message('2 turn cast', Pico8Palette.WHITE),
  new Message('Throws a fiery ball causing 8 + INT damage', Pico8Palette.YELLOW),
  new Message('to all enemies within 3 tiles.', Pico8Palette.YELLOW),
];

export class FireballAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = FIREBALL_SPRITE;
    this.name = 'Fireball';
    this.targetType = TargetType.TILE;
    this.minRange = 1;
    this.maxRange = FIREBALL_RANGE;
    this.cooldown = 30;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: StatsActor, target: TileMapCell): boolean {
    const game = caster.game;
    const distance = caster.distanceTo(target);
    if (distance > FIREBALL_RANGE) {
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

    const speed = 8;
    const count = distance * (game.tileSize.width / speed);
    const dx = (target.x * game.tileSize.width - caster.pixelX) / count;
    const dy = (target.y * game.tileSize.height - caster.pixelY) / count;

    caster.ap--;

    game.addAnimation(
      new ProjectileAnimation(
        FIREBALL_SPRITE,
        new Vec2(caster.pixelX, caster.pixelY),
        new Vec2(dx, dy),
        count,
        () => {
          game.addAnimation(
            new ExplosionAnimation(game, target, FIREBALL_RADIUS, 30, () => {
              game.log(
                `The fireball explodes, burning everything within ${FIREBALL_RADIUS} tiles!`,
                Pico8Palette.ORANGE
              );

              const damage = caster.buffDamage(8 + caster.intelligenceModifier);

              for (let i = game.entities.length - 1; i >= 0; i--) {
                const entity = game.entities.get(i);
                if (
                  entity !== caster &&
                  entity instanceof Actor &&
                  entity.distanceTo(target) <= FIREBALL_RADIUS
                ) {
                  game.log(
                    `The ${entity.name} gets burned for ${damage} hit points.`,
                    Pico8Palette.ORANGE
                  );
                  entity.takeDamage(caster, damage);
                }
              }
            })
          );
        }
      )
    );

    return true;
  }
}
