
import { BlendMode } from './blendmode';
import { Cell } from './cell';
import { Chars } from './chars';
import { Color } from './color';

export class Console {
  readonly width: number;
  readonly height: number;
  readonly grid: Cell[][];
  originX: number;
  originY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  radius: number;

  constructor(width: number, height: number, blockedFunc?: (x: number, y: number) => boolean) {
    this.width = width;
    this.height = height;
    this.grid = new Array();
    this.originX = 0;
    this.originY = 0;
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.radius = 0;

    for (let y = 0; y < height; y++) {
      const row = new Array();
      for (let x = 0; x < width; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }

    this.clear();

    if (blockedFunc) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          this.grid[y][x].blocked = this.grid[y][x].blockedSight = blockedFunc(x, y);
        }
      }
    }
  }

  clear() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.drawChar(x, y, 0);
      }
    }
  }

  getCell(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined;
    }
    return this.grid[y][x];
  }

  getCharCode(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined;
    }
    return this.grid[y][x].charCode;
  }

  drawChar(x: number, y: number, c: string | number, fg?: Color, bg?: Color) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y | 0][x | 0].setValue(c, fg, bg);
    }
  }

  drawString(x: number, y: number, str: string, fg?: Color, bg?: Color) {
    const lines = str.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        this.drawChar(x + j, y + i, line.charCodeAt(j), fg, bg);
      }
    }
  }

  drawCenteredString(x: number, y: number, str: string, fg?: Color, bg?: Color) {
    this.drawString(x - Math.floor(str.length / 2), y, str, fg, bg);
  }

  drawHLine(x: number, y: number, width: number, c: string | number, fg?: Color, bg?: Color) {
    for (let xi = x; xi < x + width; xi++) {
      this.drawChar(xi, y, c, fg, bg);
    }
  }

  drawVLine(x: number, y: number, height: number, c: string | number, fg?: Color, bg?: Color) {
    for (let yi = y; yi < y + height; yi++) {
      this.drawChar(x, yi, c, fg, bg);
    }
  }

  drawRect(x: number, y: number, width: number, height: number, c: string | number, fg?: Color, bg?: Color) {
    this.drawHLine(x, y, width, c, fg, bg);
    this.drawHLine(x, y + height - 1, width, c, fg, bg);
    this.drawVLine(x, y, height, c, fg, bg);
    this.drawVLine(x + width - 1, y, height, c, fg, bg);
  }

  drawBox(
    x: number, y: number, width: number, height: number,
    topChar: number, rightChar: number, bottomChar: number, leftChar: number,
    topLeftChar: number, topRightChar: number, bottomRightChar: number, bottomLeftChar: number,
    fg?: Color, bg?: Color) {
    this.fillRect(x, y, width, height, 0, fg, bg);

    this.drawHLine(x, y, width, topChar);
    this.drawHLine(x, y + height - 1, width, bottomChar);

    this.drawVLine(x, y, height, leftChar);
    this.drawVLine(x + width - 1, y, height, rightChar);

    this.drawChar(x, y, topLeftChar);
    this.drawChar(x + width - 1, y, topRightChar);
    this.drawChar(x, y + height - 1, bottomLeftChar);
    this.drawChar(x + width - 1, y + height - 1, bottomRightChar);
  }

  drawSingleBox(x: number, y: number, width: number, height: number, fg?: Color, bg?: Color) {
    this.drawBox(
      x, y, width, height, Chars.BOX_SINGLE_HORIZONTAL,
      Chars.BOX_SINGLE_VERTICAL, Chars.BOX_SINGLE_HORIZONTAL,
      Chars.BOX_SINGLE_VERTICAL, Chars.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT,
      Chars.BOX_SINGLE_DOWN_AND_SINGLE_LEFT,
      Chars.BOX_SINGLE_UP_AND_SINGLE_LEFT,
      Chars.BOX_SINGLE_UP_AND_SINGLE_RIGHT, fg, bg);
  }

  drawDoubleBox(x: number, y: number, width: number, height: number, fg?: Color, bg?: Color) {
    this.drawBox(
      x, y, width, height, Chars.BOX_DOUBLE_HORIZONTAL,
      Chars.BOX_DOUBLE_VERTICAL, Chars.BOX_DOUBLE_HORIZONTAL,
      Chars.BOX_DOUBLE_VERTICAL, Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT,
      Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT,
      Chars.BOX_DOUBLE_UP_AND_DOUBLE_LEFT,
      Chars.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT, fg, bg);
  }

  fillRect(x: number, y: number, width: number, height: number, c: string | number, fg?: Color, bg?: Color) {
    for (let yi = y; yi < y + height; yi++) {
      this.drawHLine(x, yi, width, c, fg, bg);
    }
  }

  drawConsole(
    dstX: number, dstY: number,
    srcConsole: Console,
    srcX: number, srcY: number, srcWidth: number, srcHeight: number,
    blendMode?: BlendMode) {
    blendMode = blendMode || BlendMode.None;

    for (let y = 0; y < srcHeight; y++) {
      for (let x = 0; x < srcWidth; x++) {
        const cell = srcConsole.getCell(srcX + x, srcY + y);
        if (cell) {
          this.drawCell(dstX + x, dstY + y, cell, blendMode);
        }
      }
    }
  }

  drawCell(x: number, y: number, cell: Cell, blendMode?: BlendMode) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].drawCell(cell, blendMode);
    }
  }

  setBlocked(x: number, y: number, blocked: boolean) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].blocked = blocked;
    }
  }

  setBlockedSight(x: number, y: number, blockedSight: boolean) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].blockedSight = blockedSight;
    }
  }

  isVisible(x: number, y: number) {
    if (x < this.minX || x > this.maxX || y < this.minY || y > this.maxY) {
      return false;
    }
    return this.grid[y][x].visible;
  }

  isBlocked(x: number, y: number) {
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return true;
    }
    return this.grid[y][x].blocked;
  }

  isBlockedSight(x: number, y: number) {
    if (x < 0 || x > this.width || y < 0 || y > this.height) {
      return true;
    }
    return this.grid[y][x].blockedSight;
  }

  /**
   * Compute the FOV in an octant adjacent to the Y axis
   */
  computeOctantY(deltaX: number, deltaY: number) {
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
          if (!(this.grid[y - deltaY][x].visible &&
            !this.grid[y - deltaY][x].blockedSight) &&
            !(this.grid[y - deltaY][x - deltaX].visible &&
              !this.grid[y - deltaY][x - deltaX].blockedSight)) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] &&
                endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blockedSight) {
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
  computeOctantX(deltaX: number, deltaY: number) {
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
          if (!(this.grid[y][x - deltaX].visible &&
            !this.grid[y][x - deltaX].blockedSight) &&
            !(this.grid[y - deltaY][x - deltaX].visible &&
              !this.grid[y - deltaY][x - deltaX].blockedSight)) {
            visible = false;
          } else {
            for (let idx = 0; idx < obstaclesInLastLine && visible; ++idx) {
              if (startSlope <= endSlopes[idx] &&
                endSlope >= startSlopes[idx]) {
                if (!this.grid[y][x].blockedSight) {
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

  computeFov(originX: number, originY: number, radius: number, opt_noClear?: boolean, opt_octants?: number) {
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
        tile.explored = tile.explored || tile.visible;
      }
    }
  }
}
