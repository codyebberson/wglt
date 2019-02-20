import {Rect} from './rect';

const START_CHAR_CODE = 32;
const END_CHAR_CODE = 126;

export abstract class Font {
  abstract getOffset(charCode: number): number;
  abstract getWidth(charCode: number): number;
  abstract getHeight(): number;

  /**
   * Returns whether the character is in the printable range.
   * @param charCode The integer character ASCII code.
   */
  isInRange(charCode: number) {
    return charCode >= START_CHAR_CODE && charCode <= END_CHAR_CODE;
  }

  /**
   * Returns the width of a string with the currently configured font.
   * @param str The text string.
   */
  getStringWidth(str: string) {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      sum += this.getWidth(str.charCodeAt(i));
    }
    return sum;
  }
}

export class MonospacedFont extends Font {
  readonly glyphSize: Rect;

  constructor(glyphSize: Rect) {
    super();
    this.glyphSize = glyphSize;
  }

  getOffset(charCode: number) {
    return (charCode - START_CHAR_CODE) * this.glyphSize.width;
  }

  getWidth() {
    return this.glyphSize.width;
  }

  getHeight() {
    return this.glyphSize.height;
  }
}

export class ProportionalFont extends Font {
  readonly height: number;
  readonly widths: number[];
  readonly offsets: number[];

  constructor(height: number, widths: number[]) {
    super();
    this.height = height;
    this.widths = widths;
    this.offsets = [0];

    let offset = 0;
    for (let i = 0; i < this.widths.length; i++) {
      offset += this.widths[i];
      this.offsets.push(offset);
    }
  }

  getOffset(charCode: number) {
    return this.offsets[charCode - START_CHAR_CODE];
  }

  getWidth(charCode: number) {
    return this.widths[charCode - START_CHAR_CODE];
  }

  getHeight() {
    return this.height;
  }
}

export const FONT_04B03 = new ProportionalFont(8, [
  4, 2, 4, 6, 5, 6, 6, 2, 3, 3, 4, 4, 3, 4, 2, 6, 5, 3, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 4, 4, 4, 5,
  6, 5, 5, 4, 5, 4, 4, 5, 5, 4, 5, 5, 4, 6, 5, 5, 5, 5, 5, 5, 4, 5, 5, 6, 5, 5, 4, 3, 6, 3, 4, 5,
  3, 5, 5, 4, 5, 5, 4, 5, 5, 2, 3, 5, 2, 6, 5, 5, 5, 5, 4, 5, 4, 5, 5, 6, 4, 5, 5, 4, 2, 4, 5, 0
]);
