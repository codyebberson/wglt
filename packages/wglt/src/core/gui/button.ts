import { Container } from '../../core/gui/container';
import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { Sprite } from '../sprite';
import { Component } from './component';
import type { GUI } from './gui';

/**
 * A clickable button component with optional keyboard shortcut and tooltip support.
 * Supports both mouse clicks and keyboard activation, with optional drag-and-drop functionality.
 *
 * @example
 * ```typescript
 * const buttonSprite = new Sprite(0, 0, 32, 32);
 * const button = new Button(
 *   new Rect(10, 10, 32, 32),
 *   buttonSprite,
 *   Key.VK_SPACE,
 *   () => console.log('Button clicked!')
 * );
 *
 * // Add tooltip
 * button.tooltip = new Label(new Rect(0, 0, 100, 20), 'Click me!');
 *
 * // Make draggable
 * button.draggable = true;
 * ```
 */
export class Button extends Container {
  /** The sprite to render for this button. */
  readonly sprite: Sprite;
  /** Optional keyboard shortcut to activate the button. */
  shortcutKey?: Key;
  /** Callback function called when the button is clicked. */
  onClick?: () => void;
  /** Optional tooltip component to display on hover. */
  tooltip?: Component;
  /** Whether this button can be dragged. */
  draggable?: boolean;

  /**
   * Creates a new Button.
   * @param destRect - The position and size of the button.
   * @param sprite - The sprite to render for the button.
   * @param shortcutKey - Optional keyboard shortcut to activate the button.
   * @param onClick - Optional callback function to call when clicked.
   */
  constructor(destRect: Rect, sprite: Sprite, shortcutKey?: Key, onClick?: () => void) {
    super(destRect);
    this.sprite = sprite;
    this.shortcutKey = shortcutKey;
    this.onClick = onClick;
  }

  /**
   * Handles input events for this button.
   * Processes keyboard shortcuts, mouse clicks, and drag operations.
   * @returns True if the input was handled by this button.
   * @override
   */
  handleInput(): boolean {
    const gui = this.root;
    if (!gui) {
      return false;
    }

    const app = gui.context;
    if (!app) {
      return false;
    }

    const mouse = app.mouse;

    if (this.draggable && this.screenRect.contains(mouse.start) && mouse.isDragging()) {
      gui.startDragging(app, this);
      return true;
    }

    if (
      (this.shortcutKey && app.keyboard.isKeyPressed(this.shortcutKey)) ||
      (this.screenRect.contains(mouse) && mouse.isClicked())
    ) {
      this.click();
      return true;
    }

    return mouse.buttons.get(0).down && this.screenRect.contains(mouse);
  }

  /**
   * Programmatically clicks the button, triggering the onClick callback.
   */
  click(): void {
    if (this.onClick) {
      this.onClick();
    }
  }

  /**
   * Configures the tooltip panel to display this button's tooltip.
   * @param _gui - The GUI instance.
   * @returns The tooltip component, or undefined if no tooltip is set.
   * @override
   */
  decorateTooltip(_gui: GUI): Component | undefined {
    return this.tooltip;
  }
}

/**
 * Converts a keyboard key code to a human-readable display string.
 * Used for showing keyboard shortcuts in the UI.
 * @param key - The keyboard key to convert.
 * @returns A string representation suitable for display.
 * @example
 * ```typescript
 * getShortcutKeyDisplay(Key.VK_A) // Returns "A"
 * getShortcutKeyDisplay(Key.VK_DIGIT1) // Returns "1"
 * getShortcutKeyDisplay(Key.VK_SLASH) // Returns "?"
 * ```
 */
export function getShortcutKeyDisplay(key: Key): string {
  if (key === Key.VK_SLASH) {
    return '?';
  }
  return key.replace('Key', '').replace('Digit', '').replace('Numpad', '');
}
