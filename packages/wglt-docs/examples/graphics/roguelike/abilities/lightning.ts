import { Message, Point, Sprite } from 'wglt';
import { Ability, TargetType } from '../ability';
import { Actor } from '../actor';
import { ProjectileAnimation } from '../animations/projectileanimation';
import { Game } from '../game';
import { Palette } from '../palette';
import { Sprites, TILE_SIZE } from '../sprites';

const LIGHTNING_DAMAGE = 20;
const LIGHTNING_RANGE = 5;

export class LightningAbility implements Ability {
  name: string;
  sprite: Sprite;
  targetType: TargetType;
  cooldown: number;
  tooltipMessages: Message[];
  minRange = 1;
  maxRange = 25;

  constructor(readonly game: Game) {
    this.name = 'Lightning';
    this.sprite = Sprites.LIGHTNING_ICON;
    this.targetType = TargetType.SELF;
    this.cooldown = 10;
    this.tooltipMessages = [
      new Message('Lightning', Palette.WHITE),
      new Message('2% of base mana', Palette.WHITE),
      new Message('2 turn cast', Palette.WHITE),
      new Message('Hurls a bolt of lightning at the target', Palette.YELLOW),
      new Message('dealing 20 damage.', Palette.YELLOW),
    ];
  }

  cast(caster: Actor): boolean {
    // Find closest enemy (inside a maximum range) and damage it
    const monster = this.game.getClosestMonster(caster.x, caster.y, LIGHTNING_RANGE);
    if (!monster) {
      this.game.log('No enemy is close enough to strike.', Palette.RED);
      return false;
    }

    // Zap it!

    this.game
      .addAnimation(
        new ProjectileAnimation(
          Sprites.FIREBALL_ANIMATION,
          new Point(monster.x * TILE_SIZE, monster.y * TILE_SIZE),
          new Point(0, 0),
          16
        )
      )
      .onDone(() => {
        this.game.log(
          `A lightning bolt strikes the ${monster.name} with a loud thunder!`,
          Palette.BLUE
        );
        this.game.log(`The damage is ${LIGHTNING_DAMAGE} hit points`, Palette.BLUE);
        monster.takeDamage(caster, LIGHTNING_DAMAGE);
        caster.ap--;
      });

    return true;
  }
}
