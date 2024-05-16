import { Pico8Palette, Vec2 } from 'wglt';
import { Sprite } from 'wglt';
import { Game } from '../game';
import { StatsActor } from './statsactor';

const PLAYER_SPRITE = new Sprite(576, 272, 16, 16, 2, true);

export class Player extends StatsActor {
  xp: number;
  maxXp: number;
  remainingAbilityPoints: number;
  home: Vec2;
  keys: boolean[];

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Player', PLAYER_SPRITE);
    this.level = 1;
    this.hp = 10;
    this.maxHp = 10;
    this.xp = 0;
    this.maxXp = 20;
    this.strength = 20;
    this.armor = 20;
    this.remainingAbilityPoints = 0;
    this.home = new Vec2(x, y);
    this.keys = new Array(1000);
  }

  takeDamage(attacker: StatsActor, damage: number): void {
    this.game.stopAutoWalk();
    super.takeDamage(attacker, damage);
  }

  onDeath(): void {
    this.game.log('You died!');
  }

  addXp(xpGain: number): void {
    this.xp += xpGain;
    this.addFloatingText(`+${xpGain}`, Pico8Palette.PINK);

    let levelUp = false;
    while (this.xp >= this.maxXp) {
      this.level++;
      this.xp -= this.maxXp;
      this.maxXp = this.nextMaxXp(this.maxXp);
      this.remainingAbilityPoints += 2;
      this.game.log(`You reached level ${this.level}`, Pico8Palette.PINK);
      levelUp = true;
    }

    if (levelUp) {
      this.recalculateMaxHp();
      (this.game as Game).levelUpDialog.visible = true;
    }
  }

  private nextMaxXp(oldMaxXp: number): number {
    return Math.round((oldMaxXp * 1.5) / 10.0) * 10.0;
  }
}
