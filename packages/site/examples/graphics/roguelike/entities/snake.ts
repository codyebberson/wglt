import { Sprite } from 'wglt';
import { AI } from 'wglt';
import { Game } from '../game';
import { Monster } from './monster';

const SPRITE = new Sprite(96, 272, 16, 16, 2, true);

class SnakeAI extends AI {
  doAi(): void {
    const snake = this.actor as Snake;
    const player = snake.game.player;
    if (!player) {
      return;
    }

    if (snake.distanceTo(player) < 4) {
      snake.attack(player, snake.getDamage());
    }
  }
}

export class Snake extends Monster {
  constructor(game: Game, x: number, y: number, level: number) {
    super(game, x, y, 'Snake', SPRITE, level);
    this.ai = new SnakeAI(this);
  }
}
