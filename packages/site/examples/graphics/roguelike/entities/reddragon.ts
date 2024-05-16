import { Rect } from 'wglt';
import { Sprite } from 'wglt';
import { AI } from 'wglt';
import { Game } from '../game';
import { FlameCrawler } from './flamecrawler';
import { Monster } from './monster';
import { Player } from './player';
import { Sentiment } from './statsactor';

const SPRITE = new Sprite(96, 272, 16, 16, 2, true);

class RedDragonAI extends AI {
  doAi(): void {
    const dragon = this.actor as RedDragon;
    if (dragon.sentiment !== Sentiment.HOSTILE) {
      // Do nothing until player attacks
      return;
    }

    const game = dragon.game as Game;
    const player = game.player as Player;
    if (!player || player.hp <= 0) {
      return;
    }

    if (dragon.sentiment === Sentiment.HOSTILE && dragon.cooldown === 0) {
      for (let y = dragon.y - 1; y <= dragon.y + 1; y++) {
        for (let x = dragon.x - 1; x <= dragon.x + 1; x++) {
          this.createCrawler(x, y, x - dragon.x, y - dragon.y);
        }
      }

      dragon.cooldown = 5;
      return;
    }

    if (dragon.cooldown > 0) {
      dragon.cooldown--;
    }

    // Otherwise, normal AI
    const dist = dragon.distanceTo(player);
    if (dist < 2) {
      dragon.attack(player, dragon.getDamage());
    } else {
      dragon.moveToward(player.x, player.y);
    }
  }

  private createCrawler(x: number, y: number, dx: number, dy: number): void {
    const dragon = this.actor as RedDragon;
    const game = dragon.game as Game;
    if (game.isBlocked(x, y)) {
      // Ignore blocked
      return;
    }

    const player = game.player as Player;
    if (player && player.x === x && player.y === y) {
      // Ignore player's current location
      return;
    }
    game.entities.add(new FlameCrawler(game, x, y, dx, dy, dragon.level));
  }
}

export class RedDragon extends Monster {
  readonly room: Rect;
  cooldown = 0;

  constructor(game: Game, x: number, y: number, level: number, room: Rect) {
    super(game, x, y, 'Dragon', SPRITE, level);
    this.room = room;
    this.maxHp = 10 * level;
    this.hp = this.maxHp;
    this.ai = new RedDragonAI(this);
    this.sentiment = Sentiment.NEUTRAL;
  }
}
