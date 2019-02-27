import {Game} from './game';
import {SelectOption} from './gui/selectoption';
import {Sprite} from './sprite';
import {TileMapCell} from './tilemap';
import {Vec2} from './vec2';

export class Entity extends Vec2 implements SelectOption {
  readonly game: Game;
  readonly offset: Vec2;
  name: string;
  sprite: Sprite;
  blocks: boolean;
  canPickup: boolean;
  canAttack: boolean;

  constructor(game: Game, x: number, y: number, name: string, sprite: Sprite, blocks: boolean) {
    super(x, y);
    this.game = game;
    this.offset = new Vec2(0, 0);
    this.name = name;
    this.sprite = sprite;
    this.blocks = blocks;
    this.canPickup = false;
    this.canAttack = false;
  }

  get pixelX(): number {
    return this.x * this.game.tileSize.width + this.offset.x;
  }

  get pixelY(): number {
    return this.y * this.game.tileSize.height + this.offset.y;
  }

  distanceTo(other: Entity|TileMapCell) {
    return Math.hypot(other.x - this.x, other.y - this.y);
  }

  distance(x: number, y: number) {
    return Math.hypot(x - this.x, y - this.y);
  }

  draw() {
    this.sprite.draw(this.game.app, this.pixelX - this.game.viewport.x, this.pixelY - this.game.viewport.y);
  }

  sendToBack() {}

  onBump(bumper: Entity) {}
}
