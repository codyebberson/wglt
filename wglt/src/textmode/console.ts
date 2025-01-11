import { Color } from '../core/color';
import { Rect } from '../core/rect';
import { serializable } from '../core/serialize';
import { BlendMode } from './blendmode';
import { Cell } from './cell';
import { Chars } from './chars';

@serializable
export class Console {
  readonly grid: Cell[][];
  originX: number;
  originY: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  radius: number;
  clip?: Rect;

  constructor(
    readonly width: number,
    readonly height: number
  ) {
    this.grid = [];
    this.originX = 0;
    this.originY = 0;
    this.minX = 0;
    this.maxX = 0;
    this.minY = 0;
    this.maxY = 0;
    this.radius = 0;

    for (let y = 0; y < height; y++) {
      const row = [];
      for (let x = 0; x < width; x++) {
        row.push(new Cell(x, y));
      }
      this.grid.push(row);
    }

    this.clear();
  }

  clear(): void {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.drawChar(x, y, 0);
      }
    }
  }

  getCell(x: number, y: number): Cell | undefined {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined;
    }
    return this.grid[y][x];
  }

  getCharCode(x: number, y: number): number | undefined {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined;
    }
    return this.grid[y][x].charCode;
  }

  drawChar(x: number, y: number, c: string | number, fg?: Color, bg?: Color): void {
    if (this.clip && !this.clip.contains({ x, y })) {
      return;
    }
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y | 0][x | 0].setValue(c, fg, bg);
    }
  }

  drawString(x: number, y: number, str: string, fg?: Color, bg?: Color): void {
    const lines = str.split('\n');
    for (let i = 0; i < lines.length; i++) {
      this.drawStringLine(x, y + i, lines[i], fg, bg);
    }
  }

  drawStringLine(x: number, y: number, line: string, fg?: Color, bg?: Color): void {
    for (let j = 0; j < line.length; j++) {
      this.drawChar(x + j, y, line.charCodeAt(j), fg, bg);
    }
  }

  drawCenteredString(x: number, y: number, str: string, fg?: Color, bg?: Color): void {
    this.drawString(x - Math.floor(str.length / 2), y, str, fg, bg);
  }

  drawHLine(x: number, y: number, width: number, c: string | number, fg?: Color, bg?: Color): void {
    for (let xi = x; xi < x + width; xi++) {
      this.drawChar(xi, y, c, fg, bg);
    }
  }

  drawVLine(
    x: number,
    y: number,
    height: number,
    c: string | number,
    fg?: Color,
    bg?: Color
  ): void {
    for (let yi = y; yi < y + height; yi++) {
      this.drawChar(x, yi, c, fg, bg);
    }
  }

  drawRect(
    x: number,
    y: number,
    width: number,
    height: number,
    c: string | number,
    fg?: Color,
    bg?: Color
  ): void {
    this.drawHLine(x, y, width, c, fg, bg);
    this.drawHLine(x, y + height - 1, width, c, fg, bg);
    this.drawVLine(x, y, height, c, fg, bg);
    this.drawVLine(x + width - 1, y, height, c, fg, bg);
  }

  drawBox(
    x: number,
    y: number,
    width: number,
    height: number,
    topChar: number,
    rightChar: number,
    bottomChar: number,
    leftChar: number,
    topLeftChar: number,
    topRightChar: number,
    bottomRightChar: number,
    bottomLeftChar: number,
    fg?: Color,
    bg?: Color
  ): void {
    this.drawHLine(x, y, width, topChar, fg, bg);
    this.drawHLine(x, y + height - 1, width, bottomChar, fg, bg);

    this.drawVLine(x, y, height, leftChar, fg, bg);
    this.drawVLine(x + width - 1, y, height, rightChar, fg, bg);

    this.drawChar(x, y, topLeftChar, fg, bg);
    this.drawChar(x + width - 1, y, topRightChar, fg, bg);
    this.drawChar(x, y + height - 1, bottomLeftChar, fg, bg);
    this.drawChar(x + width - 1, y + height - 1, bottomRightChar, fg, bg);
  }

  drawSingleBox(x: number, y: number, width: number, height: number, fg?: Color, bg?: Color): void {
    this.drawBox(
      x,
      y,
      width,
      height,
      Chars.BOX_SINGLE_HORIZONTAL,
      Chars.BOX_SINGLE_VERTICAL,
      Chars.BOX_SINGLE_HORIZONTAL,
      Chars.BOX_SINGLE_VERTICAL,
      Chars.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT,
      Chars.BOX_SINGLE_DOWN_AND_SINGLE_LEFT,
      Chars.BOX_SINGLE_UP_AND_SINGLE_LEFT,
      Chars.BOX_SINGLE_UP_AND_SINGLE_RIGHT,
      fg,
      bg
    );
  }

  drawDoubleBox(x: number, y: number, width: number, height: number, fg?: Color, bg?: Color): void {
    this.drawBox(
      x,
      y,
      width,
      height,
      Chars.BOX_DOUBLE_HORIZONTAL,
      Chars.BOX_DOUBLE_VERTICAL,
      Chars.BOX_DOUBLE_HORIZONTAL,
      Chars.BOX_DOUBLE_VERTICAL,
      Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT,
      Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT,
      Chars.BOX_DOUBLE_UP_AND_DOUBLE_LEFT,
      Chars.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT,
      fg,
      bg
    );
  }

  fillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    c: string | number,
    fg?: Color,
    bg?: Color
  ): void {
    for (let yi = y; yi < y + height; yi++) {
      this.drawHLine(x, yi, width, c, fg, bg);
    }
  }

  drawConsole(
    dstX: number,
    dstY: number,
    srcConsole: Console,
    srcX: number,
    srcY: number,
    srcWidth: number,
    srcHeight: number,
    blendMode?: BlendMode
  ): void {
    for (let y = 0; y < srcHeight; y++) {
      for (let x = 0; x < srcWidth; x++) {
        const cell = srcConsole.getCell(srcX + x, srcY + y);
        if (cell) {
          this.drawCell(dstX + x, dstY + y, cell, blendMode);
        }
      }
    }
  }

  drawCell(x: number, y: number, cell: Cell, blendMode?: BlendMode): void {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].drawCell(cell, blendMode);
    }
  }
}
