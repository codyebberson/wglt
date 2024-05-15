import { Rect } from '../../core/rect';
import { TileMapCell } from './tilemapcell';
import { TileMapLayer } from './tilemaplayer';

/**
 * Returns the numeric tile ID for a given tile.
 * The underlying format is based on Tiled, an open source tilemap editor.
 * Tile 0 (zero) is a special null tile that is not rendered.
 * Tile 1 and beyond represent the tiles in left-to-right and then top-to-bottom order.
 * The arguments should be specified in tile coordinates, not pixel coordinates.
 * For example, if using 16 pixel x 16 pixel tiles, the tile at x=64, y=32 would be (4, 2).
 * @param tileX The x-coordinate of the tile in the sprite sheet.
 * @param tileY The y-coordinate of the tile in the sprite sheet.
 */
export function getTileId(tileX: number, tileY: number): number {
  return tileY * 64 + tileX;
}

/**
 * @constructor
 * @param width
 * @param height
 * @param layerCount
 */
export class TileMap {
  readonly width: number;
  readonly height: number;
  readonly depth: number;
  readonly tileSize: Rect;
  readonly grid: TileMapCell[][];
  readonly layers: TileMapLayer[];
  dirty: boolean;

  // Field-of-view state
  originX: number;
  originY: number;
  visibleRect: Rect;
  prevVisibleRect: Rect;

  constructor(width: number, height: number, layerCount: number, tileSize: Rect) {
    this.width = width;
    this.height = height;
    this.depth = layerCount;
    this.tileSize = tileSize;
    this.grid = new Array(height);
    this.layers = new Array(layerCount);
    this.dirty = true;

    // Field-of-view state
    // By default, everything is visible
    this.originX = 0;
    this.originY = 0;
    this.visibleRect = new Rect(0, 0, width, height);
    this.prevVisibleRect = new Rect(0, 0, width, height);

    for (let y = 0; y < height; y++) {
      this.grid[y] = new Array(width);
      for (let x = 0; x < width; x++) {
        this.grid[y][x] = new TileMapCell(x, y);
      }
    }

    for (let i = 0; i < layerCount; i++) {
      this.layers[i] = new TileMapLayer(width, height);
    }
  }

  isOutOfRange(x: number, y: number, z: number): boolean {
    return x < 0 || x >= this.width || y < 0 || y >= this.height || z < 0 || z >= this.depth;
  }

  clear(): void {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].clear();
    }
  }

  getTile(x: number, y: number, z: number): number {
    if (this.isOutOfRange(x, y, z)) {
      return 0;
    }
    return this.layers[z].getTile(x, y);
  }

  setTile(x: number, y: number, z: number, tile: number): void {
    if (this.isOutOfRange(x, y, z)) {
      return;
    }
    this.layers[z].setTile(x, y, tile);
  }

  isBlocked(x: number, y: number): boolean {
    if (this.isOutOfRange(x, y, 0)) {
      return true;
    }
    return this.grid[y][x].blocked;
  }

  setBlocked(x: number, y: number, blocked: boolean, blockedSight?: boolean): void {
    if (this.isOutOfRange(x, y, 0)) {
      return;
    }
    this.grid[y][x].blocked = blocked;
    this.grid[y][x].blockedSight = blockedSight !== undefined ? blockedSight : blocked;
  }

  getCell(x: number, y: number): TileMapCell | undefined {
    if (this.isOutOfRange(x, y, 0)) {
      return undefined;
    }
    return this.grid[y][x];
  }

  isVisible(x: number, y: number): boolean {
    if (
      x < this.visibleRect.x1 ||
      x >= this.visibleRect.x2 ||
      y < this.visibleRect.y1 ||
      y >= this.visibleRect.y2
    ) {
      return false;
    }
    return this.grid[y][x].visible;
  }

  isSeen(x: number, y: number): boolean {
    const cell = this.getCell(x, y);
    return !!cell?.seen;
  }

  setSeen(x: number, y: number, seen: boolean): void {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.seen = seen;
    }
  }

  isAnimated(x: number, y: number, z: number): boolean {
    if (this.isOutOfRange(x, y, z)) {
      return false;
    }
    return this.layers[z].isAnimated(x, y);
  }

  setAnimated(x: number, y: number, z: number, animated: boolean): void {
    if (this.isOutOfRange(x, y, z)) {
      return;
    }
    this.layers[z].setAnimated(x, y, animated);
  }

  resetFov(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.grid[y][x].seen = false;
        this.grid[y][x].visible = false;
      }
    }
  }

  computeFov(originX: number, originY: number, radius: number, vradius?: number): void {
    this.originX = originX;
    this.originY = originY;
    this.prevVisibleRect.copy(this.visibleRect);

    const dx = radius;
    const dy = vradius || radius;
    this.visibleRect.x = Math.max(0, originX - dx);
    this.visibleRect.y = Math.max(0, originY - dy);
    this.visibleRect.width = Math.min(this.width - 1, originX + dx) - this.visibleRect.x + 1;
    this.visibleRect.height = Math.min(this.height - 1, originY + dy) - this.visibleRect.y + 1;

    for (let y = this.visibleRect.y1; y < this.visibleRect.y2; y++) {
      for (let x = this.visibleRect.x1; x < this.visibleRect.x2; x++) {
        this.grid[y][x].visible = false;
      }
    }

    this.grid[originY][originX].visible = true;

    this.computeOctantY(1, 1);
    this.computeOctantX(1, 1);
    this.computeOctantY(1, -1);
    this.computeOctantX(1, -1);
    this.computeOctantY(-1, 1);
    this.computeOctantX(-1, 1);
    this.computeOctantY(-1, -1);
    this.computeOctantX(-1, -1);
    this.dirty = true;
  }

  /**
   * Compute the FOV in an octant adjacent to the Y axis
   */
  private computeOctantY(deltaX: number, deltaY: number): void {
    const startSlopes: number[] = [];
    const endSlopes: number[] = [];
    let iteration = 1;
    let totalObstacles = 0;
    let obstaclesInLastLine = 0;
    let minSlope = 0;
    let x: number;
    let y: number;
    let halfSlope: number;
    let processedCell: number;
    let visible: boolean;
    let extended: boolean;
    let centreSlope: number;
    let startSlope: number;
    let endSlope: number;
    let previousEndSlope: number;

    for (
      y = this.originY + deltaY;
      y >= this.visibleRect.y1 && y < this.visibleRect.y2;
      y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration
    ) {
      halfSlope = 0.5 / iteration;
      previousEndSlope = -1;
      for (
        processedCell = Math.floor(minSlope * iteration + 0.5),
          x = this.originX + processedCell * deltaX;
        processedCell <= iteration && x >= this.visibleRect.x1 && x < this.visibleRect.x2;
        x += deltaX, ++processedCell, previousEndSlope = endSlope
      ) {
        visible = true;
        extended = false;
        centreSlope = processedCell / iteration;
        startSlope = previousEndSlope;
        endSlope = centreSlope + halfSlope;

        if (obstaclesInLastLine > 0) {
          if (
            !(this.grid[y - deltaY][x].visible && !this.grid[y - deltaY][x].blockedSight) &&
            !(
              this.grid[y - deltaY][x - deltaX].visible &&
              !this.grid[y - deltaY][x - deltaX].blockedSight
            )
          ) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blockedSight) {
                  if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                    visible = false;
                    break;
                  }
                } else {
                  if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
                    visible = false;
                    break;
                  }
                  startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                  endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                  extended = true;
                }
              }
            }
          }
        }
        if (visible) {
          this.grid[y][x].visible = true;
          this.grid[y][x].seen = true;
          if (this.grid[y][x].blockedSight) {
            if (minSlope >= startSlope) {
              minSlope = endSlope;
            } else if (!extended) {
              startSlopes[totalObstacles] = startSlope;
              endSlopes[totalObstacles++] = endSlope;
            }
          }
        }
      }
    }
  }

  /**
   * Compute the FOV in an octant adjacent to the X axis
   */
  private computeOctantX(deltaX: number, deltaY: number): void {
    const startSlopes: number[] = [];
    const endSlopes: number[] = [];
    let iteration = 1;
    let totalObstacles = 0;
    let obstaclesInLastLine = 0;
    let minSlope = 0;
    let x: number;
    let y: number;
    let halfSlope: number;
    let processedCell: number;
    let visible: boolean;
    let extended: boolean;
    let centreSlope: number;
    let startSlope: number;
    let endSlope: number;
    let previousEndSlope: number;

    for (
      x = this.originX + deltaX;
      x >= this.visibleRect.x1 && x < this.visibleRect.x2;
      x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration
    ) {
      halfSlope = 0.5 / iteration;
      previousEndSlope = -1;
      for (
        processedCell = Math.floor(minSlope * iteration + 0.5),
          y = this.originY + processedCell * deltaY;
        processedCell <= iteration && y >= this.visibleRect.y1 && y < this.visibleRect.y2;
        y += deltaY, ++processedCell, previousEndSlope = endSlope
      ) {
        visible = true;
        extended = false;
        centreSlope = processedCell / iteration;
        startSlope = previousEndSlope;
        endSlope = centreSlope + halfSlope;

        if (obstaclesInLastLine > 0) {
          if (
            !(this.grid[y][x - deltaX].visible && !this.grid[y][x - deltaX].blockedSight) &&
            !(
              this.grid[y - deltaY][x - deltaX].visible &&
              !this.grid[y - deltaY][x - deltaX].blockedSight
            )
          ) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] && endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blockedSight) {
                  if (centreSlope > startSlopes[idx] && centreSlope < endSlopes[idx]) {
                    visible = false;
                    break;
                  }
                } else {
                  if (startSlope >= startSlopes[idx] && endSlope <= endSlopes[idx]) {
                    visible = false;
                    break;
                  }
                  startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                  endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                  extended = true;
                }
              }
            }
          }
        }
        if (visible) {
          this.grid[y][x].visible = true;
          this.grid[y][x].seen = true;
          if (this.grid[y][x].blockedSight) {
            if (minSlope >= startSlope) {
              minSlope = endSlope;
            } else if (!extended) {
              startSlopes[totalObstacles] = startSlope;
              endSlopes[totalObstacles++] = endSlope;
            }
          }
        }
      }
    }
  }
}
