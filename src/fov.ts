
// MRPAS
// Mingos' Restrictive Precise Angle Shadowcasting
// https://bitbucket.org/mingos/mrpas/overview

function createBoolMatrix(width: number, height: number) {
  const result = new Array(height);
  for (let y = 0; y < height; y++) {
    result[y] = new Array(width);
  }
  return result;
}

export class FovMap {
  private width: number;
  private height: number;
  private blocked: boolean[][];
  private visible: boolean[][];
  private originX: number;
  private originY: number;
  private minX: number;
  private maxX: number;
  private minY: number;
  private maxY: number;
  private radius: number;

  /**
   * Creates a new FOV map.
   * @constructor
   * @param width
   * @param height
   * @param blockedFunc
   */
  constructor(width: number, height: number, blockedFunc?: Function) {
    this.width = width;
    this.height = height;
    this.blocked = createBoolMatrix(width, height);
    this.visible = createBoolMatrix(width, height);
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
          this.blocked[y][x] = blockedFunc(x, y);
        }
      }
    }
  }

  setBlocked(x: number, y: number, blocked: boolean) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.blocked[y][x] = blocked;
    }
  }

  isVisible(x: number, y: number) {
    if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
      return false;
    }
    return this.visible[y][x];
  }

  /**
   * Compute the FOV in an octant adjacent to the Y axis
   */
  private computeOctantY(deltaX: number, deltaY: number) {
    const startSlopes: number[] = [];
    const endSlopes: number[] = [];
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
          if (!(this.visible[y - deltaY][x] && !this.blocked[y - deltaY][x]) &&
              !(this.visible[y - deltaY][x - deltaX] &&
                !this.blocked[y - deltaY][x - deltaX])) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] &&
                  endSlope >= startSlopes[idx]) {
                if (!this.blocked[y][x]) {
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
          this.visible[y][x] = true;
          if (this.blocked[y][x]) {
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
  private computeOctantX(deltaX: number, deltaY: number) {
    const startSlopes: number[] = [];
    const endSlopes: number[] = [];
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
          if (!(this.visible[y][x - deltaX] && !this.blocked[y][x - deltaX]) &&
              !(this.visible[y - deltaY][x - deltaX] &&
                !this.blocked[y - deltaY][x - deltaX])) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] &&
                  endSlope >= startSlopes[idx]) {
                if (!this.blocked[y][x]) {
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
          this.visible[y][x] = true;
          if (this.blocked[y][x]) {
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

  computeFov(originX: number, originY: number, radius: number) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.visible[y][x] = false;
      }
    }

    this.visible[originY][originX] = true;
    this.originX = originX;
    this.originY = originY;
    this.radius = radius;
    this.minX = Math.max(0, originX - radius);
    this.minY = Math.max(0, originY - radius);
    this.maxX = Math.min(this.width - 1, originX + radius);
    this.maxY = Math.min(this.height - 1, originY + radius);

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
