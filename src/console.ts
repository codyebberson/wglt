
import {BlendMode} from './blendmode';
import {Cell} from './cell';
import {Chars} from './chars';
import {Color} from './color';

export class Console {
  readonly width: number;
  readonly height: number;
  private readonly grid: Cell[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = new Array();

    for (let y = 0; y < height; y++) {
      const row = new Array();
      for (let x = 0; x < width; x++) {
        row.push(new Cell());
      }
      this.grid.push(row);
    }

    this.clear();
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

  drawChar(x: number, y: number, c: number, fg?: Color, bg?: Color) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].setValue(c, fg, bg);
    }
  }

  drawString(x: number, y: number, str: string, fg?: Color, bg?: Color) {
    for (let i = 0; i < str.length; i++) {
      this.drawChar(x + i, y, str.charCodeAt(i), fg, bg);
    }
  }

  drawCenteredString(
      x: number, y: number, str: string, fg?: Color, bg?: Color) {
    this.drawString(x - Math.floor(str.length / 2), y, str, fg, bg);
  }

  drawHLine(
      x: number, y: number, width: number, c: number, fg?: Color, bg?: Color) {
    for (let xi = x; xi < x + width; xi++) {
      this.drawChar(xi, y, c, fg, bg);
    }
  }

  drawVLine(
      x: number, y: number, height: number, c: number, fg?: Color, bg?: Color) {
    for (let yi = y; yi < y + height; yi++) {
      this.drawChar(x, yi, c, fg, bg);
    }
  }

  drawRect(
      x: number, y: number, width: number, height: number, c: number,
      fg?: Color, bg?: Color) {
    this.drawHLine(x, y, width, c, fg, bg);
    this.drawHLine(x, y + height - 1, width, c, fg, bg);
    this.drawVLine(x, y, height, c, fg, bg);
    this.drawVLine(x + width - 1, y, height, c, fg, bg);
  }

  drawDoubleBox(
      x: number, y: number, width: number, height: number, fg?: Color,
      bg?: Color) {
    this.fillRect(x, y, width, height, 0, fg, bg);

    this.drawHLine(x, y, width, Chars.BOX_DOUBLE_HORIZONTAL);
    this.drawHLine(x, y + height - 1, width, Chars.BOX_DOUBLE_HORIZONTAL);

    this.drawVLine(x, y, height, Chars.BOX_DOUBLE_VERTICAL);
    this.drawVLine(x + width - 1, y, height, Chars.BOX_DOUBLE_VERTICAL);

    this.drawChar(x, y, Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT);
    this.drawChar(x + width - 1, y, Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT);
    this.drawChar(x, y + height - 1, Chars.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT);
    this.drawChar(
        x + width - 1, y + height - 1, Chars.BOX_DOUBLE_UP_AND_DOUBLE_LEFT);
  }

  fillRect(
      x: number, y: number, width: number, height: number, c: number,
      fg?: Color, bg?: Color) {
    for (let yi = y; yi < y + height; yi++) {
      this.drawHLine(x, yi, width, c, fg, bg);
    }
  }

  drawConsole(
      dstX: number, dstY: number, srcConsole: Console, srcX: number,
      srcY: number, srcWidth: number, srcHeight: number,
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

  private drawCell(x: number, y: number, cell: Cell, blendMode: BlendMode) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].drawCell(cell, blendMode);
    }
  }
}
