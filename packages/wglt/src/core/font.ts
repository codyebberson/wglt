import { Rect } from './rect.ts';

const START_CHAR_CODE = 32;
const END_CHAR_CODE = 126;

/**
 * The Font class represents a bitmap font with glyph rectangles and line height.
 */
export class Font {
  readonly glyphRects: Rect[];
  readonly lineHeight: number = 0;

  /**
   * Creates a monospaced font from start coordinates and monospaced glyph dimensions.
   *
   * @param startX - The starting X coordinate of the first glyph.
   * @param startY - The starting Y coordinate of the first glyph.
   * @param glyphWidth - The width of each glyph.
   * @param glyphHeight - The height of each glyph.
   * @returns A new Font instance representing the monospaced font.
   */
  static createMonospaced(
    startX: number,
    startY: number,
    glyphWidth: number,
    glyphHeight: number
  ): Font {
    const glyphRects: Rect[] = [];
    let x = startX;
    const y = startY;
    for (let i = START_CHAR_CODE; i <= END_CHAR_CODE; i++) {
      glyphRects.push(new Rect(x, y, glyphWidth, glyphHeight));
      x += glyphWidth;
    }
    return new Font(glyphRects, glyphHeight);
  }

  /**
   * Creates a proportional font from start coordinates, an array of glyph widths, and a common height.
   *
   * @param startX - The starting X coordinate of the first glyph.
   * @param startY - The starting Y coordinate of the first glyph.
   * @param widths - An array of widths for each glyph.
   * @param height - The common height for all glyphs.
   * @returns A new Font instance representing the proportional font.
   */
  static createProportional(
    startX: number,
    startY: number,
    widths: number[],
    height: number
  ): Font {
    const glyphRects: Rect[] = [];
    let x = startX;
    const y = startY;
    for (let i = 0; i < widths.length; i++) {
      const width = widths[i];
      glyphRects.push(new Rect(x, y, width, height));
      x += width;
    }
    return new Font(glyphRects, height);
  }

  /**
   * Returns whether the character is in the printable range.
   * @param charCode The integer character ASCII code.
   */
  static isInRange(charCode: number): boolean {
    return charCode >= START_CHAR_CODE && charCode <= END_CHAR_CODE;
  }

  /**
   * Creates a new Font instance.
   *
   * @param glyphRects - An array of Rect objects representing the glyph rectangles.
   * @param lineHeight - The height of a line of text.
   */
  constructor(glyphRects: Rect[], lineHeight: number) {
    this.glyphRects = glyphRects;
    this.lineHeight = lineHeight;
  }

  /**
   * Returns the glyph rectangle for the specified character code.
   *
   * @param charCode - The integer character ASCII code.
   * @returns The Rect object representing the glyph rectangle.
   */
  getGlyphRect(charCode: number): Rect {
    const glyphIndex = Font.isInRange(charCode) ? charCode - START_CHAR_CODE : 0;
    return this.glyphRects[glyphIndex];
  }

  /**
   * Returns the width of a string with the currently configured font.
   * @param str The text string.
   */
  getStringWidth(str: string): number {
    let sum = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      sum += this.getGlyphRect(charCode === 10 ? START_CHAR_CODE : charCode).width;
    }
    return sum;
  }
}

export const FONT_8X8 = Font.createMonospaced(0, 0, 8, 8);

export const FONT_04B03 = Font.createProportional(
  0,
  0,
  [
    4, 2, 4, 6, 5, 6, 6, 2, 3, 3, 4, 4, 3, 4, 2, 6, 5, 3, 5, 5, 5, 5, 5, 5, 5, 5, 2, 2, 4, 4, 4, 5,
    6, 5, 5, 4, 5, 4, 4, 5, 5, 4, 5, 5, 4, 6, 5, 5, 5, 5, 5, 5, 4, 5, 5, 6, 5, 5, 4, 3, 6, 3, 4, 5,
    3, 5, 5, 4, 5, 5, 4, 5, 5, 2, 3, 5, 2, 6, 5, 5, 5, 5, 4, 5, 4, 5, 5, 6, 4, 5, 5, 4, 2, 4, 5, 0,
  ],
  8
);
