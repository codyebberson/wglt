import { Input, InputSet } from './input.ts';
import { Key } from './keys.ts';
import { Vec2 } from './vec2.ts';

// Arrow keys, numpad, vi
const NORTHWEST_KEYS = [Key.VK_NUMPAD7, Key.VK_Y] as const;
const NORTHEAST_KEYS = [Key.VK_NUMPAD9, Key.VK_U] as const;
const SOUTHWEST_KEYS = [Key.VK_NUMPAD1, Key.VK_B] as const;
const SOUTHEAST_KEYS = [Key.VK_NUMPAD3, Key.VK_N] as const;
const UP_KEYS = [Key.VK_UP, Key.VK_NUMPAD8, Key.VK_K] as const;
const LEFT_KEYS = [Key.VK_LEFT, Key.VK_NUMPAD4, Key.VK_H] as const;
const DOWN_KEYS = [Key.VK_DOWN, Key.VK_NUMPAD2, Key.VK_J] as const;
const RIGHT_KEYS = [Key.VK_RIGHT, Key.VK_NUMPAD6, Key.VK_L] as const;
const WAIT_KEYS = [Key.VK_SPACE, Key.VK_PERIOD, Key.VK_NUMPAD5] as const;
const ENTER_KEYS = [Key.VK_ENTER, Key.VK_NUMPAD_ENTER] as const;
const ESCAPE_KEYS = [Key.VK_ESCAPE] as const;
const SHIFT_KEYS = [Key.VK_SHIFT_LEFT, Key.VK_SHIFT_RIGHT] as const;

const DEFAULT_MOVEMENT_KEYS: Partial<Record<Key, Vec2>> = {
  // Up
  [Key.VK_K]: new Vec2(0, -1),
  [Key.VK_UP]: new Vec2(0, -1),
  [Key.VK_NUMPAD8]: new Vec2(0, -1),
  // Down
  [Key.VK_J]: new Vec2(0, 1),
  [Key.VK_DOWN]: new Vec2(0, 1),
  [Key.VK_NUMPAD2]: new Vec2(0, 1),
  // Left
  [Key.VK_H]: new Vec2(-1, 0),
  [Key.VK_LEFT]: new Vec2(-1, 0),
  [Key.VK_NUMPAD4]: new Vec2(-1, 0),
  // Right
  [Key.VK_L]: new Vec2(1, 0),
  [Key.VK_RIGHT]: new Vec2(1, 0),
  [Key.VK_NUMPAD6]: new Vec2(1, 0),
  // Top-left
  [Key.VK_Y]: new Vec2(-1, -1),
  [Key.VK_NUMPAD7]: new Vec2(-1, -1),
  // Top-right
  [Key.VK_U]: new Vec2(1, -1),
  [Key.VK_NUMPAD9]: new Vec2(1, -1),
  // Bottom-left
  [Key.VK_B]: new Vec2(-1, 1),
  [Key.VK_NUMPAD1]: new Vec2(-1, 1),
  // Bottom-right
  [Key.VK_N]: new Vec2(1, 1),
  [Key.VK_NUMPAD3]: new Vec2(1, 1),
  // Wait
  [Key.VK_SPACE]: new Vec2(0, 0),
  [Key.VK_PERIOD]: new Vec2(0, 0),
  [Key.VK_NUMPAD5]: new Vec2(0, 0),
};

/**
 * Handles keyboard input for WGLT applications.
 * Provides both low-level key state access and high-level convenience methods
 * for common roguelike input patterns.
 *
 * @example
 * ```typescript
 * // Basic key checking
 * if (keyboard.isKeyPressed(Key.VK_SPACE)) {
 *   // Handle space key press
 * }
 *
 * // Roguelike movement keys
 * const moveKey = keyboard.getMovementKey();
 * if (moveKey) {
 *   player.move(moveKey.x, moveKey.y);
 * }
 * ```
 */
export class Keyboard {
  /** Internal key state management. */
  readonly keys = new InputSet<Key>();
  private readonly movementKeys: Partial<Record<Key, Vec2>>;
  private readonly el: HTMLElement;
  private readonly keyDownListener: (event: KeyboardEvent) => void;
  private readonly keyUpListener: (event: KeyboardEvent) => void;

  /**
   * Creates a new keyboard input handler.
   * @param el - DOM element to attach event listeners to (usually the canvas).
   */
  constructor(el: HTMLElement, movementKeys?: Partial<Record<Key, Vec2>>) {
    this.el = el;
    this.movementKeys = movementKeys ?? DEFAULT_MOVEMENT_KEYS;
    this.keyDownListener = (event): void => this.setKey(event, true);
    this.keyUpListener = (event): void => this.setKey(event, false);
    el.addEventListener('keydown', this.keyDownListener);
    el.addEventListener('keyup', this.keyUpListener);
  }

  /** Removes the keyboard event listeners. */
  dispose(): void {
    this.el.removeEventListener('keydown', this.keyDownListener);
    this.el.removeEventListener('keyup', this.keyUpListener);
    this.clear();
  }

  /**
   * Clears all key states. Useful for state transitions or pausing.
   */
  clear(): void {
    this.keys.clear();
  }

  /**
   * Gets the Input object for a specific key.
   * @param key - The key to get input state for.
   * @returns The Input object containing press/release state.
   */
  getKey(key: Key): Input {
    return this.keys.get(key);
  }

  /**
   * Internal method to handle browser keyboard events.
   * @param e - The keyboard event from the browser.
   * @param state - True for keydown, false for keyup.
   * @private
   */
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

  /**
   * Updates all key states. Called automatically by the game loop.
   * @param time - Current time in milliseconds.
   * @internal
   */
  updateKeys(time: number): void {
    this.keys.updateAll(time);
  }

  /**
   * Checks if a key is currently held down.
   * @param key - The key to check.
   * @returns True if the key is currently pressed.
   */
  isKeyDown(key: Key): boolean {
    return this.getKey(key).down;
  }

  /**
   * Checks if a key was just pressed (including key repeat).
   * @param key - The key to check.
   * @returns True if the key was just pressed or is repeating.
   */
  isKeyPressed(key: Key): boolean {
    return this.getKey(key).isPressed();
  }

  /**
   * Checks if a down-left movement key is pressed (numpad 1, 'b').
   * @returns True if any down-left key is pressed.
   */
  isDownLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(SOUTHWEST_KEYS);
  }

  /**
   * Checks if a down movement key is pressed (down arrow, numpad 2, 'j').
   * @returns True if any down key is pressed.
   */
  isDownKeyPressed(): boolean {
    return this.isKeyArrayPressed(DOWN_KEYS);
  }

  /**
   * Checks if a down-right movement key is pressed (numpad 3, 'n').
   * @returns True if any down-right key is pressed.
   */
  isDownRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(SOUTHEAST_KEYS);
  }

  /**
   * Checks if a left movement key is pressed (left arrow, numpad 4, 'h').
   * @returns True if any left key is pressed.
   */
  isLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(LEFT_KEYS);
  }

  /**
   * Checks if a wait/rest key is pressed (space, numpad 5).
   * @returns True if any wait key is pressed.
   */
  isWaitKeyPressed(): boolean {
    return this.isKeyArrayPressed(WAIT_KEYS);
  }

  /**
   * Checks if a right movement key is pressed (right arrow, numpad 6, 'l').
   * @returns True if any right key is pressed.
   */
  isRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(RIGHT_KEYS);
  }

  /**
   * Checks if an up-left movement key is pressed (numpad 7, 'y').
   * @returns True if any up-left key is pressed.
   */
  isUpLeftKeyPressed(): boolean {
    return this.isKeyArrayPressed(NORTHWEST_KEYS);
  }

  /**
   * Checks if an up movement key is pressed (up arrow, numpad 8, 'k').
   * @returns True if any up key is pressed.
   */
  isUpKeyPressed(): boolean {
    return this.isKeyArrayPressed(UP_KEYS);
  }

  /**
   * Checks if an up-right movement key is pressed (numpad 9, 'u').
   * @returns True if any up-right key is pressed.
   */
  isUpRightKeyPressed(): boolean {
    return this.isKeyArrayPressed(NORTHEAST_KEYS);
  }

  /**
   * Checks if an enter/confirm key is pressed (enter, numpad enter).
   * @returns True if any enter key is pressed.
   */
  isEnterKeyPressed(): boolean {
    return this.isKeyArrayPressed(ENTER_KEYS);
  }

  /**
   * Checks if the escape key is pressed.
   * @returns True if escape is pressed.
   */
  isEscapeKeyPressed(): boolean {
    return this.isKeyArrayPressed(ESCAPE_KEYS);
  }

  /**
   * Checks if any shift key is pressed (left or right shift).
   * @returns True if any shift key is pressed.
   */
  isShiftKeyPressed(): boolean {
    return this.isKeyArrayPressed(SHIFT_KEYS);
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
  getMovementKey(): Vec2 | undefined {
    for (const [key, delta] of Object.entries(this.movementKeys) as [Key, Vec2][]) {
      if (this.isKeyPressed(key)) {
        return delta.clone();
      }
    }
    return undefined;
  }

  private isKeyArrayPressed(keys: readonly Key[]): boolean {
    for (let i = 0; i < keys.length; i++) {
      if (this.isKeyPressed(keys[i])) {
        return true;
      }
    }
    return false;
  }
}
