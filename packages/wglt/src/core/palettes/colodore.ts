import { fromRgb } from '../color.ts';

/**
 * Colodore palette.
 * Recalculated palette for the VIC II (Commodore 64) by Pepto.
 * See: https://www.pepto.de/projects/colorvic/
 * See: https://lospec.com/palette-list/colodore
 */
export const ColodorePalette = {
  BLACK: fromRgb(0, 0, 0),
  WHITE: fromRgb(255, 255, 255),
  RED: fromRgb(129, 51, 56),
  CYAN: fromRgb(117, 206, 200),
  VIOLET: fromRgb(142, 60, 151),
  GREEN: fromRgb(86, 172, 77),
  BLUE: fromRgb(46, 44, 155),
  YELLOW: fromRgb(237, 241, 113),
  ORANGE: fromRgb(142, 80, 41),
  BROWN: fromRgb(85, 56, 0),
  LIGHT_RED: fromRgb(196, 108, 113),
  DARK_GRAY: fromRgb(74, 74, 74),
  GRAY: fromRgb(123, 123, 123),
  LIGHT_GREEN: fromRgb(169, 255, 159),
  LIGHT_BLUE: fromRgb(112, 109, 235),
  LIGHT_GRAY: fromRgb(178, 178, 178),
} as const;
