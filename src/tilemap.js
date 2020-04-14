import { Cell } from "./cell.js";
import {Console} from './console.js';

// MRPAS
// Mingos' Restrictive Precise Angle Shadowcasting
// https://bitbucket.org/mingos/mrpas/overview


/**
 * The FovOctants constants provide bitmasks for various directions.
 *
 *     \ 4 | 3 /
 *      \  |  /
 *    5  \ | /  2
 *        \|/
 *   ------+-------
 *        /|\
 *    6  / | \  1
 *      /  |  \
 *     / 7 | 0 \
 *
 */
export const FovOctants = {
  OCTANT_SOUTH_SOUTHEAST: 0x001,
  OCTANT_EAST_SOUTHEAST: 0x002,
  OCTANT_EAST_NORTHTHEAST: 0x004,
  OCTANT_NORTH_NORTHEAST: 0x008,
  OCTANT_NORTH_NORTHWEST: 0x010,
  OCTANT_WEST_NORTHEAST: 0x020,
  OCTANT_WEST_SOUTHWEST: 0x040,
  OCTANT_SOUTH_SOUTHWEST: 0x080
};

export const FovQuadrants = {
  QUADRANT_SOUTHEAST: 0x001 + 0x002,
  QUADRANT_EAST: 0x002 + 0x004,
  QUADRANT_NORTHEAST: 0x004 + 0x008,
  QUADRANT_NORTH: 0x008 + 0x010,
  QUADRANT_NORTHWEST: 0x010 + 0x020,
  QUADRANT_WEST: 0x020 + 0x040,
  QUADRANT_SOUTHWEST: 0x040 + 0x080,
  QUADRANT_SOUTH: 0x080 + 0x001,
};

export function getFovQuadrant(dx, dy) {
  if (dx > 0) {
    if (dy > 0) {
      return FovQuadrants.QUADRANT_SOUTHEAST;
    } else if (dy === 0) {
      return FovQuadrants.QUADRANT_EAST;
    } else {
      return FovQuadrants.QUADRANT_NORTHEAST;
    }
  } else if (dx < 0) {
    if (dy > 0) {
      return FovQuadrants.QUADRANT_SOUTHWEST;
    } else if (dy === 0) {
      return FovQuadrants.QUADRANT_WEST;
    } else {
      return FovQuadrants.QUADRANT_NORTHWEST;
    }
  } else {
    if (dy > 0) {
      return FovQuadrants.QUADRANT_SOUTH;
    } else {
      return FovQuadrants.QUADRANT_NORTH;
    }
  }
}

export class Tile extends Cell {

  constructor(x, y) {
    super();
    this.x = x;
    this.y = y;
    this.blocked = false;
    this.blockSight = false;
    this.explored = false;
    this.visible = false;
    this.pathId = -1;
    this.g = 0.0;
    this.h = 0.0;
    this.prev = null;
  }
}

export class TileMap extends Console {

  /**
   * Creates a new FOV map.
   * @param width
   * @param height
   * @param blockedFunc
   */
  constructor(width, height, blockedFunc) {
    super(width, height, Tile);
    this.originX = 0;
    this.originY = 0;
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.radius = 0;

    if (blockedFunc) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          this.grid[y][x].blocked = blockedFunc(x, y);
        }
      }
    }
  }

  setBlocked(x, y, blocked) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].blocked = blocked;
    }
  }

  setBlockSight(x, y, blockSight) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].blockSight = blockSight;
    }
  }

  isVisible(x, y) {
    if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
      return false;
    }
    return this.grid[y][x].visible;
  }

  /**
   * Compute the FOV in an octant adjacent to the Y axis
   */
  computeOctantY(deltaX, deltaY) {
    const startSlopes = [];
    const endSlopes = [];
    let iteration = 1;
    let totalObstacles = 0;
    let obstaclesInLastLine = 0;
    let minSlope = 0;
    let x;
    let y;
    let halfSlope;
    let processedCell;
    let visible;
    let extended;
    let centreSlope;
    let startSlope;
    let endSlope;
    let previousEndSlope;

    for (y = this.originY + deltaY; y >= this.minY && y <= this.maxY;
         y += deltaY, obstaclesInLastLine = totalObstacles, ++iteration) {
      halfSlope = 0.5 / iteration;
      previousEndSlope = -1;
      for (processedCell = Math.floor(minSlope * iteration + 0.5),
          x = this.originX + (processedCell * deltaX);
           processedCell <= iteration && x >= this.minX && x <= this.maxX;
           x += deltaX, ++processedCell, previousEndSlope = endSlope) {
        visible = true;
        extended = false;
        centreSlope = processedCell / iteration;
        startSlope = previousEndSlope;
        endSlope = centreSlope + halfSlope;

        if (obstaclesInLastLine > 0) {
          if (!(this.grid[y - deltaY][x].visible &&
                !this.grid[y - deltaY][x].blockSight) &&
              !(this.grid[y - deltaY][x - deltaX].visible &&
                !this.grid[y - deltaY][x - deltaX].blockSight)) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] &&
                  endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blockSight) {
                  if (centreSlope > startSlopes[idx] &&
                      centreSlope < endSlopes[idx]) {
                    visible = false;
                    break;
                  }
                } else {
                  if (startSlope >= startSlopes[idx] &&
                      endSlope <= endSlopes[idx]) {
                    visible = false;
                    break;
                  } else {
                    startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                    endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                    extended = true;
                  }
                }
              }
            }
          }
        }
        if (visible) {
          this.grid[y][x].visible = true;
          if (this.grid[y][x].blockSight) {
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
  computeOctantX(deltaX, deltaY) {
    const startSlopes = [];
    const endSlopes = [];
    let iteration = 1;
    let totalObstacles = 0;
    let obstaclesInLastLine = 0;
    let minSlope = 0;
    let x;
    let y;
    let halfSlope;
    let processedCell;
    let visible;
    let extended;
    let centreSlope;
    let startSlope;
    let endSlope;
    let previousEndSlope;

    for (x = this.originX + deltaX; x >= this.minX && x <= this.maxX;
         x += deltaX, obstaclesInLastLine = totalObstacles, ++iteration) {
      halfSlope = 0.5 / iteration;
      previousEndSlope = -1;
      for (processedCell = Math.floor(minSlope * iteration + 0.5),
          y = this.originY + (processedCell * deltaY);
           processedCell <= iteration && y >= this.minY && y <= this.maxY;
           y += deltaY, ++processedCell, previousEndSlope = endSlope) {
        visible = true;
        extended = false;
        centreSlope = processedCell / iteration;
        startSlope = previousEndSlope;
        endSlope = centreSlope + halfSlope;

        if (obstaclesInLastLine > 0) {
          if (!(this.grid[y][x - deltaX].visible &&
                !this.grid[y][x - deltaX].blockSight) &&
              !(this.grid[y - deltaY][x - deltaX].visible &&
                !this.grid[y - deltaY][x - deltaX].blockSight)) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] &&
                  endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blockSight) {
                  if (centreSlope > startSlopes[idx] &&
                      centreSlope < endSlopes[idx]) {
                    visible = false;
                    break;
                  }
                } else {
                  if (startSlope >= startSlopes[idx] &&
                      endSlope <= endSlopes[idx]) {
                    visible = false;
                    break;
                  } else {
                    startSlopes[idx] = Math.min(startSlopes[idx], startSlope);
                    endSlopes[idx] = Math.max(endSlopes[idx], endSlope);
                    extended = true;
                  }
                }
              }
            }
          }
        }
        if (visible) {
          this.grid[y][x].visible = true;
          if (this.grid[y][x].blockSight) {
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

  computeFov(originX, originY, radius, opt_noClear, opt_octants) {
    this.originX = originX;
    this.originY = originY;
    this.radius = radius;

    if (opt_noClear) {
      this.minX = Math.min(this.minX, Math.max(0, originX - radius));
      this.minY = Math.min(this.minY, Math.max(0, originY - radius));
      this.maxX = Math.max(this.maxX, Math.min(this.width - 1, originX + radius));
      this.maxY = Math.max(this.maxY, Math.min(this.height - 1, originY + radius));

    } else {
      this.minX = Math.max(0, originX - radius);
      this.minY = Math.max(0, originY - radius);
      this.maxX = Math.min(this.width - 1, originX + radius);
      this.maxY = Math.min(this.height - 1, originY + radius);

      for (let y = this.minY; y <= this.maxY; y++) {
        for (let x = this.minX; x <= this.maxX; x++) {
          this.grid[y][x].visible = false;
        }
      }
    }

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
   * All visible tiles are marked as explored.
   */
  updateExplored() {
    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
        const tile = this.grid[y][x];
        tile.explored |= tile.visible;
      }
    }
  }
}
