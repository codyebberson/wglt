
// find . -name '*.js' -exec sed -i -e 's/wglt.Keys.VK_/wglt.VK_/g' {} \;

/**
 * Number of keys to track.
 */
const KEY_COUNT = 256;

/**
 * Creates a new key instance.
 */
export class Key {
  down: boolean;
  downCount: number;

  constructor() {
    this.down = false;
    this.downCount = 0;
  }
}

export class Keys {
  private readonly keys: Key[];

  /**
   * Creates a new keyboard module.
   *
   * @param el DOM el to attach listeners.
   */
  constructor(el: Element) {
    this.keys = new Array(KEY_COUNT);
    for (let i = 0; i < KEY_COUNT; i++) {
      this.keys[i] = new Key();
    }

    el.addEventListener('keydown', e => this.setKey(e as KeyboardEvent, true));
    el.addEventListener('keyup', e => this.setKey(e as KeyboardEvent, false));
  }


  setKey(e: KeyboardEvent, state: boolean) {
    e.stopPropagation();
    e.preventDefault();
    const keyCode = e.keyCode;
    if (keyCode >= 0 && keyCode < KEY_COUNT) {
      this.keys[keyCode].down = state;
    }
  }

  updateKeys() {
    for (let i = 0; i < KEY_COUNT; i++) {
      if (this.keys[i].down) {
        this.keys[i].downCount++;
      } else {
        this.keys[i].downCount = 0;
      }
    }
  }

  getKey(keyCode: number) {
    return keyCode >= 0 && keyCode < KEY_COUNT ? this.keys[keyCode] : null;
  }

  static readonly VK_CANCEL = 3;
  static readonly VK_HELP = 6;
  static readonly VK_BACK_SPACE = 8;
  static readonly VK_TAB = 9;
  static readonly VK_CLEAR = 12;
  static readonly VK_RETURN = 13;
  static readonly VK_ENTER = 14;
  static readonly VK_SHIFT = 16;
  static readonly VK_CONTROL = 17;
  static readonly VK_ALT = 18;
  static readonly VK_PAUSE = 19;
  static readonly VK_CAPS_LOCK = 20;
  static readonly VK_ESCAPE = 27;
  static readonly VK_SPACE = 32;
  static readonly VK_PAGE_UP = 33;
  static readonly VK_PAGE_DOWN = 34;
  static readonly VK_END = 35;
  static readonly VK_HOME = 36;
  static readonly VK_LEFT = 37;
  static readonly VK_UP = 38;
  static readonly VK_RIGHT = 39;
  static readonly VK_DOWN = 40;
  static readonly VK_PRINTSCREEN = 44;
  static readonly VK_INSERT = 45;
  static readonly VK_DELETE = 46;
  static readonly VK_0 = 48;
  static readonly VK_1 = 49;
  static readonly VK_2 = 50;
  static readonly VK_3 = 51;
  static readonly VK_4 = 52;
  static readonly VK_5 = 53;
  static readonly VK_6 = 54;
  static readonly VK_7 = 55;
  static readonly VK_8 = 56;
  static readonly VK_9 = 57;
  static readonly VK_COLON = 58;
  static readonly VK_SEMICOLON = 59;
  static readonly VK_LESS_THAN = 60;
  static readonly VK_EQUALS = 61;
  static readonly VK_GREATER_THAN = 62;
  static readonly VK_QUESTION_MARK = 63;
  static readonly VK_AT = 64;
  static readonly VK_A = 65;
  static readonly VK_B = 66;
  static readonly VK_C = 67;
  static readonly VK_D = 68;
  static readonly VK_E = 69;
  static readonly VK_F = 70;
  static readonly VK_G = 71;
  static readonly VK_H = 72;
  static readonly VK_I = 73;
  static readonly VK_J = 74;
  static readonly VK_K = 75;
  static readonly VK_L = 76;
  static readonly VK_M = 77;
  static readonly VK_N = 78;
  static readonly VK_O = 79;
  static readonly VK_P = 80;
  static readonly VK_Q = 81;
  static readonly VK_R = 82;
  static readonly VK_S = 83;
  static readonly VK_T = 84;
  static readonly VK_U = 85;
  static readonly VK_V = 86;
  static readonly VK_W = 87;
  static readonly VK_X = 88;
  static readonly VK_Y = 89;
  static readonly VK_Z = 90;
  static readonly VK_CONTEXT_MENU = 93;
  static readonly VK_NUMPAD0 = 96;
  static readonly VK_NUMPAD1 = 97;
  static readonly VK_NUMPAD2 = 98;
  static readonly VK_NUMPAD3 = 99;
  static readonly VK_NUMPAD4 = 100;
  static readonly VK_NUMPAD5 = 101;
  static readonly VK_NUMPAD6 = 102;
  static readonly VK_NUMPAD7 = 103;
  static readonly VK_NUMPAD8 = 104;
  static readonly VK_NUMPAD9 = 105;
  static readonly VK_MULTIPLY = 106;
  static readonly VK_ADD = 107;
  static readonly VK_SEPARATOR = 108;
  static readonly VK_SUBTRACT = 109;
  static readonly VK_DECIMAL = 110;
  static readonly VK_DIVIDE = 111;
  static readonly VK_F1 = 112;
  static readonly VK_F2 = 113;
  static readonly VK_F3 = 114;
  static readonly VK_F4 = 115;
  static readonly VK_F5 = 116;
  static readonly VK_F6 = 117;
  static readonly VK_F7 = 118;
  static readonly VK_F8 = 119;
  static readonly VK_F9 = 120;
  static readonly VK_F10 = 121;
  static readonly VK_F11 = 122;
  static readonly VK_F12 = 123;
  static readonly VK_F13 = 124;
  static readonly VK_F14 = 125;
  static readonly VK_F15 = 126;
  static readonly VK_F16 = 127;
  static readonly VK_F17 = 128;
  static readonly VK_F18 = 129;
  static readonly VK_F19 = 130;
  static readonly VK_F20 = 131;
  static readonly VK_F21 = 132;
  static readonly VK_F22 = 133;
  static readonly VK_F23 = 134;
  static readonly VK_F24 = 135;
  static readonly VK_NUM_LOCK = 144;
  static readonly VK_SCROLL_LOCK = 145;
  static readonly VK_CIRCUMFLEX = 160;
  static readonly VK_EXCLAMATION = 161;
  static readonly VK_DOUBLE_QUOTE = 162;
  static readonly VK_HASH = 163;
  static readonly VK_DOLLAR = 164;
  static readonly VK_PERCENT = 165;
  static readonly VK_AMPERSAND = 166;
  static readonly VK_UNDERSCORE = 167;
  static readonly VK_OPEN_PAREN = 168;
  static readonly VK_CLOSE_PAREN = 169;
  static readonly VK_ASTERISK = 170;
  static readonly VK_PLUS = 171;
  static readonly VK_PIPE = 172;
  static readonly VK_HYPHEN_MINUS = 173;
  static readonly VK_OPEN_CURLY_BRACKET = 174;
  static readonly VK_CLOSE_CURLY_BRACKET = 175;
  static readonly VK_TILDE = 176;
  static readonly VK_COMMA = 188;
  static readonly VK_PERIOD = 190;
  static readonly VK_SLASH = 191;
  static readonly VK_BACK_QUOTE = 192;
  static readonly VK_OPEN_BRACKET = 219;
  static readonly VK_BACK_SLASH = 220;
  static readonly VK_CLOSE_BRACKET = 221;
  static readonly VK_QUOTE = 222;
  static readonly VK_META = 224;
  static readonly VK_ALTGR = 225;
  static readonly VK_WIN = 91;
  static readonly VK_KANA = 21;
  static readonly VK_HANGUL = 21;
  static readonly VK_EISU = 22;
  static readonly VK_JUNJA = 23;
  static readonly VK_FINAL = 24;
  static readonly VK_HANJA = 25;
  static readonly VK_KANJI = 25;
  static readonly VK_CONVERT = 28;
  static readonly VK_NONCONVERT = 29;
  static readonly VK_ACCEPT = 30;
  static readonly VK_MODECHANGE = 31;
  static readonly VK_SELECT = 41;
  static readonly VK_PRINT = 42;
  static readonly VK_EXECUTE = 43;
  static readonly VK_SLEEP = 95;
}
