import { Pico8Palette, Point } from 'wglt';
import { Message, Sprite } from 'wglt';
import { Ability, Actor, Entity, ProjectileAnimation, TargetType } from 'wglt';
import { StatsActor } from '../entities/statsactor';
import { Game } from '../game';

const LIGHTNING_RANGE = 5;
const MANA_COST = 10;
const TOOLTIP_MESSAGES = [
  new Message('Lightning', Pico8Palette.WHITE),
  new Message(`${MANA_COST} mana`, Pico8Palette.WHITE),
  new Message('Instant cast', Pico8Palette.WHITE),
  new Message('Hurls a bolt of lightning at the nearest', Pico8Palette.YELLOW),
  new Message('enemy dealing 4 + INT damage.', Pico8Palette.YELLOW),
];

export class LightningAbility implements Ability {
  readonly sprite: Sprite;
  readonly name: string;
  readonly targetType: TargetType;
  readonly minRange: number;
  readonly maxRange: number;
  readonly cooldown: number;
  readonly tooltipMessages: Message[];

  constructor() {
    this.sprite = new Sprite(158, 10, 16, 16);
    this.name = 'Lightning';
    this.targetType = TargetType.SELF;
    this.minRange = 1;
    this.maxRange = LIGHTNING_RANGE;
    this.cooldown = 10;
    this.tooltipMessages = TOOLTIP_MESSAGES;
  }

  cast(caster: StatsActor): boolean {
    const game = caster.game as Game;
    // Find closest enemy (inside a maximum range) and damage it
    const monster = this.getClosestMonster(game, caster, caster.x, caster.y, LIGHTNING_RANGE);
    if (!monster) {
      game.log('No enemy is close enough to strike.', Pico8Palette.RED);
      return false;
    }

    // Zap it!
    game.log(
      `A lightning bolt strikes the ${monster.name} with a loud thunder!`,
      Pico8Palette.BLUE
    );

    // Calculate damage
    const damage = 4 + caster.intelligenceModifier;

    // Create lightning animation
    const explosion = new Sprite(256, 408, 16, 16, 2, true, 8);
    game.addAnimation(
      new ProjectileAnimation(
        explosion,
        new Point(monster.pixelX, monster.pixelY),
        new Point(0, 0),
        32,
        () => {
          game.log(`The damage is ${damage} hit points`, Pico8Palette.BLUE);
          monster.takeDamage(caster, damage);
          caster.ap--;
        }
      )
    );

    return true;
  }

  private getClosestMonster(
    game: Game,
    player: Entity,
    x: number,
    y: number,
    range: number
  ): Actor | undefined {
    let minDist = range + 1;
    let result = undefined;
    for (let i = 0; i < game.entities.length; i++) {
      const entity = game.entities.get(i);
      if (entity === player) {
        continue;
      }
      if (!(entity instanceof Actor)) {
        continue;
      }
      if (game.tileMap && !game.tileMap.isVisible(entity.x, entity.y)) {
        continue;
      }
      const dist = entity.distance(x, y);
      if (dist < minDist) {
        minDist = dist;
        result = entity;
      }
    }
    return result;
  }
}
