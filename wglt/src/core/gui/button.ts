import { Container } from '../../core/gui/container';
import { Key } from '../../core/keys';
import { Message } from '../../core/message';
import { Rect } from '../../core/rect';
import { BaseApp } from '../baseapp';
import { Sprite } from '../sprite';
import { GUI } from './gui';

export class Button extends Container {
  readonly sprite: Sprite;
  shortcutKey?: Key;
  onClick?: () => void;
  tooltipMessages?: Message[];

  constructor(destRect: Rect, sprite: Sprite, shortcutKey?: Key, onClick?: () => void) {
    super(destRect);
    this.sprite = sprite;
    this.shortcutKey = shortcutKey;
    this.onClick = onClick;
  }

  draw(app: BaseApp): void {
    const src = this.sprite;
    const dst = this.rect;
    const offsetX = ((dst.width - src.width) / 2) | 0;
    const offsetY = ((dst.height - src.height) / 2) | 0;
    src.draw(app, dst.x + offsetX, dst.y + offsetY);
  }

  handleInput(app: BaseApp): boolean {
    const mouse = app.mouse;

    if (this.rect.contains(mouse.start) && mouse.isDragging()) {
      GUI.startDragging(app, this);
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

  updateTooltip(): Message[] | undefined {
    return this.tooltipMessages;
  }
}
