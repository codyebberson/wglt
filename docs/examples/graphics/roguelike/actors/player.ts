import { Sprite } from 'wglt';
import { Game } from '../game';
import { Fighter } from './fighter';

export class Player extends Fighter {
  level: number;
  xp: number;
  maxXp: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Player', new Sprite(0, 16, 16, 16, 2, true));
    this.level = 1;
    this.xp = 0;
    this.maxXp = 10;
    this.zIndex = 2;
  }

  onDeath() {
    this.game.log('You died!');
  }
}
