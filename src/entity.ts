import { Game } from './game';
import { SelectOption } from './gui/selectoption';
import { Sprite } from './sprite';
import { Vec2 } from './vec2';
import { Actor } from './actor';
import { Serializable } from './serializable';

@Serializable('Entity')
export class Entity extends Vec2 implements SelectOption {
  readonly game: Game;
  readonly offset: Vec2;
  name: string;
  sprite: Sprite;
  blocks: boolean;
  zIndex: number;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean) {
    super(x, y);
    this.game = game;
    this.offset = new Vec2(0, 0);
    this.name = name;
    this.sprite = sprite;
    this.blocks = blocks;
    this.zIndex = 1;
  }

  get pixelX(): number {
    return this.x * this.game.tileMap.tileSize.width + this.offset.x;
  }

  get pixelY(): number {
    return this.y * this.game.tileMap.tileSize.height + this.offset.y;
  }

  get centerPixelX(): number {
    return this.pixelX + (this.sprite.width / 2) | 0;
  }

  get centerPixelY(): number {
    return this.pixelY + (this.sprite.height / 2) | 0;
  }

  distanceTo(other: Vec2) {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }

  distance(x: number, y: number) {
    return Math.hypot(x - this.x, y - this.y);
  }

  draw() {
    this.sprite.draw(this.game.app, this.pixelX - this.game.viewport.x, this.pixelY - this.game.viewport.y);
  }

  startTurn() { }

  endTurn() { }

  sendToBack() { }

  /**
   * Handles when another actor bumps this entity.
   * Returns true on success (something happened).
   * Returns false on failure (bump is rejected).
   * @param bumper The actor that bumped this entity.
   */
  onBump(bumper: Actor) {
    return false;
  }
}
