import { Container } from '../../core/gui/container.ts';
import { Key } from '../../core/keys.ts';
import { Rect } from '../../core/rect.ts';
import { Button } from './button.ts';
import type { Component } from './component.ts';
import type { GUI } from './gui.ts';

export class ButtonSlot extends Container {
  shortcutKey?: Key;

  constructor(rect: Rect, shortcutKey?: Key) {
    super(rect);
    this.shortcutKey = shortcutKey;
  }

  get button(): Button | undefined {
    return this.children.length > 0 ? (this.children.get(0) as Button) : undefined;
  }

  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    if (this.handleChildrenInput()) {
      return true;
    }

    // const app = app;
    const mouse = app.mouse;
    const button = this.button;
    if (button) {
      if (
        (this.shortcutKey && app.keyboard.isKeyPressed(this.shortcutKey)) ||
        (this.screenRect.contains(mouse) && mouse.isClicked())
      ) {
        button.click();
        return true;
      }
    }

    return mouse.buttons.get(0).down && this.screenRect.contains(mouse);
  }

  /**
   * Returns the tooltip component for the button in this slot, if any.
   * @param gui - The GUI instance.
   * @returns The tooltip component, or undefined if no tooltip is set.
   */
  decorateTooltip(gui: GUI): Component | undefined {
    return this.button?.decorateTooltip(gui);
  }
}
