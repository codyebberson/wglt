import { fromRgb } from '../color';

/**
 * Commodore 64 palette.
 * See: https://www.c64-wiki.com/wiki/Color
 * See: https://lospec.com/palette-list/commodore64
 */
export const Commodore64Palette = {
  BLACK: fromRgb(0, 0, 0),
  WHITE: fromRgb(255, 255, 255),
  RED: fromRgb(136, 0, 0),
  CYAN: fromRgb(170, 255, 238),
  VIOLET: fromRgb(204, 68, 204),
  GREEN: fromRgb(0, 204, 85),
  BLUE: fromRgb(0, 0, 170),
  YELLOW: fromRgb(238, 238, 119),
  ORANGE: fromRgb(221, 136, 85),
  BROWN: fromRgb(102, 68, 0),
  LIGHT_RED: fromRgb(255, 119, 119),
  DARK_GRAY: fromRgb(51, 51, 51),
  GRAY: fromRgb(119, 119, 119),
  LIGHT_GREEN: fromRgb(170, 255, 102),
  LIGHT_BLUE: fromRgb(0, 136, 255),
  LIGHT_GRAY: fromRgb(187, 187, 187),
};
