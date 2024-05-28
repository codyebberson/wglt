import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { BaseApp } from '../baseapp';
import { Panel } from './panel';

export class Dialog extends Panel {
  title?: string;
  closeButton: boolean;

  constructor(rect: Rect, title?: string) {
    super(rect);
    this.title = title;
    this.closeButton = false;
  }

  draw(app: BaseApp): void {
    app.drawDialogFrame(this);
  }

  handleInput(app: BaseApp): boolean {
    if (this.handleChildrenInput(app)) {
      return true;
    }

    if (app.isKeyPressed(Key.VK_ESCAPE)) {
      this.visible = false;
      return true;
    }

    const mouse = app.mouse;
    if (mouse.isClicked() && !this.rect.contains(mouse)) {
      this.visible = false;
      return true;
    }

    return false;
  }

  close(): void {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
}
