import { Container } from '../../core/gui/container';
import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { BaseApp } from '../baseapp';
import { Button } from './button';

export class ButtonSlot extends Container {
  shortcutKey?: Key;

  constructor(rect: Rect, shortcutKey?: Key) {
    super(rect);
    this.shortcutKey = shortcutKey;
  }

  get button(): Button | undefined {
    return this.children.length > 0 ? (this.children.get(0) as Button) : undefined;
  }

  draw(app: BaseApp): void {
    const dst = this.rect;
    app.drawPanelFrame(this);

    const button = this.button;
    if (button && !button.isDragging()) {
      button.rect.x = this.rect.x;
      button.rect.y = this.rect.y;
      button.rect.width = this.rect.width;
      button.rect.height = this.rect.height;
      this.drawChildren(app);
    }

    if (this.shortcutKey) {
      app.drawRightString(dst.x2 - 3, dst.y + 3, getShortcutKeyDisplay(this.shortcutKey));
    }
  }

  handleInput(app: BaseApp): boolean {
    // if (!this.gui) {
    //   return false;
    // }

    if (this.handleChildrenInput(app)) {
      return true;
    }

    // const app = app;
    const mouse = app.mouse;
    const button = this.button;
    if (button) {
      if (
        (this.shortcutKey && app.isKeyPressed(this.shortcutKey)) ||
        (this.rect.contains(mouse) && mouse.isClicked())
      ) {
        button.click();
        return true;
      }
    }

    return mouse.buttons.get(0).down && this.rect.contains(mouse);
  }
}

function getShortcutKeyDisplay(key: Key): string {
  if (key === Key.VK_SLASH) {
    return '?';
  }
  return key.replace('Key', '').replace('Digit', '').replace('Numpad', '');
}
