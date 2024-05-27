import { Sprite } from 'wglt';
import { AI } from 'wglt';
import { Game } from '../game';
import { Monster } from './monster';
import { Player } from './player';

const SPRITE = new Sprite(96, 272, 16, 16, 2, true);

class WindCrawlerAI extends AI {
  aliveCount: number;

  constructor(actor: WindCrawler) {
    super(actor);
    this.alwaysActive = true;
    this.aliveCount = 0;
  }

  doAi(): void {
    const monster = this.actor as WindCrawler;
    const game = monster.game as Game;
    const player = game.player as Player;
    if (!player || player.hp <= 0) {
      return;
    }

    // Count how long it has been alive
    this.aliveCount++;

    if (this.aliveCount === 1) {
      // Do nothing on the first turn
      return;
    }

    const nextX = monster.x + monster.dx;
    const nextY = monster.y + monster.dy;

    if (player.x === nextX && player.y === nextY) {
      monster.attack(player, Math.round(monster.getDamage() / 2));
      player.move(monster.dx, monster.dy);
    } else if (game.tileMap.isBlocked(nextX, nextY)) {
      monster.game.entities.remove(monster);
    } else {
      monster.move(monster.dx, monster.dy);
    }
  }
}

export class WindCrawler extends Monster {
  readonly dx: number;
  readonly dy: number;

  constructor(game: Game, x: number, y: number, dx: number, dy: number, level: number) {
    super(game, x, y, 'Wind Crawler', SPRITE, level);
    this.ai = new WindCrawlerAI(this);
    this.dx = dx;
    this.dy = dy;
    this.showFrame = false;
    this.seen = true;
    this.blocks = false;
  }
}
