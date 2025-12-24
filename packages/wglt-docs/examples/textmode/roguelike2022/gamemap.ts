import { Console, computePath, Point, type PointLike, Rect, serializable, TileMap, TileMapCell } from 'wglt';
import { Actor } from './actor';
import { BaseComponent } from './base';
import { Colors } from './color';
import { Engine } from './engine';
import { Entity } from './entity';
import { Item } from './item';

@serializable
export class GameMap extends BaseComponent {
  width: number;
  height: number;
  entities: Entity[];
  private tileMap: TileMap;
  level = 0;
  stairsLocation = new Point(0, 0);

  constructor(engine: Engine, width: number, height: number, entities: Entity[]) {
    super(engine);
    this.width = width;
    this.height = height;
    this.entities = entities;
    this.tileMap = new TileMap(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.makeWall(x, y);
      }
    }
  }

  get actors(): Actor[] {
    return this.entities.filter((e) => e instanceof Actor && e.blocks) as Actor[];
  }

  get items(): Item[] {
    return this.entities.filter((e) => e instanceof Item) as Item[];
  }

  createRoom(room: Rect): void {
    for (let y = room.y + 1; y < room.y2; y++) {
      for (let x = room.x + 1; x < room.x2; x++) {
        this.makeFloor(x, y);
      }
    }
  }

  createHTunnel(x1: number, x2: number, y: number): void {
    for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x++) {
      this.makeFloor(x, y);
    }
  }

  createVTunnel(y1: number, y2: number, x: number): void {
    for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y++) {
      this.makeFloor(x, y);
    }
  }

  makeStairs(x: number, y: number): void {
    this.makeFloor(x, y);
    this.stairsLocation = new Point(x, y);
  }

  updateFov(x: number, y: number): void {
    this.tileMap.computeFov(x, y, 8);
    this.tileMap.updateExplored();
  }

  isVisible(x: number, y: number): boolean {
    return this.tileMap.isVisible(x, y);
  }

  isWall(x: number, y: number): boolean {
    return this.tileMap.isBlocked(x, y);
  }

  getBlockingEntity(x: number, y: number): Entity | undefined {
    return this.entities.find((e) => e.blocks && e.x === x && e.y === y);
  }

  getActor(x: number, y: number): Actor | undefined {
    return this.actors.find((e) => e.x === x && e.y === y) as Actor | undefined;
  }

  getItem(x: number, y: number): Item | undefined {
    return this.items.find((e) => e.x === x && e.y === y) as Item | undefined;
  }

  computePath(start: PointLike, end: PointLike): TileMapCell[] | undefined {
    return computePath(this.tileMap, start, end, 1000);
  }

  render(term: Console): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const tile = this.tileMap.getTile(x, y, 0);
        if (this.isVisible(x, y)) {
          // term.drawCell(x, y, tile.light);
          if (tile === 0) {
            // Draw floor
            term.drawChar(x, y, '.', Colors.LIGHT_GRAY, Colors.BLACK);
          } else {
            // Draw wall
            term.drawChar(x, y, '#', Colors.LIGHT_GRAY, Colors.BLACK);
          }
        } else if (this.tileMap.isSeen(x, y)) {
          // term.drawCell(x, y, tile.dark);
          if (tile === 0) {
            // Draw floor
            term.drawChar(x, y, '.', Colors.DARK_GRAY, Colors.BLACK);
          } else {
            // Draw wall
            term.drawChar(x, y, '#', Colors.DARK_GRAY, Colors.BLACK);
          }
        } else {
          term.drawChar(x, y, 0, Colors.BLACK, Colors.BLACK);
        }
      }
    }

    this.entities.sort((a, b) => a.renderOrder - b.renderOrder);

    for (const entity of this.entities) {
      if (this.isVisible(entity.x, entity.y)) {
        term.drawChar(entity.x, entity.y, entity.char, entity.color);
      }
    }
  }

  renderPath(console: Console, path: TileMapCell[]): void {
    for (let i = 1; i < path.length; i++) {
      const step = path[i];
      const cell = console.getCell(step.x, step.y);
      if (cell) {
        cell.setBackground(Colors.DARK_GRAY);
      }
    }
  }

  private makeWall(x: number, y: number): void {
    this.tileMap.setTile(x, y, 0, 1);
    this.tileMap.setBlocked(x, y, true, true);
  }

  private makeFloor(x: number, y: number): void {
    this.tileMap.setTile(x, y, 0, 0);
    this.tileMap.setBlocked(x, y, false, false);
  }
}
