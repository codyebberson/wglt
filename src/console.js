
import {BlendMode} from './blendmode.js';
import {Cell} from './cell.js';
import {Chars} from './chars.js';

export class Console {

  constructor(width, height) {
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

  getCell(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined;
    }
    return this.grid[y][x];
  }

  getCharCode(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return undefined;
    }
    return this.grid[y][x].charCode;
  }

  drawChar(
      x, y, c, fg, bg) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].setValue(c, fg, bg);
    }
  }

  drawString(x, y, str, fg, bg) {
    for (let i = 0; i < str.length; i++) {
      this.drawChar(x + i, y, str.charCodeAt(i), fg, bg);
    }
  }

  drawCenteredString(
      x, y, str, fg, bg) {
    this.drawString(x - Math.floor(str.length / 2), y, str, fg, bg);
  }

  drawHLine(
      x, y, width, c, fg,
      bg) {
    for (let xi = x; xi < x + width; xi++) {
      this.drawChar(xi, y, c, fg, bg);
    }
  }

  drawVLine(
      x, y, height, c, fg,
      bg) {
    for (let yi = y; yi < y + height; yi++) {
      this.drawChar(x, yi, c, fg, bg);
    }
  }

  drawRect(
      x, y, width, height, c,
      fg, bg) {
    this.drawHLine(x, y, width, c, fg, bg);
    this.drawHLine(x, y + height - 1, width, c, fg, bg);
    this.drawVLine(x, y, height, c, fg, bg);
    this.drawVLine(x + width - 1, y, height, c, fg, bg);
  }

  drawBox(
      x, y, width, height, topChar,
      rightChar, bottomChar, leftChar,
      topLeftChar, topRightChar, bottomRightChar,
      bottomLeftChar, fg, bg) {
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

  drawSingleBox(
      x, y, width, height, fg,
      bg) {
    this.drawBox(
        x, y, width, height, Chars.BOX_SINGLE_HORIZONTAL,
        Chars.BOX_SINGLE_VERTICAL, Chars.BOX_SINGLE_HORIZONTAL,
        Chars.BOX_SINGLE_VERTICAL, Chars.BOX_SINGLE_DOWN_AND_SINGLE_RIGHT,
        Chars.BOX_SINGLE_DOWN_AND_SINGLE_LEFT,
        Chars.BOX_SINGLE_UP_AND_SINGLE_LEFT,
        Chars.BOX_SINGLE_UP_AND_SINGLE_RIGHT, fg, bg);
  }

  drawDoubleBox(
      x, y, width, height, fg,
      bg) {
    this.drawBox(
        x, y, width, height, Chars.BOX_DOUBLE_HORIZONTAL,
        Chars.BOX_DOUBLE_VERTICAL, Chars.BOX_DOUBLE_HORIZONTAL,
        Chars.BOX_DOUBLE_VERTICAL, Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT,
        Chars.BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT,
        Chars.BOX_DOUBLE_UP_AND_DOUBLE_LEFT,
        Chars.BOX_DOUBLE_UP_AND_DOUBLE_RIGHT, fg, bg);
  }

  fillRect(
      x, y, width, height, c,
      fg, bg) {
    for (let yi = y; yi < y + height; yi++) {
      this.drawHLine(x, yi, width, c, fg, bg);
    }
  }

  drawConsole(
      dstX, dstY, srcConsole, srcX,
      srcY, srcWidth, srcHeight,
      blendMode) {
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

  drawCell(x, y, cell, blendMode) {
    if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
      this.grid[y][x].drawCell(cell, blendMode);
    }
  }
}
