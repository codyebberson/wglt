import { Input, InputSet } from './input';

export class Keyboard {
  readonly keys = new InputSet<string>();

  /**
   * Creates a new keyboard module.
   *
   * @param el - DOM el to attach listeners.
   */
  constructor(el: HTMLElement) {
    el.addEventListener('keydown', (e) => this.setKey(e, true));
    el.addEventListener('keyup', (e) => this.setKey(e, false));
  }

  clear(): void {
    this.keys.clear();
  }

  getKey(key: string): Input {
    return this.keys.get(key);
  }

  setKey(e: KeyboardEvent, state: boolean): void {
    const key = e.code;
    if (key === Key.VK_F11) {
      // Allow fullscreen requests to go through
      return;
    }
    e.stopPropagation();
    e.preventDefault();
    this.keys.get(key).setDown(state);
  }

  updateKeys(time: number): void {
    this.keys.updateAll(time);
  }
}

export const Key = {
  VK_BACKSPACE: 'Backspace',
  VK_TAB: 'Tab',
  VK_ENTER: 'Enter',
  VK_SHIFT_LEFT: 'ShiftLeft',
  VK_SHIFT_RIGHT: 'ShiftRight',
  VK_CONTROL_LEFT: 'ControlLeft',
  VK_CONTROL_RIGHT: 'ControlRight',
  VK_ALT_LEFT: 'AltLeft',
  VK_ALT_RIGHT: 'AltRight',
  VK_PAUSE: 'Pause',
  VK_CAPS_LOCK: 'CapsLock',
  VK_ESCAPE: 'Escape',
  VK_SPACE: 'Space',
  VK_PAGE_UP: 'PageUp',
  VK_PAGE_DOWN: 'PageDown',
  VK_END: 'End',
  VK_HOME: 'Home',
  VK_LEFT: 'ArrowLeft',
  VK_UP: 'ArrowUp',
  VK_RIGHT: 'ArrowRight',
  VK_DOWN: 'ArrowDown',
  VK_INSERT: 'Insert',
  VK_DELETE: 'Delete',
  VK_0: 'Digit0',
  VK_1: 'Digit1',
  VK_2: 'Digit2',
  VK_3: 'Digit3',
  VK_4: 'Digit4',
  VK_5: 'Digit5',
  VK_6: 'Digit6',
  VK_7: 'Digit7',
  VK_8: 'Digit8',
  VK_9: 'Digit9',
  VK_SEMICOLON: 'Semicolon',
  VK_EQUALS: 'Equal',
  VK_A: 'KeyA',
  VK_B: 'KeyB',
  VK_C: 'KeyC',
  VK_D: 'KeyD',
  VK_E: 'KeyE',
  VK_F: 'KeyF',
  VK_G: 'KeyG',
  VK_H: 'KeyH',
  VK_I: 'KeyI',
  VK_J: 'KeyJ',
  VK_K: 'KeyK',
  VK_L: 'KeyL',
  VK_M: 'KeyM',
  VK_N: 'KeyN',
  VK_O: 'KeyO',
  VK_P: 'KeyP',
  VK_Q: 'KeyQ',
  VK_R: 'KeyR',
  VK_S: 'KeyS',
  VK_T: 'KeyT',
  VK_U: 'KeyU',
  VK_V: 'KeyV',
  VK_W: 'KeyW',
  VK_X: 'KeyX',
  VK_Y: 'KeyY',
  VK_Z: 'KeyZ',
  VK_CONTEXT_MENU: 'ContextMenu',
  VK_NUMPAD0: 'Numpad0',
  VK_NUMPAD1: 'Numpad1',
  VK_NUMPAD2: 'Numpad2',
  VK_NUMPAD3: 'Numpad3',
  VK_NUMPAD4: 'Numpad4',
  VK_NUMPAD5: 'Numpad5',
  VK_NUMPAD6: 'Numpad6',
  VK_NUMPAD7: 'Numpad7',
  VK_NUMPAD8: 'Numpad8',
  VK_NUMPAD9: 'Numpad9',
  VK_NUMPAD_ENTER: 'NumpadEnter',
  VK_MULTIPLY: 'NumpadMultiply',
  VK_ADD: 'NumpadAdd',
  VK_SEPARATOR: 'NumpadSeparator',
  VK_SUBTRACT: 'NumpadSubtract',
  VK_DECIMAL: 'NumpadDecimal',
  VK_DIVIDE: 'NumpadDivide',
  VK_F1: 'F1',
  VK_F2: 'F2',
  VK_F3: 'F3',
  VK_F4: 'F4',
  VK_F5: 'F5',
  VK_F6: 'F6',
  VK_F7: 'F7',
  VK_F8: 'F8',
  VK_F9: 'F9',
  VK_F10: 'F10',
  VK_F11: 'F11',
  VK_F12: 'F12',
  VK_F13: 'F13',
  VK_F14: 'F14',
  VK_F15: 'F15',
  VK_F16: 'F16',
  VK_F17: 'F17',
  VK_F18: 'F18',
  VK_F19: 'F19',
  VK_F20: 'F20',
  VK_F21: 'F21',
  VK_F22: 'F22',
  VK_F23: 'F23',
  VK_F24: 'F24',
  VK_NUM_LOCK: 'NumLock',
  VK_SCROLL_LOCK: 'ScrollLock',
  VK_COMMA: 'Comma',
  VK_PERIOD: 'Period',
  VK_SLASH: 'Slash',
  VK_BACKQUOTE: 'Backquote',
  VK_OPEN_BRACKET: 'BracketLeft',
  VK_BACK_SLASH: 'Backslash',
  VK_CLOSE_BRACKET: 'BracketRight',
  VK_QUOTE: 'Quote',
  VK_META: 'OSLeft',
};
