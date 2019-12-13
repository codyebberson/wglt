
// MRPAS
// Mingos' Restrictive Precise Angle Shadowcasting
// https://bitbucket.org/mingos/mrpas/overview

export class FovCell {

  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.blocked = false;
    this.visible = false;
    this.g = 0.0;
    this.h = 0.0;
    this.prev = null;
  }
}

export class FovMap {

  /**
   * Creates a new FOV map.
   * @param width
   * @param height
   * @param blockedFunc
   */
  constructor(
      width, height,
      blockedFunc) {
    this.width = width;
    this.height = height;

    this.grid = new Array(height);
    for (let y = 0; y < height; y++) {
      this.grid[y] = new Array(width);
      for (let x = 0; x < width; x++) {
        this.grid[y][x] = new FovCell(x, y);
      }
    }

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

  getCell(x, y) {
    return this.grid[y][x];
  }

  setBlocked(x, y, blocked) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].blocked = blocked;
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
                !this.grid[y - deltaY][x].blocked) &&
              !(this.grid[y - deltaY][x - deltaX].visible &&
                !this.grid[y - deltaY][x - deltaX].blocked)) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] &&
                  endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blocked) {
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
          if (this.grid[y][x].blocked) {
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
                !this.grid[y][x - deltaX].blocked) &&
              !(this.grid[y - deltaY][x - deltaX].visible &&
                !this.grid[y - deltaY][x - deltaX].blocked)) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] &&
                  endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blocked) {
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
          if (this.grid[y][x].blocked) {
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

  computeFov(originX, originY, radius) {
    this.originX = originX;
    this.originY = originY;
    this.radius = radius;
    this.minX = Math.max(0, originX - radius);
    this.minY = Math.max(0, originY - radius);
    this.maxX = Math.min(this.width - 1, originX + radius);
    this.maxY = Math.min(this.height - 1, originY + radius);

    for (let y = this.minY; y <= this.maxY; y++) {
      for (let x = this.minX; x <= this.maxX; x++) {
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
  }
}
