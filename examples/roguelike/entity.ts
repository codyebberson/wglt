import { Color } from '../../src/color';
import { Game } from './game';

export class Entity {
  game: Game;
  x: number;
  y: number;
  char: string;
  name: string;
  color: Color;
  blocks: boolean;

  constructor(game: Game, x: number, y: number, char: string, name: string, color: Color, blocks?: boolean) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.char = char;
    this.name = name;
    this.color = color;
    this.blocks = !!blocks;
  }

  distanceTo(other: Entity): number {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }

  distance(x: number, y: number): number {
    return Math.hypot(x - this.x, y - this.y);
  }

  sendToBack(): void {
    this.remove();
    this.game.entities.unshift(this);
  }

  remove(): void {
    this.game.entities.splice(this.game.entities.indexOf(this), 1);
  }

  draw(): void {
    if (this.game.map.isVisible(this.x, this.y)) {
      this.game.app.term.drawString(this.x, this.y, this.char, this.color);
    }
  }
}
