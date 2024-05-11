import { Input, InputSet } from './input';
import { Key } from './keys';

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
}
