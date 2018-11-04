
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
  private keys: Key[];

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

export const VK_ESCAPE = 27;
export const VK_SPACE = 32;
export const VK_LEFT = 37;
export const VK_UP = 38;
export const VK_RIGHT = 39;
export const VK_DOWN = 40;
export const VK_A = 65;
export const VK_D = 68;
export const VK_M = 77;
export const VK_Q = 81;
export const VK_S = 83;
export const VK_W = 87;
export const VK_Z = 90;
