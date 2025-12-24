import { Sprite } from 'wglt';
import type { Game } from '../game';
import { Monster } from './monster';

export class Soldier extends Monster {
  constructor(game: Game, x: number, y: number, level: number) {
    super(game, x, y, 'Soldier', new Sprite(128, 48, 16, 16, 2), level);
  }
}
