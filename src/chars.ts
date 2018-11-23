

// https://en.wikipedia.org/wiki/Code_page_437
// https://en.wikipedia.org/wiki/Block_Elements
// https://en.wikipedia.org/wiki/Box-drawing_character

export class Chars {
  static readonly SMILEY = 1;
  static readonly INVERSE_SMILEY = 2;
  static readonly HEART = 3;
  static readonly DIAMOND = 4;
  static readonly CLUB = 5;
  static readonly SPADE = 6;
  static readonly BULLET = 7;
  static readonly INVERSE_BULLET = 8;

  static readonly LIGHT_SHADE = 176;
  static readonly MEDIUM_SHADE = 177;
  static readonly DARK_SHADE = 178;

  static readonly BOX_SINGLE_VERTICAL = 179;
  static readonly BOX_SINGLE_VERTICAL_AND_SINGLE_LEFT = 180;
  static readonly BOX_DOUBLE_VERTICAL_AND_DOUBLE_LEFT = 185;
  static readonly BOX_DOUBLE_VERTICAL = 186;
  static readonly BOX_DOUBLE_DOWN_AND_DOUBLE_LEFT = 187;
  static readonly BOX_DOUBLE_UP_AND_DOUBLE_LEFT = 188;
  static readonly BOX_SINGLE_DOWN_AND_SINGLE_LEFT = 191;
  static readonly BOX_SINGLE_UP_AND_SINGLE_RIGHT = 192;
  static readonly BOX_SINGLE_HORIZONTAL_AND_SINGLE_UP = 193;
  static readonly BOX_SINGLE_HORIZONTAL_AND_SINGLE_DOWN = 194;
  static readonly BOX_SINGLE_VERTICAL_AND_SINGLE_RIGHT = 195;
  static readonly BOX_SINGLE_HORIZONTAL = 196;
  static readonly BOX_SINGLE_VERTICAL_AND_SINGLE_HORIZONTAL = 197;
  static readonly BOX_DOUBLE_UP_AND_DOUBLE_RIGHT = 200;
  static readonly BOX_DOUBLE_DOWN_AND_DOUBLE_RIGHT = 201;
  static readonly BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_UP = 202;
  static readonly BOX_DOUBLE_HORIZONTAL_AND_DOUBLE_DOWN = 203;
  static readonly BOX_DOUBLE_VERTICAL_AND_DOUBLE_RIGHT = 204;
  static readonly BOX_DOUBLE_HORIZONTAL = 205;
  static readonly BOX_DOUBLE_VERTICAL_AND_DOUBLE_HORIZONTAL = 206;
  static readonly BOX_SINGLE_UP_AND_SINGLE_LEFT = 13 * 16 + 9;
  static readonly BOX_SINGLE_DOWN_AND_SINGLE_RIGHT = 13 * 16 + 10;

  static readonly BLOCK_TOP_LEFT = 14 * 16 + 2;
  static readonly BLOCK_TOP_RIGHT = 14 * 16 + 3;
  static readonly BLOCK_TOP_HALF = 14 * 16 + 4;
  static readonly BLOCK_BOTTOM_LEFT = 14 * 16 + 8;
  static readonly BLOCK_BOTTOM_RIGHT = 14 * 16 + 5;
  static readonly BLOCK_RIGHT_HALF = 14 * 16 + 7;
  static readonly BLOCK_CHECKER = 14 * 16 + 6;
}
