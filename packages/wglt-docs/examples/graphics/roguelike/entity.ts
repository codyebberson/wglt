import { Point, SelectOption, Sprite } from 'wglt';
import { Actor } from './actor';
import { Game } from './game';

export class Entity extends Point implements SelectOption {
  readonly game: Game;
  readonly offset: Point;
  name: string;
  sprite: Sprite;
  blocks: boolean;
  zIndex: number;
  flipped: boolean;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks = false) {
    super(x, y);
    this.game = game;
    this.offset = new Point(0, 0);
    this.name = name;
    this.sprite = sprite;
    this.blocks = blocks;
    this.zIndex = 1;
    this.flipped = false;
  }

  get pixelX(): number {
    return this.x * this.game.tileSize.width + this.offset.x;
  }

  get pixelY(): number {
    return this.y * this.game.tileSize.height + this.offset.y;
  }

  get centerPixelX(): number {
    return (this.pixelX + this.sprite.width / 2) | 0;
  }

  get centerPixelY(): number {
    return (this.pixelY + this.sprite.height / 2) | 0;
  }

  distanceTo(other: Point): number {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }

  distance(x: number, y: number): number {
    return Math.hypot(x - this.x, y - this.y);
  }

  draw(): void {
    this.sprite.draw(
      this.game.app,
      this.pixelX - this.game.viewport.x,
      this.pixelY - this.game.viewport.y,
      this.flipped
    );
  }

  startTurn(): void {}

  endTurn(): void {}

  sendToBack(): void {}

  /**
   * Handles when another actor bumps this entity.
   * Returns true on success (something happened).
   * Returns false on failure (bump is rejected).
   * @param bumper The actor that bumped this entity.
   */
  onBump(_bumper: Actor): boolean {
    return false;
  }
}
