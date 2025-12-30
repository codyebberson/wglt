import { Message, Point, Sprite } from 'wglt';
import { type Ability, TargetType } from '../ability';
import { Actor } from '../actor';
import { ProjectileAnimation } from '../animations/projectileanimation';
import type { Game } from '../game';
import { Palette } from '../palette';
import { Sprites, TILE_SIZE } from '../sprites';

const FIREBALL_RANGE = 10;
const FIREBALL_RADIUS = 3;
const FIREBALL_DAMAGE = 12;

export class FireballAbility implements Ability {
  readonly game: Game;
  name: string;
  sprite: Sprite;
  targetType: TargetType;
  cooldown: number;
  tooltipMessages: Message[];
  minRange = 1;
  maxRange = 25;

  constructor(game: Game) {
    this.game = game;
    this.name = 'Fireball';
    this.sprite = Sprites.FIREBALL_ICON;
    this.targetType = TargetType.TILE;
    this.cooldown = 20;
    this.tooltipMessages = [
      new Message('Fireball', Palette.WHITE),
      new Message('2% of base mana', Palette.WHITE),
      new Message('2 turn cast', Palette.WHITE),
      new Message('Throws a fiery ball causing 10 damage', Palette.YELLOW),
      new Message('to all enemies within 3 tiles.', Palette.YELLOW),
    ];
  }

  cast(caster: Actor, target: Actor): boolean {
    const distance = caster.distanceTo(target);
    if (distance > FIREBALL_RANGE) {
      this.game.log('Target out of range.', Palette.LIGHT_GRAY);
      return false;
    }

    const speed = 8;
    const count = distance * (TILE_SIZE / speed);
    const dx = (target.x * TILE_SIZE - caster.pixelX) / count;
    const dy = (target.y * TILE_SIZE - caster.pixelY) / count;

    this.game
      .addAnimation(
        new ProjectileAnimation(
          Sprites.FIREBALL_ANIMATION,
          new Point(caster.pixelX, caster.pixelY),
          new Point(dx, dy),
          count
        )
      )
      .onDone(() =>
        this.game.addAnimation(
          new ProjectileAnimation(
            Sprites.EXPLOSION_ANIMATION,
            new Point(target.x * TILE_SIZE, target.y * TILE_SIZE),
            new Point(0, 0),
            32
          )
        )
      );

    this.game.log(
      `The fireball explodes, burning everything within ${FIREBALL_RADIUS} tiles!`,
      Palette.ORANGE
    );

    for (let i = this.game.entities.length - 1; i >= 0; i--) {
      const entity = this.game.entities.get(i);
      if (entity instanceof Actor && entity.distanceTo(target) <= FIREBALL_RADIUS) {
        this.game.log(
          `The ${entity.name} gets burned for ${FIREBALL_DAMAGE} hit points.`,
          Palette.ORANGE
        );
        entity.takeDamage(caster, FIREBALL_DAMAGE);
      }
    }

    caster.ap--;
    return true;
  }
}
