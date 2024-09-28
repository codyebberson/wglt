import { Sprite } from 'wglt';
import { Game } from '../game';
import { Monster } from './monster';

// const SPRITE = new Sprite(128, 48, 16, 16, 2);

export class Soldier extends Monster {
  constructor(game: Game, x: number, y: number, level: number) {
    super(game, x, y, 'Soldier', new Sprite(128, 48, 16, 16, 2), level);
  }
}
