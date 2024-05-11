import { Vec2 } from '@wglt/core';
import { Sprite } from '@wglt/graphics';
import { AI } from '@wglt/roguelike';
import { Game } from '../game';
import { Monster } from './monster';
import { Player } from './player';
import { Sentiment } from './statsactor';

const SPRITE = new Sprite(96, 272, 16, 16, 2, true);

class StoneGolemAI extends AI {
  countdown = 0;
  cooldown = 10;
  charging = 0;
  target = new Vec2(0, 0);

  doAi(): void {
    const golem = this.actor as StoneGolem;
    if (golem.sentiment !== Sentiment.HOSTILE) {
      // Do nothing until player attacks
      return;
    }

    const game = golem.game as Game;
    const player = game.player as Player;
    if (!player || player.hp <= 0) {
      return;
    }

    this.cooldown--;
    if (this.cooldown === 0) {
      this.cooldown = 15;
      this.countdown = 3;
      this.target.x = player.x;
      this.target.y = player.y;
      game.log('Golem looks at the hero and growls.');
      return;
    }

    this.countdown--;
    if (this.countdown > 0) {
      game.log('Golem prepares to charge...');
      return;
    }

    if (this.countdown === 0) {
      game.log('Golem charges!');
      this.charging = 6;
    }

    this.charging--;
    if (this.charging > 0) {
      // Charging
      const playerDist = golem.distanceTo(player);
      const targetDist = golem.distanceTo(this.target);
      if (playerDist < 2) {
        golem.attack(player, golem.getDamage());
      } else if (targetDist >= 2) {
        const dx = Math.round(((this.target.x - golem.x) / targetDist) * 2.0);
        const dy = Math.round(((this.target.y - golem.y) / targetDist) * 2.0);
        golem.move(dx, dy);
      } else {
        golem.moveToward(this.target.x, this.target.y);
      }
      return;
    }

    // Otherwise, normal AI
    const dist = golem.distanceTo(player);
    if (dist < 2) {
      golem.attack(player, golem.getDamage());
    } else {
      golem.moveToward(player.x, player.y);
    }
  }
}

export class StoneGolem extends Monster {
  constructor(game: Game, x: number, y: number, level: number) {
    super(game, x, y, 'Golem', SPRITE, level);
    this.maxHp = 10 * this.level;
    this.hp = this.maxHp;
    this.ai = new StoneGolemAI(this);
    this.sentiment = Sentiment.NEUTRAL;
  }
}
