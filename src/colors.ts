
import {fromRgb} from './color';

export class Colors {
  static readonly BLACK = fromRgb(0, 0, 0);
  static readonly WHITE = fromRgb(0xff, 0xff, 0xff);
  static readonly GRAY = fromRgb(0x80, 0x80, 0x80);
  static readonly LIGHT_GRAY = fromRgb(0xaa, 0xaa, 0xaa);
  static readonly DARK_GRAY = fromRgb(0x55, 0x55, 0x55);
  static readonly YELLOW = fromRgb(0xff, 0xff, 0x55);
  static readonly BROWN = fromRgb(0xaa, 0x55, 0x00);
  static readonly RED = fromRgb(0xff, 0x00, 0x00);
  static readonly LIGHT_RED = fromRgb(0xff, 0x55, 0x55);
  static readonly DARK_RED = fromRgb(0xaa, 0x00, 0x00);
  static readonly LIGHT_GREEN = fromRgb(0x55, 0xff, 0x55);
  static readonly DARK_GREEN = fromRgb(0x00, 0xaa, 0x00);
  static readonly LIGHT_CYAN = fromRgb(0x55, 0xff, 0xff);
  static readonly DARK_CYAN = fromRgb(0x00, 0xaa, 0xaa);
  static readonly LIGHT_BLUE = fromRgb(0x55, 0x55, 0xff);
  static readonly DARK_BLUE = fromRgb(0x00, 0x00, 0xaa);
  static readonly LIGHT_MAGENTA = fromRgb(0xff, 0x55, 0xff);
  static readonly DARK_MAGENTA = fromRgb(0xaa, 0x00, 0xaa);
  static readonly ORANGE = fromRgb(0xff, 0x88, 0x00);
}
