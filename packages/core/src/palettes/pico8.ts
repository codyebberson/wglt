import { fromRgb } from '../color';

/**
 * PICO 8 palette.
 * See: https://pico-8.fandom.com/wiki/Palette
 * See: https://lospec.com/palette-list/pico-8
 */
export const Pico8Palette = {
  BLACK: fromRgb(0, 0, 0),
  DARK_BLUE: fromRgb(29, 43, 83),
  DARK_PURPLE: fromRgb(126, 37, 83),
  DARK_GREEN: fromRgb(0, 135, 81),
  BROWN: fromRgb(171, 82, 54),
  DARK_GRAY: fromRgb(95, 87, 79),
  LIGHT_GRAY: fromRgb(194, 195, 199),
  WHITE: fromRgb(255, 241, 232),
  RED: fromRgb(255, 0, 77),
  ORANGE: fromRgb(255, 163, 0),
  YELLOW: fromRgb(255, 236, 39),
  GREEN: fromRgb(0, 228, 54),
  BLUE: fromRgb(41, 173, 255),
  LAVENDER: fromRgb(131, 118, 156),
  PINK: fromRgb(255, 119, 168),
  LIGHT_PEACH: fromRgb(255, 204, 170),

  // Extra colors
  DARKEST_GRAY: 0x291814ff,
  DARKER_BLUE: 0x111d35ff,
  DARKER_PURPLE: 0x422136ff,
  BLUE_GREEN: 0x125359ff,
  DARK_BROWN: 0x742f29ff,
  DARKER_GRAY: 0x49333bff,
  MEDIUM_GRAY: 0xa28879ff,
  LIGHT_YELLOW: 0xf3ef7dff,
  DARK_RED: 0xbe1250ff,
  DARK_ORANGE: 0xff6c24ff,
  LIGHT_GREEN: 0xa8e72eff,
  MEDIUM_GREEN: 0x00b543ff,
  MEDIUM_BLUE: 0x065ab5ff,
  MAUVE: 0x754665ff,
  DARK_PEACH: 0xff6e59ff,
  PEACH: 0xff9d81,
};
