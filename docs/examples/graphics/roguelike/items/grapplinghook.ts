import { Pico8Palette } from 'wglt';
import { Message, Sprite } from 'wglt';
import { Ability, Actor, Item, ItemQuality, SlideAnimation, Stunned, TargetType } from 'wglt';
import { TileMapCell } from 'wglt';
import { StatsActor } from '../entities/statsactor';
import { Game } from '../game';

const RANGE = 10;
const SPRITE = new Sprite(832, 120, 16, 16);
const TOOLTIP_MESSAGES = [
  new Message('Grappling Hook', Pico8Palette.WHITE),
  new Message('Use on target to pull to you.', Pico8Palette.YELLOW),
  new Message('Use on tile to pull to tile.', Pico8Palette.YELLOW),
];

export class GrapplingHookAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = SPRITE;
    this.name = 'Grappling Hook';
    this.targetType = TargetType.TILE;
    this.minRange = 1;
    this.maxRange = RANGE;
    this.cooldown = 30;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: StatsActor, target: TileMapCell): boolean {
    const game = caster.game as Game;
    const distance = caster.distanceTo(target);
    if (distance > RANGE) {
      if (caster === game.player) {
        game.log('Target out of range.', Pico8Palette.LIGHT_GRAY);
      }
      return false;
    }

    if (!game.tileMap?.isVisible(target.x, target.y)) {
      if (caster === game.player) {
        game.log('Target not visible.', Pico8Palette.LIGHT_GRAY);
      }
      return false;
    }

    if (game.tileMap?.isBlocked(target.x, target.y)) {
      if (caster === game.player) {
        game.log('Target is blocked.', Pico8Palette.LIGHT_GRAY);
      }
      return false;
    }

    const existing = game.getActorAt(target.x, target.y);
    if (existing) {
      // Pull the existing actor as close to the player as possible.
      // The goal tile is the midpoint between the player and 1 tile toward the actor.
      const existingDistance = caster.distanceTo(existing);
      const goalX = Math.round(caster.x + (existing.x - caster.x) / existingDistance);
      const goalY = Math.round(caster.y + (existing.y - caster.y) / existingDistance);
      const bestTile = game.findFreeTile(goalX, goalY, 2);
      if (!bestTile) {
        if (caster === game.player) {
          game.log('No free space to drag target.', Pico8Palette.LIGHT_GRAY);
        }
        return false;
      }

      // Drag the actor to the best tile
      const count = 4;
      const xSpeed = ((bestTile.x - existing.x) * game.tileSize.width) / count;
      const ySpeed = ((bestTile.y - existing.y) * game.tileSize.height) / count;
      game.addAnimation(
        new SlideAnimation(existing, xSpeed, ySpeed, count, () => {
          existing.x = bestTile.x;
          existing.y = bestTile.y;
          existing.ai = new Stunned(existing, 1);
          caster.ap--;
        })
      );

      return true;
    }

    // Otherwise, target is available.
    // Jump to the target
    const count = 4;
    const xSpeed = ((target.x - caster.x) * game.tileSize.width) / count;
    const ySpeed = ((target.y - caster.y) * game.tileSize.height) / count;
    game.addAnimation(
      new SlideAnimation(caster, xSpeed, ySpeed, count, () => {
        caster.x = target.x;
        caster.y = target.y;
        caster.ap--;
      })
    );

    return true;
  }
}

export class GrapplingHook extends Item {
  readonly ability: Ability;

  constructor(game: Game) {
    super(game, 'Grappling Hook', SPRITE, ItemQuality.UNCOMMON, 1, 0, 0);
    this.ability = new GrapplingHookAbility();
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  onUse(_user: Actor): boolean {
    this.game.hideAllDialogs();
    this.game.startTargeting(this.ability);
    return true;
  }
}
