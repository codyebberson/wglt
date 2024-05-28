import { Sprite } from 'wglt';
import { Game } from '../game';
import { Monster } from './monster';

const SPRITE = new Sprite(96, 272, 16, 16, 2, true);

export class Ghost extends Monster {
  constructor(game: Game, x: number, y: number, level: number) {
    super(game, x, y, 'Ghost', SPRITE, level);
  }
}