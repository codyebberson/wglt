import { Rect } from 'wglt';
import { Sprite } from 'wglt';
import { AI } from 'wglt';
import { Game } from '../game';
import { Monster } from './monster';
import { Player } from './player';
import { Sentiment } from './statsactor';
import { WindCrawler } from './windcrawler';

const SPRITE = new Sprite(96, 272, 16, 16, 2);

class WindElementalAI extends AI {
  doAi(): void {
    const elemental = this.actor as WindElemental;
    if (elemental.sentiment !== Sentiment.HOSTILE) {
      // Do nothing until player attacks
      return;
    }

    const game = elemental.game as Game;
    const player = game.player as Player;
    if (!player || player.hp <= 0) {
      return;
    }

    if (elemental.cooldown === 0) {
      const room = elemental.room;
      const rng = game.rng;

      // Top and bottom edges
      for (let x = room.x1 + 1; x < room.x2 - 1; x++) {
        if (rng.nextRange(0, 2) === 0) {
          this.createCrawler(x, room.y1 + 1, 0, 1);
        } else {
          this.createCrawler(x, room.y2 - 1, 0, -1);
        }
      }

      // Left and right edges
      for (let y = room.y1 + 1; y < room.y2 - 1; y++) {
        if (rng.nextRange(0, 2) === 0) {
          this.createCrawler(room.x1 + 1, y, 1, 0);
        } else {
          this.createCrawler(room.x2 - 1, y, -1, 0);
        }
      }

      elemental.cooldown = 10;
      return;
    }

    if (elemental.cooldown > 0) {
      elemental.cooldown--;
    }

    const dist = elemental.distanceTo(player);
    if (dist <= 2) {
      elemental.attack(player, elemental.getDamage());
    }
  }

  private createCrawler(x: number, y: number, dx: number, dy: number): void {
    const elemental = this.actor as WindElemental;
    const game = elemental.game as Game;
    const player = game.player as Player;
    if (player && player.x === x && player.y === y) {
      // Ignore player's current location
      return;
    }
    game.entities.add(new WindCrawler(game, x, y, dx, dy, elemental.level));
  }
}

export class WindElemental extends Monster {
  readonly room: Rect;
  cooldown = 0;

  constructor(game: Game, x: number, y: number, level: number, room: Rect) {
    super(game, x, y, 'Wind', SPRITE, level);
    this.room = room;
    this.maxHp = 10 * level;
    this.hp = this.maxHp;
    this.ai = new WindElementalAI(this);
    this.sentiment = Sentiment.NEUTRAL;
  }
}
