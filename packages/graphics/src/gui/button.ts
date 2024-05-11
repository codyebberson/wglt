import { Key } from '@wglt/core';
import { Rect } from '@wglt/core';
import { Message } from '../message';
import { Sprite } from '../sprite';
import { Panel } from './panel';
import { TooltipDialog } from './tooltipdialog';

export class Button extends Panel {
  readonly sprite: Sprite;
  shortcutKey?: Key;
  onClick?: () => void;
  tooltipMessages?: Message[];

  constructor(destRect: Rect, sprite: Sprite, shortcutKey?: Key, onClick?: () => void) {
    super(destRect);
    if (!sprite) {
      throw new Error('require non null sprite');
    }
    this.sprite = sprite;
    this.shortcutKey = shortcutKey;
    this.onClick = onClick;
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }

    const src = this.sprite;
    const dst = this.rect;
    const offsetX = ((dst.width - src.width) / 2) | 0;
    const offsetY = ((dst.height - src.height) / 2) | 0;
    src.draw(this.gui.app, dst.x + offsetX, dst.y + offsetY);
  }

  handleInput(): boolean {
    if (!this.gui) {
      return false;
    }

    const app = this.gui.app;
    const mouse = app.mouse;

    if (this.rect.contains(mouse.start) && mouse.isDragging()) {
      this.gui.startDragging(this);
      return true;
    }

    if (
      (this.shortcutKey && app.isKeyPressed(this.shortcutKey)) ||
      (this.rect.contains(mouse) && mouse.isClicked())
    ) {
      this.click();
      return true;
    }

    return mouse.buttons.get(0).down && this.rect.contains(mouse);
  }

  click(): void {
    if (this.onClick) {
      this.onClick();
    }
  }

  updateTooltip(tooltip: TooltipDialog): void {
    if (this.tooltipMessages) {
      tooltip.messages = this.tooltipMessages;
      tooltip.visible = true;
    } else {
      tooltip.visible = false;
    }
  }
}
