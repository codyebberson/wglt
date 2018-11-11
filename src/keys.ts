
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
}

export const VK_CANCEL = 3;
export const VK_HELP = 6;
export const VK_BACK_SPACE = 8;
export const VK_TAB = 9;
export const VK_CLEAR = 12;
export const VK_RETURN = 13;
export const VK_ENTER = 14;
export const VK_SHIFT = 16;
export const VK_CONTROL = 17;
export const VK_ALT = 18;
export const VK_PAUSE = 19;
export const VK_CAPS_LOCK = 20;
export const VK_ESCAPE = 27;
export const VK_SPACE = 32;
export const VK_PAGE_UP = 33;
export const VK_PAGE_DOWN = 34;
export const VK_END = 35;
export const VK_HOME = 36;
export const VK_LEFT = 37;
export const VK_UP = 38;
export const VK_RIGHT = 39;
export const VK_DOWN = 40;
export const VK_PRINTSCREEN = 44;
export const VK_INSERT = 45;
export const VK_DELETE = 46;
export const VK_0 = 48;
export const VK_1 = 49;
export const VK_2 = 50;
export const VK_3 = 51;
export const VK_4 = 52;
export const VK_5 = 53;
export const VK_6 = 54;
export const VK_7 = 55;
export const VK_8 = 56;
export const VK_9 = 57;
export const VK_COLON = 58;
export const VK_SEMICOLON = 59;
export const VK_LESS_THAN = 60;
export const VK_EQUALS = 61;
export const VK_GREATER_THAN = 62;
export const VK_QUESTION_MARK = 63;
export const VK_AT = 64;
export const VK_A = 65;
export const VK_B = 66;
export const VK_C = 67;
export const VK_D = 68;
export const VK_E = 69;
export const VK_F = 70;
export const VK_G = 71;
export const VK_H = 72;
export const VK_I = 73;
export const VK_J = 74;
export const VK_K = 75;
export const VK_L = 76;
export const VK_M = 77;
export const VK_N = 78;
export const VK_O = 79;
export const VK_P = 80;
export const VK_Q = 81;
export const VK_R = 82;
export const VK_S = 83;
export const VK_T = 84;
export const VK_U = 85;
export const VK_V = 86;
export const VK_W = 87;
export const VK_X = 88;
export const VK_Y = 89;
export const VK_Z = 90;
export const VK_CONTEXT_MENU = 93;
export const VK_NUMPAD0 = 96;
export const VK_NUMPAD1 = 97;
export const VK_NUMPAD2 = 98;
export const VK_NUMPAD3 = 99;
export const VK_NUMPAD4 = 100;
export const VK_NUMPAD5 = 101;
export const VK_NUMPAD6 = 102;
export const VK_NUMPAD7 = 103;
export const VK_NUMPAD8 = 104;
export const VK_NUMPAD9 = 105;
export const VK_MULTIPLY = 106;
export const VK_ADD = 107;
export const VK_SEPARATOR = 108;
export const VK_SUBTRACT = 109;
export const VK_DECIMAL = 110;
export const VK_DIVIDE = 111;
export const VK_F1 = 112;
export const VK_F2 = 113;
export const VK_F3 = 114;
export const VK_F4 = 115;
export const VK_F5 = 116;
export const VK_F6 = 117;
export const VK_F7 = 118;
export const VK_F8 = 119;
export const VK_F9 = 120;
export const VK_F10 = 121;
export const VK_F11 = 122;
export const VK_F12 = 123;
export const VK_F13 = 124;
export const VK_F14 = 125;
export const VK_F15 = 126;
export const VK_F16 = 127;
export const VK_F17 = 128;
export const VK_F18 = 129;
export const VK_F19 = 130;
export const VK_F20 = 131;
export const VK_F21 = 132;
export const VK_F22 = 133;
export const VK_F23 = 134;
export const VK_F24 = 135;
export const VK_NUM_LOCK = 144;
export const VK_SCROLL_LOCK = 145;
export const VK_CIRCUMFLEX = 160;
export const VK_EXCLAMATION = 161;
export const VK_DOUBLE_QUOTE = 162;
export const VK_HASH = 163;
export const VK_DOLLAR = 164;
export const VK_PERCENT = 165;
export const VK_AMPERSAND = 166;
export const VK_UNDERSCORE = 167;
export const VK_OPEN_PAREN = 168;
export const VK_CLOSE_PAREN = 169;
export const VK_ASTERISK = 170;
export const VK_PLUS = 171;
export const VK_PIPE = 172;
export const VK_HYPHEN_MINUS = 173;
export const VK_OPEN_CURLY_BRACKET = 174;
export const VK_CLOSE_CURLY_BRACKET = 175;
export const VK_TILDE = 176;
export const VK_COMMA = 188;
export const VK_PERIOD = 190;
export const VK_SLASH = 191;
export const VK_BACK_QUOTE = 192;
export const VK_OPEN_BRACKET = 219;
export const VK_BACK_SLASH = 220;
export const VK_CLOSE_BRACKET = 221;
export const VK_QUOTE = 222;
export const VK_META = 224;
export const VK_ALTGR = 225;
export const VK_WIN = 91;
export const VK_KANA = 21;
export const VK_HANGUL = 21;
export const VK_EISU = 22;
export const VK_JUNJA = 23;
export const VK_FINAL = 24;
export const VK_HANJA = 25;
export const VK_KANJI = 25;
export const VK_CONVERT = 28;
export const VK_NONCONVERT = 29;
export const VK_ACCEPT = 30;
export const VK_MODECHANGE = 31;
export const VK_SELECT = 41;
export const VK_PRINT = 42;
export const VK_EXECUTE = 43;
export const VK_SLEEP = 95;
