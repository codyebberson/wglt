
import {fromRgb} from '../color';

/**
 * https://www.romanzolotarev.com/pico-8-color-palette/
 * https://twitter.com/lexaloffle/status/732649035165667329
 */
export enum Pico8Colors {
  BLACK = fromRgb(0, 0, 0),
  DARK_BLUE = fromRgb(29, 43, 83),
  DARK_PURPLE = fromRgb(126, 37, 83),
  DARK_GREEN = fromRgb(0, 135, 81),
  BROWN = fromRgb(171, 82, 54),
  DARK_GRAY = fromRgb(95, 87, 79),
  LIGHT_GRAY = fromRgb(194, 195, 199),
  WHITE = fromRgb(255, 241, 232),
  RED = fromRgb(255, 0, 77),
  ORANGE = fromRgb(255, 163, 0),
  YELLOW = fromRgb(255, 236, 39),
  GREEN = fromRgb(0, 228, 54),
  BLUE = fromRgb(41, 173, 255),
  INDIGO = fromRgb(131, 118, 156),
  PINK = fromRgb(255, 119, 168),
  PEACH = fromRgb(255, 204, 170),
}
