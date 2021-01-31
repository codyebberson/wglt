import { Input } from './input';

/**
 * Number of keys to track.
 */
const KEY_COUNT = 256;

export class Keyboard {
  readonly keys: Input[];

  /**
   * Creates a new keyboard module.
   *
   * @param el DOM el to attach listeners.
   */
  constructor(el: HTMLElement) {
    this.keys = new Array(KEY_COUNT);
    for (let i = 0; i < KEY_COUNT; i++) {
      this.keys[i] = new Input();
    }

    el.addEventListener('keydown', e => this.setKey(e, true));
    el.addEventListener('keyup', e => this.setKey(e, false));
  }


  setKey(e: KeyboardEvent, state: boolean): void {
    const keyCode = e.keyCode;
    if (keyCode === Keys.VK_F11) {
      // Allow fullscreen requests to go through
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    if (keyCode >= 0 && keyCode < KEY_COUNT) {
      this.keys[keyCode].setDown(state);
    }
  }

  updateKeys(time: number): void {
    for (let i = 0; i < KEY_COUNT; i++) {
      this.keys[i].update(time);
    }
  }

  getKey(keyCode: number): Input | null {
    return keyCode >= 0 && keyCode < KEY_COUNT ? this.keys[keyCode] : null;
  }
}

export enum Keys {
  VK_CANCEL = 3,
  VK_HELP = 6,
  VK_BACK_SPACE = 8,
  VK_TAB = 9,
  VK_CLEAR = 12,
  VK_ENTER = 13,
  VK_SHIFT = 16,
  VK_CONTROL = 17,
  VK_ALT = 18,
  VK_PAUSE = 19,
  VK_CAPS_LOCK = 20,
  VK_ESCAPE = 27,
  VK_SPACE = 32,
  VK_PAGE_UP = 33,
  VK_PAGE_DOWN = 34,
  VK_END = 35,
  VK_HOME = 36,
  VK_LEFT = 37,
  VK_UP = 38,
  VK_RIGHT = 39,
  VK_DOWN = 40,
  VK_PRINTSCREEN = 44,
  VK_INSERT = 45,
  VK_DELETE = 46,
  VK_0 = 48,
  VK_1 = 49,
  VK_2 = 50,
  VK_3 = 51,
  VK_4 = 52,
  VK_5 = 53,
  VK_6 = 54,
  VK_7 = 55,
  VK_8 = 56,
  VK_9 = 57,
  VK_COLON = 58,
  VK_SEMICOLON = 59,
  VK_LESS_THAN = 60,
  VK_EQUALS = 61,
  VK_GREATER_THAN = 62,
  VK_QUESTION_MARK = 63,
  VK_AT = 64,
  VK_A = 65,
  VK_B = 66,
  VK_C = 67,
  VK_D = 68,
  VK_E = 69,
  VK_F = 70,
  VK_G = 71,
  VK_H = 72,
  VK_I = 73,
  VK_J = 74,
  VK_K = 75,
  VK_L = 76,
  VK_M = 77,
  VK_N = 78,
  VK_O = 79,
  VK_P = 80,
  VK_Q = 81,
  VK_R = 82,
  VK_S = 83,
  VK_T = 84,
  VK_U = 85,
  VK_V = 86,
  VK_W = 87,
  VK_X = 88,
  VK_Y = 89,
  VK_Z = 90,
  VK_CONTEXT_MENU = 93,
  VK_NUMPAD0 = 96,
  VK_NUMPAD1 = 97,
  VK_NUMPAD2 = 98,
  VK_NUMPAD3 = 99,
  VK_NUMPAD4 = 100,
  VK_NUMPAD5 = 101,
  VK_NUMPAD6 = 102,
  VK_NUMPAD7 = 103,
  VK_NUMPAD8 = 104,
  VK_NUMPAD9 = 105,
  VK_MULTIPLY = 106,
  VK_ADD = 107,
  VK_SEPARATOR = 108,
  VK_SUBTRACT = 109,
  VK_DECIMAL = 110,
  VK_DIVIDE = 111,
  VK_F1 = 112,
  VK_F2 = 113,
  VK_F3 = 114,
  VK_F4 = 115,
  VK_F5 = 116,
  VK_F6 = 117,
  VK_F7 = 118,
  VK_F8 = 119,
  VK_F9 = 120,
  VK_F10 = 121,
  VK_F11 = 122,
  VK_F12 = 123,
  VK_F13 = 124,
  VK_F14 = 125,
  VK_F15 = 126,
  VK_F16 = 127,
  VK_F17 = 128,
  VK_F18 = 129,
  VK_F19 = 130,
  VK_F20 = 131,
  VK_F21 = 132,
  VK_F22 = 133,
  VK_F23 = 134,
  VK_F24 = 135,
  VK_NUM_LOCK = 144,
  VK_SCROLL_LOCK = 145,
  VK_CIRCUMFLEX = 160,
  VK_EXCLAMATION = 161,
  VK_DOUBLE_QUOTE = 162,
  VK_HASH = 163,
  VK_DOLLAR = 164,
  VK_PERCENT = 165,
  VK_AMPERSAND = 166,
  VK_UNDERSCORE = 167,
  VK_OPEN_PAREN = 168,
  VK_CLOSE_PAREN = 169,
  VK_ASTERISK = 170,
  VK_PLUS = 171,
  VK_PIPE = 172,
  VK_HYPHEN_MINUS = 173,
  VK_OPEN_CURLY_BRACKET = 174,
  VK_CLOSE_CURLY_BRACKET = 175,
  VK_TILDE = 176,
  VK_COMMA = 188,
  VK_PERIOD = 190,
  VK_SLASH = 191,
  VK_BACK_QUOTE = 192,
  VK_OPEN_BRACKET = 219,
  VK_BACK_SLASH = 220,
  VK_CLOSE_BRACKET = 221,
  VK_QUOTE = 222,
  VK_META = 224,
  VK_ALTGR = 225,
  VK_WIN = 91,
  VK_KANA = 21,
  VK_HANGUL = 21,
  VK_EISU = 22,
  VK_JUNJA = 23,
  VK_FINAL = 24,
  VK_HANJA = 25,
  VK_KANJI = 25,
  VK_CONVERT = 28,
  VK_NONCONVERT = 29,
  VK_ACCEPT = 30,
  VK_MODECHANGE = 31,
  VK_SELECT = 41,
  VK_PRINT = 42,
  VK_EXECUTE = 43,
  VK_SLEEP = 95,
}
