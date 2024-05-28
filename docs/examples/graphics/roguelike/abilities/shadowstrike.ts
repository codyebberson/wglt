import { Pico8Palette, Point } from 'wglt';
import { Message, Sprite } from 'wglt';
import { Ability, SlideAnimation, TargetType } from 'wglt';
import { StatsActor } from '../entities/statsactor';

const RANGE = 10;
const SPRITE = new Sprite(656, 192, 16, 16);
const TOOLTIP_MESSAGES = [
  new Message('Shadow Strike', Pico8Palette.WHITE),
  new Message('Instant cast', Pico8Palette.WHITE),
  new Message('Appear behind your target up to 25 yards away,', Pico8Palette.YELLOW),
  new Message('dealing double damage.', Pico8Palette.YELLOW),
];

export class ShadowStrikeAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = SPRITE;
    this.name = 'Shadow Strike';
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

    // Find the tile that is closest to the opposite side.
    // Note that this is different than "farthest" tile,
    // which can result in moving at an angle.
    const targetX = caster.x + 2 * (target.x - caster.x);
    const targetY = caster.y + 2 * (target.y - caster.y);
    let bestTile: Point | null = null;
    let bestDistance = 1000.0;

    for (let y = target.y - 1; y <= target.y + 1; y++) {
      for (let x = target.x - 1; x <= target.x + 1; x++) {
        if (game.isBlocked(x, y)) {
          // Blocked or occupied
          continue;
        }
        const distance = Math.hypot(x - targetX, y - targetY);
        if (distance < bestDistance) {
          bestTile = new Point(x, y);
          bestDistance = distance;
        }
      }
    }

    if (!bestTile) {
      if (caster === game.player) {
        game.log('No free spaces available.', Pico8Palette.LIGHT_GRAY);
      }
      return false;
    }

    const count = 4;
    const xSpeed = ((bestTile.x - caster.x) * game.tileSize.width) / count;
    const ySpeed = ((bestTile.y - caster.y) * game.tileSize.height) / count;
    game.addAnimation(
      new SlideAnimation(caster, xSpeed, ySpeed, count, () => {
        caster.x = (bestTile as Point).x;
        caster.y = (bestTile as Point).y;
        caster.attack(target, caster.getDamage() * 2);
        caster.ap--;
      })
    );
    return true;
  }
}
