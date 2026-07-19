import { Rect } from '../../core/rect';
import { getKeyForLetterByIndex } from '../keys';
import { Component } from './component';
import type { SelectOption } from './selectoption';

/**
 * A selectable list component that displays options and handles user selection.
 * Supports both keyboard navigation (arrow keys, letter shortcuts) and mouse interaction.
 * Commonly used for menus, inventories, and choice dialogs in roguelikes.
 *
 * Options are selected by position: the first option is bound to `a`, the
 * second to `b`, and so on (the first 26 options only).
 *
 * @example
 * ```typescript
 * const options = [
 *   { name: 'Attack' },
 *   { name: 'Defend' },
 *   { name: 'Cast Spell' },
 *   { name: 'Run Away' }
 * ];
 *
 * const selector = new SelectInput(
 *   new Rect(10, 10, 200, 100),
 *   options,
 *   (option, index) => {
 *     console.log(`Selected: ${option.name} at index ${index}`);
 *   }
 * );
 * ```
 */
export class SelectInput extends Component {
  /** Array of selectable options. */
  options: SelectOption[];
  /** Callback function invoked when an option is selected. */
  callback: (option: SelectOption, index: number) => void;
  /** Index of currently highlighted option (-1 if none selected). */
  selectedIndex = -1;
  /** Margin around the content in pixels. */
  margin = 4;
  /** Height of each line/option in pixels. */
  lineHeight = 10;

  /**
   * Creates a new SelectInput component.
   * @param rect - The position and size of the selection area.
   * @param options - Array of options that can be selected.
   * @param callback - Function called when an option is selected.
   */
  constructor(
    rect: Rect,
    options: SelectOption[],
    callback: (option: SelectOption, index: number) => void
  ) {
    super(rect);
    this.options = options as SelectOption[];
    this.callback = callback;
  }

  /**
   * Handles input for the selection component.
   * Supports:
   * - Letter keys (a-z) for direct selection by index
   * - Arrow keys (up/down) for navigation
   * - Enter to select highlighted option
   * - Escape to cancel/close
   * - Mouse clicks on options
   * @returns True if input was handled.
   * @override
   */
  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    const mouse = app.mouse;
    const keyboard = app.keyboard;

    // Handle letter key shortcuts (a, b, c, ...). Only the first 26 options get
    // a shortcut; there is no sensible key past 'z' (index 26 would map to '[').
    const shortcutCount = Math.min(this.options.length, 26);
    for (let i = 0; i < shortcutCount; i++) {
      const key = getKeyForLetterByIndex(i);
      if (keyboard.isKeyPressed(key)) {
        keyboard.clear();
        this.callback(this.options[i], i);
        return true;
      }
    }

    // Handle arrow key navigation
    if (keyboard.isUpKeyPressed()) {
      if (this.selectedIndex > 0) {
        this.selectedIndex--;
      }
      return true;
    }

    if (keyboard.isDownKeyPressed()) {
      if (this.selectedIndex < this.options.length - 1) {
        this.selectedIndex++;
      }
      return true;
    }

    // Handle enter key selection
    if (keyboard.isEnterKeyPressed() && this.selectedIndex >= 0) {
      keyboard.clear();
      this.callback(this.options[this.selectedIndex], this.selectedIndex);
      return true;
    }

    // Handle escape key
    if (keyboard.isEscapeKeyPressed()) {
      keyboard.clear();
      return true;
    }

    // Handle mouse clicks
    const offset = this.screenRect;
    if (mouse.isClicked() && mouse.x >= offset.x1 && mouse.x < offset.x2) {
      for (let i = 0; i < this.options.length; i++) {
        const startY = offset.y + this.margin + i * this.lineHeight;
        const endY = startY + this.lineHeight;
        if (mouse.y >= startY && mouse.y < endY) {
          mouse.buttons.clear();
          this.callback(this.options[i], i);
          return true;
        }
      }
    }

    // Nothing matched — let components behind this one handle the input.
    return false;
  }
}
