import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { Panel } from './panel';

export class Dialog extends Panel {
  closeButton: boolean;

  constructor(rect: Rect) {
    super(rect);
    this.closeButton = false;
  }

  drawContents(): void {
    if (!this.gui) {
      return;
    }
    this.gui.renderer.draw(this.gui.app, this);
  }

  handleInput(): boolean {
    if (!this.gui) {
      return false;
    }

    if (this.handleChildrenInput()) {
      return true;
    }

    if (this.gui.app.isKeyPressed(Key.VK_ESCAPE)) {
      this.visible = false;
      return true;
    }

    const mouse = this.gui.app.mouse;
    if (mouse.isClicked() && !this.rect.contains(mouse)) {
      this.visible = false;
      return true;
    }

    return false;
  }

  close(): void {
    if (!this.gui) {
      return;
    }
    this.gui.remove(this);
  }
}
