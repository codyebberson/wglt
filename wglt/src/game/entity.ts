import { Point } from '../core/point';
import { Sprite } from '../core/sprite';
import { Actor } from './actor';
import { BaseGame } from './basegame';

export class Entity extends Point {
  readonly game: BaseGame;
  readonly offset: Point;
  name: string;
  sprite: Sprite;
  flipped: boolean;
  blocks: boolean;
  zIndex: number;

  constructor(game: BaseGame, x: number, y: number, name: string, sprite: Sprite, blocks: boolean) {
    super(x, y);
    this.game = game;
    this.offset = new Point(0, 0);
    this.name = name;
    this.sprite = sprite;
    this.flipped = false;
    this.blocks = blocks;
    this.zIndex = 1;
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
      this.pixelX - this.game.viewport.x + this.game.screenShakeOffset.x,
      this.pixelY - this.game.viewport.y + this.game.screenShakeOffset.y,
      this.flipped
    );
  }

  startTurn(): void {
    // Subclasses can override this.
  }

  endTurn(): void {
    // Subclasses can override this.
  }

  /**
   * Handles when another actor bumps this entity.
   * Returns true on success (something happened).
   * Returns false on failure (bump is rejected).
   * @param _bumper The actor that bumped this entity.
   */
  onBump(_bumper: Actor): boolean {
    return false;
  }
}
