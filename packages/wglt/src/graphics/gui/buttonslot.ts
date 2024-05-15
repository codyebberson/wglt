import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { Button } from './button';
import { Panel } from './panel';

export class ButtonSlot extends Panel {
  shortcutKey?: Key;

  constructor(rect: Rect, shortcutKey?: Key) {
    super(rect);
    this.shortcutKey = shortcutKey;
  }

  get button(): Button | undefined {
    return this.children.length > 0 ? (this.children.get(0) as Button) : undefined;
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }

    const dst = this.rect;
    const src = this.gui.renderer.buttonSlotRect;
    if (src) {
      this.gui.app.drawImage(dst.x, dst.y, src.x, src.y, dst.width, dst.height);
    }

    const button = this.button;
    if (button && !button.isDragging()) {
      button.rect.x = this.rect.x;
      button.rect.y = this.rect.y;
      button.rect.width = this.rect.width;
      button.rect.height = this.rect.height;
      this.drawChildren();
    }

    if (this.shortcutKey) {
      this.gui.app.drawRightString(getShortcutKeyDisplay(this.shortcutKey), dst.x2 - 3, dst.y + 3);
    }
  }

  handleInput(): boolean {
    if (!this.gui) {
      return false;
    }

    if (this.handleChildrenInput()) {
      return true;
    }

    const app = this.gui.app;
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
