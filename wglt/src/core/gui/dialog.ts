import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { Panel } from './panel';

export class Dialog extends Panel {
  title?: string;
  modal: boolean;
  closeButton: boolean;

  constructor(rect: Rect, title?: string) {
    super(rect);
    this.title = title;
    this.modal = true;
    this.closeButton = false;
  }

  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    if (app.isKeyPressed(Key.VK_ESCAPE)) {
      this.visible = false;
      return true;
    }

    if (this.handleChildrenInput()) {
      return true;
    }

    const mouse = app.mouse;
    if (mouse.isClicked() && !this.screenRect.contains(mouse)) {
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
