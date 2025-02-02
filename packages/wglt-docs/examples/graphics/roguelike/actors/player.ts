import { Game } from '../game';
import { Sprites } from '../sprites';
import { Fighter } from './fighter';

export class Player extends Fighter {
  level: number;
  xp: number;
  maxXp: number;

  constructor(game: Game, x: number, y: number) {
    super(game, x, y, 'Player', Sprites.PLAYER);
    this.level = 1;
    this.xp = 0;
    this.maxXp = 10;
    this.zIndex = 2;
  }

  onDeath(): void {
    this.game.log('You died!');
  }
}
