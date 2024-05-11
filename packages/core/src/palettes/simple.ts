import { fromRgb } from '../color';

export const SimplePalette = {
  BLACK: fromRgb(0, 0, 0),
  WHITE: fromRgb(255, 255, 255),
  RED: fromRgb(255, 0, 0),
  GREEN: fromRgb(0, 255, 0),
  BLUE: fromRgb(0, 0, 255),
  YELLOW: fromRgb(255, 255, 0),
  CYAN: fromRgb(0, 255, 255),
  MAGENTA: fromRgb(255, 0, 255),
  LIGHT_GRAY: fromRgb(0xaa, 0xaa, 0xaa),
  DARK_GRAY: fromRgb(0x55, 0x55, 0x55),
};
