import { Key } from '../../core/keys';
import { Rect } from '../../core/rect';
import { Container } from './container';

export class Dialog extends Container {
  title?: string;
  closeButton: boolean;

  constructor(rect: Rect, title?: string) {
    super(rect);
    this.title = title;
    this.closeButton = false;
  }

  // draw(app: BaseApp): void {
  //   app.drawDialogFrame(this);
  // }

  handleInput(): boolean {
    const app = this.root?.context;
    if (!app) {
      return false;
    }

    if (this.handleChildrenInput()) {
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
