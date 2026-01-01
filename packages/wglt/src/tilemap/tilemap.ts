import { Rect } from '../core/rect';
import { serializable } from '../core/serialize';
import type { Vec2 } from '../core/vec2';
import { TileMapCell } from './tilemapcell';
import { TileMapLayer } from './tilemaplayer';

/**
 * A TileMap represents a 2D grid-based game world with multiple layers.
 * Provides efficient tile-based rendering, field-of-view calculations,
 * and pathfinding support. Perfect for roguelikes and tile-based games.
 *
 * @example
 * ```typescript
 * // Create a 50x50 tilemap with 3 layers, 16x16 pixel tiles
 * const tileMap = new TileMap(50, 50, 3, new Rect(0, 0, 16, 16));
 *
 * // Set a wall tile at position (10, 10) on layer 0
 * const cell = tileMap.getCell(10, 10);
 * if (cell) {
 *   tileMap.setTile(10, 10, 0, 5); // Set tile ID 5 on layer 0
 *   cell.blocked = true; // Make it block movement
 *   cell.blockedSight = true; // Make it block vision
 * }
 *
 * // Compute field of view from player position
 * tileMap.computeFov(playerX, playerY, 10);
 * ```
 */
@serializable
export class TileMap {
  /** Width of the tilemap in tiles. */
  readonly width: number;
  /** Height of the tilemap in tiles. */
  readonly height: number;
  /** Number of rendering layers (depth). */
  readonly depth: number;
  /** Size and sprite sheet offset of each tile. */
  readonly tileSize: Rect;
  /** Size of the texture containing all tiles. */
  readonly textureSize: Rect;
  /** Number of tiles per row in the tile texture. */
  readonly tilesPerRow: number;
  /** 2D grid of cells containing tile properties. */
  readonly grid: TileMapCell[][];
  /** Array of tile layers for rendering. */
  readonly layers: TileMapLayer[];
  /** Whether the tilemap needs re-rendering. */
  dirty: boolean;

  /** X-coordinate of the last FOV calculation origin. */
  originX: number;
  /** Y-coordinate of the last FOV calculation origin. */
  originY: number;
  /** Currently visible area (for culling). */
  visibleRect: Rect;
  /** Previously visible area (for dirty checking). */
  prevVisibleRect: Rect;

  /**
   * Creates a new TileMap.
   * @param width - Width of the tilemap in tiles.
   * @param height - Height of the tilemap in tiles.
   * @param layerCount - Number of tile layers for depth. Defaults to 1.
   * @param tileSize - Size of each tile in pixels. Defaults to 16x16.
   * @param textureSize - Size of the tile texture in pixels. Defaults to 1024x1024.
   */
  constructor(width: number, height: number, layerCount = 1, tileSize?: Rect, textureSize?: Rect) {
    this.width = width;
    this.height = height;
    this.depth = layerCount;
    this.tileSize = tileSize ?? new Rect(0, 0, 16, 16);
    this.textureSize = textureSize ?? new Rect(0, 0, 1024, 1024);
    this.tilesPerRow = (this.textureSize.width / this.tileSize.width) | 0;
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
      this.layers[i] = new TileMapLayer(width, height, this.tilesPerRow);
    }
  }

  isOutOfRange(x: number, y: number, z = 0): boolean {
    return x < 0 || x >= this.width || y < 0 || y >= this.height || z < 0 || z >= this.depth;
  }

  clear(): void {
    for (let i = 0; i < this.layers.length; i++) {
      this.layers[i].clear();
    }
  }

  getTile(x: number, y: number, z = 0): number {
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
    if (this.isOutOfRange(x, y)) {
      return true;
    }
    return this.grid[y][x].blocked;
  }

  setBlocked(x: number, y: number, blocked: boolean, blockedSight?: boolean): void {
    if (this.isOutOfRange(x, y)) {
      return;
    }
    this.grid[y][x].blocked = blocked;
    this.grid[y][x].blockedSight = blockedSight !== undefined ? blockedSight : blocked;
  }

  getCell(x: number, y: number): TileMapCell | undefined {
    if (this.isOutOfRange(x, y)) {
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
    return !!cell?.explored;
  }

  setSeen(x: number, y: number, explored: boolean): void {
    const cell = this.getCell(x, y);
    if (cell) {
      cell.explored = explored;
    }
  }

  isAnimated(x: number, y: number, z = 0): boolean {
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
        this.grid[y][x].explored = false;
        this.grid[y][x].visible = false;
      }
    }
  }

  computeFov(
    originX: number,
    originY: number,
    radius: number,
    opt_noClear?: boolean,
    opt_octants?: number
  ): void {
    this.originX = originX;
    this.originY = originY;
    this.prevVisibleRect.copy(this.visibleRect);

    let minX = originX;
    let minY = originY;
    let maxX = originX;
    let maxY = originY;

    if (opt_noClear) {
      minX = Math.min(this.visibleRect.x1, Math.max(0, originX - radius));
      minY = Math.min(this.visibleRect.y1, Math.max(0, originY - radius));
      maxX = Math.max(this.visibleRect.x2, Math.min(this.width - 1, originX + radius));
      maxY = Math.max(this.visibleRect.y2, Math.min(this.height - 1, originY + radius));
    } else {
      minX = Math.max(0, originX - radius);
      minY = Math.max(0, originY - radius);
      maxX = Math.min(this.width - 1, originX + radius);
      maxY = Math.min(this.height - 1, originY + radius);
      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          this.grid[y][x].visible = false;
        }
      }
    }

    this.visibleRect.x = minX;
    this.visibleRect.y = minY;
    this.visibleRect.width = maxX - minX + 1;
    this.visibleRect.height = maxY - minY + 1;

    this.grid[originY][originX].visible = true;

    if (opt_octants === undefined) {
      this.computeOctantY(1, 1);
      this.computeOctantX(1, 1);
      this.computeOctantX(1, -1);
      this.computeOctantY(1, -1);
      this.computeOctantY(-1, -1);
      this.computeOctantX(-1, -1);
      this.computeOctantX(-1, 1);
      this.computeOctantY(-1, 1);
    } else {
      //   \ 4 | 3 /
      //    \  |  /
      //  5  \ | /  2
      //      \|/
      // ------+-------
      //      /|\
      //  6  / | \  1
      //    /  |  \
      //   / 7 | 0 \
      if (opt_octants & 0x001) {
        this.computeOctantY(1, 1);
      }

      if (opt_octants & 0x002) {
        this.computeOctantX(1, 1);
      }

      if (opt_octants & 0x004) {
        this.computeOctantX(1, -1);
      }

      if (opt_octants & 0x008) {
        this.computeOctantY(1, -1);
      }

      if (opt_octants & 0x010) {
        this.computeOctantY(-1, -1);
      }

      if (opt_octants & 0x020) {
        this.computeOctantX(-1, -1);
      }

      if (opt_octants & 0x040) {
        this.computeOctantX(-1, 1);
      }

      if (opt_octants & 0x080) {
        this.computeOctantY(-1, 1);
      }
    }
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
          this.grid[y][x].explored = true;
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
          this.grid[y][x].explored = true;
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
   * All visible tiles are marked as explored.
   */
  updateExplored(): void {
    for (let y = this.visibleRect.y1; y < this.visibleRect.y2; y++) {
      for (let x = this.visibleRect.x1; x < this.visibleRect.x2; x++) {
        const tile = this.grid[y][x];
        tile.explored = tile.explored || tile.visible;
      }
    }
  }

  /**
   * Moves the given rectangle by the specified velocity and checks for collisions with blocked tiles.
   * If a collision occurs, the rectangle's position and velocity are adjusted accordingly.
   * @param rect The rectangle to move.
   * @param velocity The velocity vector by which to move the rectangle.
   * @returns True if a collision occurred, false otherwise.
   */
  moveAndCollide(rect: Rect, velocity: Vec2): boolean {
    rect.x += velocity.x;
    rect.y += velocity.y;

    const rectHalfWidth = rect.width * 0.5;
    const rectHalfHeight = rect.height * 0.5;
    const tileWidth = this.tileSize.width;
    const tileHeight = this.tileSize.height;
    let collide = false;

    if (velocity.x < 0) {
      const tileX = (rect.x / tileWidth) | 0;
      const tileY = ((rect.y + rectHalfHeight) / tileHeight) | 0;
      if (this.isBlocked(tileX, tileY)) {
        rect.x = (tileX + 1) * tileWidth;
        velocity.x = 0;
        collide = true;
      }
    }

    if (velocity.x > 0) {
      const tileX = ((rect.x + rect.width - 1) / tileWidth) | 0;
      const tileY = ((rect.y + rectHalfHeight) / tileHeight) | 0;
      if (this.isBlocked(tileX, tileY)) {
        rect.x = tileX * tileWidth - rect.width;
        velocity.x = 0;
        collide = true;
      }
    }

    if (velocity.y < 0) {
      const tileX = ((rect.x + rectHalfWidth) / tileWidth) | 0;
      const tileY = (rect.y / tileHeight) | 0;
      if (this.isBlocked(tileX, tileY)) {
        rect.y = (tileY + 1) * tileHeight;
        velocity.y = 0;
        collide = true;
      }
    }

    if (velocity.y > 0) {
      const tileX = ((rect.x + rectHalfWidth) / tileWidth) | 0;
      const tileY = ((rect.y + rect.height - 1) / tileHeight) | 0;
      if (this.isBlocked(tileX, tileY)) {
        rect.y = tileY * tileHeight - rect.height;
        velocity.y = 0;
        collide = true;
      }
    }

    return collide;
  }
}
