import { Input, InputSet } from './input';
import { Key } from './keys';
import { Point } from './point';

// Arrow keys, numpad, vi
const NORTHWEST_KEYS = [Key.VK_NUMPAD7, Key.VK_Y];
const NORTHEAST_KEYS = [Key.VK_NUMPAD9, Key.VK_U];
const SOUTHWEST_KEYS = [Key.VK_NUMPAD1, Key.VK_B];
const SOUTHEAST_KEYS = [Key.VK_NUMPAD3, Key.VK_N];
const UP_KEYS = [Key.VK_UP, Key.VK_NUMPAD8, Key.VK_K];
const LEFT_KEYS = [Key.VK_LEFT, Key.VK_NUMPAD4, Key.VK_H];
const DOWN_KEYS = [Key.VK_DOWN, Key.VK_NUMPAD2, Key.VK_J];
const RIGHT_KEYS = [Key.VK_RIGHT, Key.VK_NUMPAD6, Key.VK_L];
const WAIT_KEYS = [Key.VK_SPACE, Key.VK_NUMPAD5];
const ENTER_KEYS = [Key.VK_ENTER, Key.VK_NUMPAD_ENTER];
const ESCAPE_KEYS = [Key.VK_ESCAPE];

const DEFAULT_MOVEMENT_KEYS: Partial<Record<Key, Point>> = {
  // Up
  [Key.VK_K]: new Point(0, -1),
  [Key.VK_UP]: new Point(0, -1),
  [Key.VK_NUMPAD8]: new Point(0, -1),
  // Down
  [Key.VK_J]: new Point(0, 1),
  [Key.VK_DOWN]: new Point(0, 1),
  [Key.VK_NUMPAD2]: new Point(0, 1),
  // Left
  [Key.VK_H]: new Point(-1, 0),
  [Key.VK_LEFT]: new Point(-1, 0),
  [Key.VK_NUMPAD4]: new Point(-1, 0),
  // Right
  [Key.VK_L]: new Point(1, 0),
  [Key.VK_RIGHT]: new Point(1, 0),
  [Key.VK_NUMPAD6]: new Point(1, 0),
  // Top-left
  [Key.VK_Y]: new Point(-1, -1),
  [Key.VK_NUMPAD7]: new Point(-1, -1),
  // Top-right
  [Key.VK_U]: new Point(1, -1),
  [Key.VK_NUMPAD9]: new Point(1, -1),
  // Bottom-left
  [Key.VK_B]: new Point(-1, 1),
  [Key.VK_NUMPAD1]: new Point(-1, 1),
  // Bottom-right
  [Key.VK_N]: new Point(1, 1),
  [Key.VK_NUMPAD3]: new Point(1, 1),
  // Wait
  [Key.VK_PERIOD]: new Point(0, 0),
  [Key.VK_NUMPAD5]: new Point(0, 0),
};

export class Keyboard {
  readonly keys = new InputSet<Key>();

  /**
   * Creates a new keyboard module.
   *
   * @param el DOM el to attach listeners.
   */
  constructor(el: HTMLElement) {
    el.addEventListener('keydown', (e) => this.setKey(e, true));
    el.addEventListener('keyup', (e) => this.setKey(e, false));
  }

  clear(): void {
    this.keys.clear();
  }

  getKey(key: Key): Input {
    return this.keys.get(key);
  }

  setKey(e: KeyboardEvent, state: boolean): void {
    const key = e.code as Key;
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

  isKeyDown(key: Key): boolean {
    return this.getKey(key).down;
  }

  isKeyPressed(key: Key): boolean {
    return this.getKey(key).isPressed();
  }

  isDownLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(SOUTHWEST_KEYS);
  }

  isDownKeyPressed(): boolean {
    return this.isKeyArrayPressed(DOWN_KEYS);
  }

  isDownRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(SOUTHEAST_KEYS);
  }

  isLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(LEFT_KEYS);
  }

  isWaitKeyPressed(): boolean {
    return this.isKeyArrayPressed(WAIT_KEYS);
  }

  isRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(RIGHT_KEYS);
  }

  isUpLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(NORTHWEST_KEYS);
  }

  isUpKeyPressed(): boolean {
    return this.isKeyArrayPressed(UP_KEYS);
  }

  isUpRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(NORTHEAST_KEYS);
  }

  isEnterKeyPressed(): boolean {
    return this.isKeyArrayPressed(ENTER_KEYS);
  }

  isEscapeKeyPressed(): boolean {
    return this.isKeyArrayPressed(ESCAPE_KEYS);
  }

  /**
   * Returns a standard roguelike movement key if pressed.
   *
   * Implemented control systems:
   *
   *   1) Numpad arrows
   *   2) VIM keys
   *   3) Normal arrows (4 directions only)
   *   4) Numpad 5 and '.' (period) for "wait"
   *
   * If a key is pressed, returns the movement delta.
   *
   * If no key is pressed, returns undefined.
   *
   * See: http://www.roguebasin.com/index.php?title=Preferred_Key_Controls
   */
  getMovementKey(): Point | undefined {
    const movementKeys: Partial<Record<Key, Point>> = DEFAULT_MOVEMENT_KEYS;
    for (const [key, delta] of Object.entries(movementKeys) as [Key, Point][]) {
      if (this.isKeyPressed(key)) {
        return delta;
      }
    }
    return undefined;
  }

  private isKeyArrayPressed(keys: Key[]): boolean {
    for (let i = 0; i < keys.length; i++) {
      if (this.isKeyPressed(keys[i])) {
        return true;
      }
    }
    return false;
  }
}
