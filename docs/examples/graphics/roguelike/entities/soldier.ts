import { Sprite } from 'wglt';
import { Game } from '../game';
import { Monster } from './monster';

// const SPRITE = new Sprite(96, 272, 16, 16, 2);
const SPRITE = new Sprite(608, 240, 16, 16, 2);

export class Soldier extends Monster {
  constructor(game: Game, x: number, y: number, level: number) {
    super(game, x, y, 'Soldier', SPRITE, level);
  }
}
