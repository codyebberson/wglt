import {Key} from '../keys';
import {Message} from '../message';
import {Rect} from '../rect';
import {Sprite} from '../sprite';

import {Panel} from './panel';
import {TooltipDialog} from './tooltipdialog';
import { Serializable } from '../serializable';

@Serializable('Button')
export class Button extends Panel {
  readonly sprite: Sprite;
  shortcutKey?: Key;
  onClick?: Function;
  tooltipMessages?: Message[];

  constructor(destRect: Rect, sprite: Sprite, shortcutKey?: Key, onClick?: Function) {
    super(destRect);
    this.sprite = sprite;
    this.shortcutKey = shortcutKey;
    this.onClick = onClick;
  }

  drawContents() {
    if (!this.gui) {
      return;
    }

    const src = this.sprite;
    const dst = this.rect;
    const offsetX = ((dst.width - src.width) / 2) | 0;
    const offsetY = ((dst.height - src.height) / 2) | 0;
    src.draw(this.gui.app, dst.x + offsetX, dst.y + offsetY);
  }

  handleInput() {
    if (!this.gui) {
      return false;
    }

    const app = this.gui.app;
    const mouse = app.mouse;

    if (this.rect.contains(mouse.start) && mouse.isDragging()) {
      this.gui.startDragging(this);
      return true;
    }

    if ((this.shortcutKey && app.isKeyPressed(this.shortcutKey)) || (this.rect.contains(mouse) && mouse.isClicked())) {
      this.click();
      return true;
    }

    return mouse.down && this.rect.contains(mouse);
  }

  click() {
    if (this.onClick) {
      this.onClick();
    }
  }

  updateTooltip(tooltip: TooltipDialog) {
    if (this.tooltipMessages) {
      tooltip.messages = this.tooltipMessages;
      tooltip.visible = true;
    } else {
      tooltip.visible = false;
    }
  }
}