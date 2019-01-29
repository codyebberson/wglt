
import {Input} from './input';

/**
 * Number of keys to track.
 */
const KEY_COUNT = 256;

export class Keyboard {
  private readonly keys: Input[];

  /**
   * Creates a new keyboard module.
   *
   * @param el DOM el to attach listeners.
   */
  constructor(el: Element) {
    this.keys = new Array(KEY_COUNT);
    for (let i = 0; i < KEY_COUNT; i++) {
      this.keys[i] = new Input();
    }

    el.addEventListener('keydown', e => this.setKey(e as KeyboardEvent, true));
    el.addEventListener('keyup', e => this.setKey(e as KeyboardEvent, false));
  }

  private setKey(e: KeyboardEvent, state: boolean) {
    e.stopPropagation();
    e.preventDefault();
    const keyCode = e.keyCode;
    if (keyCode >= 0 && keyCode < KEY_COUNT) {
      this.keys[keyCode].down = state;
    }
  }

  update() {
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
