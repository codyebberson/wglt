import { Container } from '../../core/gui/container';
import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { Sprite } from '../sprite';
import { Component } from './component';
import { GUI } from './gui';
import { Panel } from './panel';

export class Button extends Container {
  readonly sprite: Sprite;
  shortcutKey?: Key;
  onClick?: () => void;
  tooltip?: Component;
  draggable?: boolean;

  constructor(destRect: Rect, sprite: Sprite, shortcutKey?: Key, onClick?: () => void) {
    super(destRect);
    this.sprite = sprite;
    this.shortcutKey = shortcutKey;
    this.onClick = onClick;
  }

  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    const mouse = app.mouse;

    if (this.draggable && this.screenRect.contains(mouse.start) && mouse.isDragging()) {
      GUI.startDragging(app, this);
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

  click(): void {
    if (this.onClick) {
      this.onClick();
    }
  }

  decorateTooltip(tooltipPanel: Panel): void {
    if (this.tooltip) {
      this.tooltip.rect.x = 5;
      this.tooltip.rect.y = 5;
      tooltipPanel.addChild(this.tooltip);
      tooltipPanel.rect.width = this.tooltip.rect.width + 10;
      tooltipPanel.rect.height = this.tooltip.rect.height + 10;
      tooltipPanel.visible = true;
    } else {
      tooltipPanel.visible = false;
    }
  }
}
